import os
from PIL import Image
import glob

# 고정 설정값
INPUT_FOLDER = "screenshot"  # 디렉토리 루트의 screenshot 폴더
OUTPUT_FOLDER = "screenshot/cropped"  # screenshot 폴더 안의 cropped 폴더
CROP_COORDS = (1550,829,1566,847)  # 자를 영역 좌표

# 출력 폴더가 없으면 생성
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# 모든 이미지 파일 수집
all_files = []
for ext in ['*.png', '*.jpg', '*.jpeg', '*.bmp']:
    all_files.extend(glob.glob(os.path.join(INPUT_FOLDER, ext)))

# 파일명 기준으로 정렬
all_files.sort()

# 처리된 파일 수 (저장 파일명용)
processed_count = 0

# 모든 이미지 파일 처리
for file_path in all_files:
    try:
        # 파일명 추출
        filename = os.path.basename(file_path)
        
        # 이미지 열기 및 크롭
        with Image.open(file_path) as img:
            cropped_img = img.crop(CROP_COORDS)
            
            # 저장 파일명 (1.webp, 2.webp, ...)
            processed_count += 1
            save_filename = f"{processed_count}.webp"
            
            # 저장 경로
            output_path = os.path.join(OUTPUT_FOLDER, save_filename)
            
            # 무손실 WebP 형식으로 저장
            cropped_img.save(output_path, format="WEBP", lossless=True, quality=100)
            
            # 원본 이미지 삭제
            os.remove(file_path)
            
            print(f"처리: {filename} → {save_filename} (무손실 WebP)")
            
    except Exception as e:
        print(f"오류 ({filename}): {str(e)}")

print(f"완료: 총 {processed_count}개 이미지")