import cv2
import sys
import numpy as np
from PIL import Image
import tkinter as tk
from tkinter import filedialog, simpledialog

# 선택된 영역의 좌표를 저장할 변수
start_x, start_y, end_x, end_y = 0, 0, 0, 0
drawing = False

def select_roi(event, x, y, flags, param):
    global start_x, start_y, end_x, end_y, drawing, image, clone, scale_factor
    
    # 스케일링 된 좌표를 원본 좌표로 변환
    orig_x = int(x * scale_factor)
    orig_y = int(y * scale_factor)
    
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        start_x, start_y = orig_x, orig_y
        clone = image.copy()
    
    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            image_to_show = clone.copy()
            # 디스플레이용 좌표 계산
            display_start_x = int(start_x / scale_factor)
            display_start_y = int(start_y / scale_factor)
            display_current_x = int(orig_x / scale_factor)
            display_current_y = int(orig_y / scale_factor)
            cv2.rectangle(image_to_show, (display_start_x, display_start_y), 
                         (display_current_x, display_current_y), (0, 255, 0), 1)
            cv2.imshow("Select ROI", image_to_show)
    
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        end_x, end_y = orig_x, orig_y
        # 디스플레이용 좌표 계산
        display_start_x = int(start_x / scale_factor)
        display_start_y = int(start_y / scale_factor)
        display_end_x = int(end_x / scale_factor)
        display_end_y = int(end_y / scale_factor)
        cv2.rectangle(image, (display_start_x, display_start_y), 
                     (display_end_x, display_end_y), (0, 255, 0), 1)
        print(f"선택한 원본 좌표: ({start_x}, {start_y}, {end_x}, {end_y})")

# GUI를 통한 이미지 파일 선택
root = tk.Tk()
root.withdraw()  # GUI 창 숨기기

print("이미지 파일을 선택하세요...")
image_path = filedialog.askopenfilename(title="스크린샷 이미지 선택", 
                                      filetypes=[("Image files", "*.png;*.jpg;*.jpeg;*.bmp")])

if not image_path:
    print("이미지 파일이 선택되지 않았습니다.")
    sys.exit()

# 이미지 해상도 확인
with Image.open(image_path) as img:
    original_width, original_height = img.size
    print(f"원본 이미지 해상도: {original_width}x{original_height}")

# 21:9 비율 확인 및 처리
aspect_ratio = original_width / original_height
is_ultrawide = abs(aspect_ratio - (21/9)) < 0.1  # 21:9에 가까운지 확인

if is_ultrawide and original_width > 1920:
    # 이미지가 크다면 화면에 맞게 표시하기 위해 비율 계산
    screen_width = 1600  # 적당한 화면 크기로 조정
    scale_factor = original_width / screen_width
    display_width = screen_width
    display_height = int(original_height / scale_factor)
    
    # PIL로 이미지 열기
    pil_img = Image.open(image_path)
    
    # OpenCV 형식으로 변환
    cv_img = np.array(pil_img)
    cv_img = cv_img[:, :, ::-1].copy()  # RGB to BGR
    
    # 표시용 이미지 리사이징
    image = cv2.resize(cv_img, (display_width, display_height))
    clone = image.copy()
    
    print(f"화면 표시를 위해 이미지가 {scale_factor:.2f}배 축소되었습니다.")
    print(f"표시 해상도: {display_width}x{display_height}")
    print("선택하는 좌표는 원본 이미지 기준으로 계산됩니다.")
else:
    # 일반 해상도 이미지는 그대로 처리
    image = cv2.imread(image_path)
    clone = image.copy()
    scale_factor = 1.0

# 창 생성 및 마우스 콜백 설정
cv2.namedWindow("Select ROI")
cv2.setMouseCallback("Select ROI", select_roi)

print("\n영역을 선택하려면 마우스로 드래그하세요.")
print("종료하려면 'q'를 누르세요.")

# 메인 루프
while True:
    cv2.imshow("Select ROI", image)
    key = cv2.waitKey(1) & 0xFF
    
    if key == ord("q"):
        break

cv2.destroyAllWindows()

# 좌표 순서 정렬 (left, top, right, bottom)
left = min(start_x, end_x)
top = min(start_y, end_y)
right = max(start_x, end_x)
bottom = max(start_y, end_y)

print("\n최종 좌표 (left, top, right, bottom):")
print(f"({left}, {top}, {right}, {bottom})")

# 크롭 확인을 위한 추가 기능
confirm = input("\n선택한 영역을 미리보기로 확인하시겠습니까? (y/n): ")
if confirm.lower() == 'y':
    # 원본 이미지에서 선택 영역 추출
    original_img = cv2.imread(image_path)
    cropped = original_img[top:bottom, left:right]
    
    # 이미지가 너무 작으면 표시를 위해 확대
    if cropped.shape[0] < 100 or cropped.shape[1] < 100:
        preview_scale = 3.0
        preview = cv2.resize(cropped, (0, 0), fx=preview_scale, fy=preview_scale)
        print(f"미리보기를 위해 {preview_scale}배 확대되었습니다.")
    else:
        preview = cropped
    
    cv2.imshow("Cropped Preview", preview)
    print("미리보기를 종료하려면 아무 키나 누르세요.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# 좌표 저장 옵션
save_coords = input("\n이 좌표를 템플릿 추출용으로 저장하시겠습니까? (y/n): ")
if save_coords.lower() == 'y':
    with open("template_coords.txt", "w") as f:
        f.write(f"{left},{top},{right},{bottom}")
    print("좌표가 'template_coords.txt' 파일에 저장되었습니다.")