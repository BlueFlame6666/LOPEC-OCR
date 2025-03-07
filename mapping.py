import json
import os

# 텍스트 파일 경로 설정
characters_file_path = 'all_characters.txt'

# 이미지 폴더 경로 설정 (실제 이미지가 있는 폴더 경로로 변경해주세요)
images_folder_path = './screenshot/cropped'

# 텍스트 파일에서 문자 읽기
with open(characters_file_path, 'r', encoding='utf-8') as file:
    characters = [line.strip() for line in file if line.strip()]

# 이미지 파일 목록 가져오기 (숫자 순서대로 정렬)
image_files = []
for file in os.listdir(images_folder_path):
    if file.endswith('.webp'):
        try:
            file_number = int(file.split('.')[0])
            image_files.append((file_number, file))
        except ValueError:
            continue

# 숫자 기준으로 정렬
image_files.sort(key=lambda x: x[0])

# 매핑 딕셔너리 생성
mapping = {}
for i, (file_number, file_name) in enumerate(image_files):
    if i >= len(characters):
        break  # 문자 목록보다 이미지가 많을 경우 중단
    
    # 파일 경로를 포함한 매핑 정보 저장
    mapping[str(file_number)] = {
        "character": characters[i],
        "file_path": os.path.join(images_folder_path, file_name)
    }

# 매핑 딕셔너리를 JSON 파일로 저장
with open('character_mapping.json', 'w', encoding='utf-8') as json_file:
    json.dump(mapping, json_file, ensure_ascii=False, indent=2)

print(f'매핑 파일 생성 완료! - 총 {len(mapping)}개 항목')
print('첫 번째 항목 예시:')
first_key = list(mapping.keys())[0]
print(f'키: {first_key}, 값: {mapping[first_key]}')