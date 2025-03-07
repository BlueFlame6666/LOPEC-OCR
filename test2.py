import cv2
import numpy as np
import json
import os
import glob
from PIL import Image
from collections import defaultdict

def load_image(image_path):
    """다양한 형식(JPG, PNG, WebP 등)의 이미지를 로드합니다."""
    if image_path.lower().endswith('.webp'):
        # WebP 파일을 PIL로 열고 OpenCV 형식으로 변환
        img = Image.open(image_path)
        img = img.convert('RGB')
        img = np.array(img)
        # RGB to BGR (OpenCV 형식)
        img = img[:, :, ::-1].copy()
        return img
    else:
        # 다른 형식은 OpenCV로 직접 열기
        img = cv2.imread(image_path)
        return img

def match_templates(screenshot_path, templates_folder, mapping_json_path, threshold=0.9, debug=True):
    """
    기본적인 템플릿 매칭을 수행합니다.
    
    Args:
        screenshot_path: 스크린샷 이미지 경로
        templates_folder: 템플릿 이미지들이 있는 폴더 경로
        mapping_json_path: 매핑 테이블 JSON 파일 경로
        threshold: 매칭 임계값 (0.0-1.0)
        debug: 디버깅 모드 활성화 여부
    
    Returns:
        매칭된 템플릿과 문자 정보를 담은 목록
    """
    # 디버깅 폴더 생성
    if debug and not os.path.exists("./debug"):
        os.makedirs("./debug")
    
    # 스크린샷 로드
    screenshot = load_image(screenshot_path)
    if screenshot is None:
        raise ValueError(f"스크린샷을 로드할 수 없습니다: {screenshot_path}")
    
    # 매핑 테이블 로드
    with open(mapping_json_path, 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    all_matches = []
    
    # 템플릿 파일 목록 얻기
    template_files = sorted(glob.glob(os.path.join(templates_folder, '*.jpg')) + 
                           glob.glob(os.path.join(templates_folder, '*.png')) +
                           glob.glob(os.path.join(templates_folder, '*.webp')),
                           key=lambda x: int(os.path.basename(x).split('.')[0]))
    
    # 각 템플릿에 대해 매칭 시도
    for template_path in template_files:
        template_number = os.path.basename(template_path).split('.')[0]
        
        # 해당 템플릿 번호가 매핑 테이블에 없으면 스킵
        if template_number not in mapping:
            continue
        
        # 템플릿 이미지 로드
        template = load_image(template_path)
        if template is None:
            print(f"템플릿을 로드할 수 없습니다: {template_path}")
            continue
        
        # 템플릿 크기 확인
        if template.shape[0] > screenshot.shape[0] or template.shape[1] > screenshot.shape[1]:
            print(f"템플릿({template_path})이 스크린샷보다 큽니다. 스킵합니다.")
            continue
        
        # 템플릿 매칭 수행
        try:
            result = cv2.matchTemplate(screenshot, template, cv2.TM_CCOEFF_NORMED)
            
            # 임계값 이상의 매칭 위치 찾기
            locations = np.where(result >= threshold)
            
            # 매칭 위치가 있으면 저장
            for pt in zip(*locations[::-1]):  # x, y 순서로 변경
                character = mapping[template_number]["character"] if isinstance(mapping[template_number], dict) else mapping[template_number]
                confidence = float(result[pt[1], pt[0]])
                
                # 템플릿 크기 저장
                h, w = template.shape[:2]
                
                all_matches.append({
                    "template_number": template_number,
                    "character": character,
                    "position": {"x": int(pt[0]), "y": int(pt[1])},
                    "width": w,
                    "height": h,
                    "confidence": confidence
                })
                
                print(f"템플릿 {template_number}({character}): 매칭 위치=({pt[0]},{pt[1]}), 유사도={confidence:.4f}")
        
        except Exception as e:
            print(f"템플릿 {template_number} 매칭 중 오류 발생: {e}")
            continue
    
    # 중복 매칭 필터링
    filtered_matches = filter_overlapping_matches(all_matches)
    
    # 결과 분석 및 그룹화
    y_groups = group_matches_by_y(filtered_matches)
    
    # 디버깅: 결과 시각화
    if debug and filtered_matches:
        visualize_debug_matches(screenshot, filtered_matches, "./debug/all_matches.jpg", "All Matches")
        visualize_groups(screenshot, y_groups, "./debug/grouped_matches.jpg", "Grouped by Y-axis")
    
    return filtered_matches, y_groups

def filter_overlapping_matches(matches, distance_threshold=10):
    """
    중복 매칭을 필터링합니다.
    신뢰도가 높은 매칭을 우선적으로 유지합니다.
    """
    if not matches:
        return []
    
    # 신뢰도 기준 내림차순 정렬
    sorted_matches = sorted(matches, key=lambda x: x["confidence"], reverse=True)
    filtered = []
    
    for match in sorted_matches:
        x1, y1 = match["position"]["x"], match["position"]["y"]
        should_keep = True
        
        for kept_match in filtered:
            x2, y2 = kept_match["position"]["x"], kept_match["position"]["y"]
            distance = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
            
            if distance < distance_threshold:
                should_keep = False
                break
        
        if should_keep:
            filtered.append(match)
    
    return filtered

def group_matches_by_y(matches, y_tolerance=5):
    """
    매칭 결과를 y 좌표(높이)를 기준으로 그룹화합니다.
    """
    if not matches:
        return {}
    
    # 첫 번째 단계: 모든 y 위치 수집
    y_positions = [match["position"]["y"] for match in matches]
    
    # 두 번째 단계: y 위치 클러스터링 (단순 접근법)
    y_clusters = []
    for y in y_positions:
        # 기존 클러스터에 속하는지 확인
        found_cluster = False
        for cluster in y_clusters:
            if min(cluster) - y_tolerance <= y <= max(cluster) + y_tolerance:
                cluster.append(y)
                found_cluster = True
                break
        
        # 새 클러스터 생성
        if not found_cluster:
            y_clusters.append([y])
    
    # 세 번째 단계: 각 클러스터의 중심값 계산
    y_centers = [sum(cluster) / len(cluster) for cluster in y_clusters]
    
    # 네 번째 단계: 각 매칭을 가장 가까운 클러스터에 할당
    grouped_matches = defaultdict(list)
    
    for match in matches:
        y = match["position"]["y"]
        
        # 가장 가까운 클러스터 찾기
        min_dist = float('inf')
        best_center = None
        
        for center in y_centers:
            dist = abs(y - center)
            if dist < min_dist:
                min_dist = dist
                best_center = center
        
        # 클러스터에 매칭 추가
        if min_dist <= y_tolerance * 2:  # 안전을 위한 추가 확인
            grouped_matches[best_center].append(match)
    
    # 각 그룹 내에서 x 좌표로 정렬
    for center, group in grouped_matches.items():
        grouped_matches[center] = sorted(group, key=lambda x: x["position"]["x"])
    
    # 그룹 순서대로 정렬 (y 좌표가 작은 순서)
    ordered_groups = {}
    for center in sorted(grouped_matches.keys()):
        ordered_groups[center] = grouped_matches[center]
    
    return ordered_groups

def visualize_debug_matches(screenshot, matches, output_path, title=None):
    """디버깅을 위한 매칭 결과 시각화"""
    result_img = screenshot.copy()
    
    # 제목 추가
    if title:
        cv2.putText(result_img, title, (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    for match in matches:
        x, y = match["position"]["x"], match["position"]["y"]
        confidence = match["confidence"]
        character = match["character"]
        
        # 템플릿 크기
        w = match.get("width", 18)
        h = match.get("height", 18)
        
        # 사각형 그리기
        cv2.rectangle(result_img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
        # 문자와 신뢰도 표시
        text = f"{character} ({confidence:.2f})"
        cv2.putText(result_img, text, (x, y - 5),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
    
    # 결과 이미지 저장
    cv2.imwrite(output_path, result_img)

def visualize_groups(screenshot, y_groups, output_path, title=None):
    """그룹화된 매칭 결과를 시각화합니다."""
    result_img = screenshot.copy()
    
    # 제목 추가
    if title:
        cv2.putText(result_img, title, (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    # 그룹별 색상 (최대 10개 그룹 지원)
    group_colors = [
        (0, 255, 0),    # 녹색
        (255, 0, 0),    # 파란색
        (0, 0, 255),    # 빨간색
        (0, 255, 255),  # 노란색
        (255, 0, 255),  # 자주색
        (255, 255, 0),  # 청록색
        (128, 0, 0),    # 진한 파란색
        (0, 128, 0),    # 진한 녹색
        (0, 0, 128),    # 진한 빨간색
        (128, 128, 0)   # 올리브색
    ]
    
    # 각 그룹에 대해 처리
    for i, (y_center, matches) in enumerate(y_groups.items()):
        color = group_colors[i % len(group_colors)]
        
        # 그룹 텍스트 생성
        group_text = ''.join([m["character"] for m in matches])
        
        # 그룹 정보 표시 (이미지 왼쪽)
        y_text = int(y_center) - 30
        cv2.putText(result_img, f"Group {i+1}: {group_text}", (10, y_text), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        # 그룹 내 각 매칭 표시
        for match in matches:
            x, y = match["position"]["x"], match["position"]["y"]
            character = match["character"]
            
            # 템플릿 크기
            w = match.get("width", 18)
            h = match.get("height", 18)
            
            # 사각형 그리기
            cv2.rectangle(result_img, (x, y), (x + w, y + h), color, 2)
            
            # 문자 표시
            cv2.putText(result_img, character, (x, y - 5),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
    
    # 결과 이미지 저장
    cv2.imwrite(output_path, result_img)

def save_results(matches, y_groups, output_path):
    """결과를 JSON 파일로 저장합니다."""
    # 일반 결과 (전체 매칭)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(matches, f, ensure_ascii=False, indent=2)
    
    # 그룹화된 결과
    grouped_results = {}
    for i, (y_center, matches) in enumerate(y_groups.items()):
        group_name = f"group_{i+1}"
        group_text = ''.join([m["character"] for m in matches])
        group_matches = [{
            "character": m["character"],
            "position": m["position"],
            "confidence": m["confidence"]
        } for m in matches]
        
        grouped_results[group_name] = {
            "text": group_text,
            "y_center": float(y_center),
            "matches": group_matches
        }
    
    # 그룹화된 결과 저장
    grouped_output_path = output_path.replace('.json', '_grouped.json')
    with open(grouped_output_path, 'w', encoding='utf-8') as f:
        json.dump(grouped_results, f, ensure_ascii=False, indent=2)
    
    # 텍스트 형태로도 저장 (각 그룹을 줄바꿈으로 구분)
    text_output = '\n'.join([g["text"] for g in grouped_results.values()])
    with open(output_path.replace('.json', '.txt'), 'w', encoding='utf-8') as f:
        f.write(text_output)
    
    return grouped_results

def main():
    # 경로 설정
    screenshot_path = "test.png"  # 닉네임이 포함된 스크린샷
    templates_folder = "./screenshot/cropped"    # 템플릿 이미지가 있는 폴더
    mapping_json_path = "character_mapping.json"  # 매핑 테이블 경로
    output_path = "match_results.json"  # 결과 저장 경로
    
    # 기본 임계값 (필요에 따라 조정)
    threshold = 0.82
    
    # 템플릿 매칭 수행
    matches, y_groups = match_templates(
        screenshot_path=screenshot_path, 
        templates_folder=templates_folder, 
        mapping_json_path=mapping_json_path,
        threshold=threshold,
        debug=True
    )
    
    # 결과 저장 및 출력
    grouped_results = save_results(matches, y_groups, output_path)
    
    # 콘솔에 그룹화된 결과 출력
    print("\n===== 그룹화된 인식 결과 =====")
    for group_name, group_data in grouped_results.items():
        print(f"{group_name}: {group_data['text']} (y={group_data['y_center']:.1f})")
    
    print(f"\n매칭 완료! 총 {len(matches)}개 문자 발견")
    print(f"그룹 수: {len(y_groups)}개")
    print(f"상세 결과는 {output_path}에 저장되었습니다.")
    print(f"그룹화된 결과는 {output_path.replace('.json', '_grouped.json')}에 저장되었습니다.")
    print(f"디버깅 이미지는 ./debug 폴더에 저장되었습니다.")

if __name__ == "__main__":
    main()