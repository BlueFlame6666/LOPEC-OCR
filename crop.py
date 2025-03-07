import os
from PIL import Image
import glob

# 고정 설정값
INPUT_FOLDER = "screenshot"  # 디렉토리 루트의 screenshot 폴더
OUTPUT_FOLDER = "screenshot/cropped"  # screenshot 폴더 안의 cropped 폴더
CROP_COORDS = (1548, 825, 1571, 851)  # 자를 영역 좌표

# 출력 폴더가 없으면 생성
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# 처리된 파일 수
processed_count = 0

# 모든 이미지 파일 처리
for ext in ['*.png', '*.jpg', '*.jpeg', '*.bmp']:
    for file_path in glob.glob(os.path.join(INPUT_FOLDER, ext)):
        try:
            # 파일명 추출
            filename = os.path.basename(file_path)
            
            # 이미지 열기 및 크롭
            with Image.open(file_path) as img:
                cropped_img = img.crop(CROP_COORDS)
                
                # 저장 경로
                output_path = os.path.join(OUTPUT_FOLDER, filename)
                
                # 저장
                cropped_img.save(output_path)
                
                # 원본 이미지 삭제
                os.remove(file_path)
                
                processed_count += 1
                print(f"처리: {filename}")
                
        except Exception as e:
            print(f"오류 ({filename}): {str(e)}")

print(f"완료: 총 {processed_count}개 이미지")