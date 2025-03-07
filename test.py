import cv2
import numpy as np
import json
import os
import glob
from PIL import Image
import time
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

def match_templates_fast(screenshot_path, templates_folder, mapping_json_path, debug=True):
    """
    최적화된 빠른 템플릿 매칭을 수행합니다.
    가장 효과적인 방법만 사용하여 속도를 높이고, 각 글자에 최적화된 임계값을 적용합니다.
    """
    start_time = time.time()
    
    # 디버깅 폴더 생성
    if debug and not os.path.exists("./debug"):
        os.makedirs("./debug")
    
    # 스크린샷 로드
    screenshot = load_image(screenshot_path)
    if screenshot is None:
        raise ValueError(f"스크린샷을 로드할 수 없습니다: {screenshot_path}")
    
    # 스크린샷 그레이스케일 변환
    screenshot_gray = cv2.cvtColor(screenshot, cv2.COLOR_BGR2GRAY)
    
    # 디버깅: 원본 이미지 저장
    if debug:
        cv2.imwrite("./debug/01_screenshot_original.jpg", screenshot)
        cv2.imwrite("./debug/01_screenshot_gray.jpg", screenshot_gray)
    
    # 매핑 테이블 로드
    with open(mapping_json_path, 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    # 처리 설정 - 가장 효과적인 두 가지 방법만 사용
    configurations = [
        # (스크린샷, 그레이스케일 여부, 설명)
        (screenshot, False, "color"),
        (screenshot_gray, True, "gray"),
    ]
    
    all_matches = []
    config_matches = {}
    
    # 글자별 커스텀 임계값 설정
    # 로그를 분석하여 각 글자에 맞게 조정
    char_thresholds = {
        "귤": 0.90, "검": 0.90, "은": 0.90, 
        "연": 0.85, "주": 0.85, "먹": 0.80,
        "으": 0.90, "면": 0.85, "서": 0.90,
        "내": 0.80, "실": 0.90, "해": 0.90, "요": 0.90
    }
    
    # 기본 임계값 설정 (매핑에 없는 글자용)
    default_threshold = 0.90
    
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
        
        # 템플릿 그레이스케일 변환
        template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
        
        # 디버깅: 템플릿 저장
        if debug:
            cv2.imwrite(f"./debug/02_template_{template_number}.jpg", template)
        
        # 문자 정보 가져오기
        character = mapping[template_number]["character"] if isinstance(mapping[template_number], dict) else mapping[template_number]
        
        # 글자별 임계값 결정
        threshold = char_thresholds.get(character, default_threshold)
        
        # 모든 설정에 대해 시도
        for screenshot_img, is_gray, config_name in configurations:
            # 사용할 템플릿 선택
            template_img = template_gray if is_gray else template
            
            # 템플릿 매칭 수행
            result = cv2.matchTemplate(screenshot_img, template_img, cv2.TM_CCOEFF_NORMED)
            
            # 최대 유사도 및 위치 확인
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            print(f"[{config_name}] 템플릿 {template_number}({character}): 최대 유사도 = {max_val:.4f}, 임계값 = {threshold:.2f}")
            
            # 임계값 이상의 매칭 위치 찾기
            locations = np.where(result >= threshold)
            
            # 템플릿 크기 저장 (시각화 및 결과 활용)
            h, w = template_img.shape[:2] if len(template_img.shape) > 2 else template_img.shape
            
            # 매칭 위치가 있으면 저장
            for pt in zip(*locations[::-1]):  # x, y 순서로 변경
                confidence = float(result[pt[1], pt[0]])
                
                # 결과 저장
                match_info = {
                    "template_number": template_number,
                    "character": character,
                    "position": {"x": int(pt[0]), "y": int(pt[1])},
                    "width": w,
                    "height": h,
                    "confidence": confidence,
                    "config": config_name
                }
                
                if config_name not in config_matches:
                    config_matches[config_name] = []
                config_matches[config_name].append(match_info)
                all_matches.append(match_info)
    
    # 중복 매칭 필터링
    filtered_matches = filter_overlapping_matches(all_matches)
    
    # 결과 분석 및 그룹화
    y_groups = group_matches_by_y(filtered_matches)
    
    # 디버깅: 설정별 결과 시각화
    for config_name, matches in config_matches.items():
        if matches:
            filtered_config_matches = filter_overlapping_matches(matches)
            if filtered_config_matches:
                visualize_debug_matches(
                    screenshot, 
                    filtered_config_matches, 
                    f"./debug/03_result_{config_name}.jpg",
                    title=f"Method: {config_name}"
                )
                
                # 설정별 결과 출력
                chars = ''.join([m["character"] for m in sorted(filtered_config_matches, key=lambda x: x["position"]["x"])])
                print(f"\n[{config_name}] 인식된 글자 수: {len(filtered_config_matches)}")
                print(f"[{config_name}] 인식된 텍스트: {chars}")
    
    # 디버깅: 최종 결과 시각화 (그룹별로 색상 구분)
    if debug and filtered_matches:
        visualize_groups(screenshot, y_groups, "./debug/04_final_result_grouped.jpg", "Grouped by Y-axis")
    
    end_time = time.time()
    print(f"\n매칭 소요 시간: {end_time - start_time:.2f}초, 최종 매칭: {len(filtered_matches)}개")
    
    return filtered_matches, y_groups

def filter_overlapping_matches(matches, distance_threshold=10):
    """중복 매칭을 필터링합니다."""
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
    
    Args:
        matches: 매칭 결과 목록
        y_tolerance: y 좌표 차이 허용 범위 (픽셀)
        
    Returns:
        y 좌표로 그룹화된 매칭 결과 딕셔너리
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
        config = match.get("config", "")
        
        # 설정에 따른 색상 지정
        color = (0, 255, 0) if config == "color" else (255, 0, 0)  # 컬러=녹색, 그레이=파란색
        
        # 템플릿 크기
        w = match.get("width", 18)
        h = match.get("height", 18)
        
        # 사각형 그리기
        cv2.rectangle(result_img, (x, y), (x + w, y + h), color, 2)
        
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
    
    # 최적화된 템플릿 매칭 수행
    matches, y_groups = match_templates_fast(
        screenshot_path=screenshot_path, 
        templates_folder=templates_folder, 
        mapping_json_path=mapping_json_path,
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