import cv2
import sys
import numpy as np
from PIL import Image
import tkinter as tk
from tkinter import filedialog, simpledialog

# 선택된 영역의 좌표를 저장할 변수
start_x, start_y, end_x, end_y = 0, 0, 0, 0
drawing = False

# 이미지 확대/축소 및 이동 관련 변수
zoom_scale = 1.0
zoom_factor = 1.2
offset_x, offset_y = 0, 0
dragging = False
drag_start_x, drag_start_y = 0, 0
last_mouse_x, last_mouse_y = 0, 0

def select_roi(event, x, y, flags, param):
    global start_x, start_y, end_x, end_y, drawing, image, clone, scale_factor
    global zoom_scale, offset_x, offset_y, dragging, drag_start_x, drag_start_y, last_mouse_x, last_mouse_y
    
    # 현재 마우스 위치 저장
    last_mouse_x, last_mouse_y = x, y
    
    # 확대된 이미지 내에서의 좌표를 원본 이미지 좌표로 변환
    view_x = (x + offset_x) / zoom_scale
    view_y = (y + offset_y) / zoom_scale
    
    # 스케일링 된 좌표를 원본 좌표로 변환
    orig_x = int(view_x * scale_factor)
    orig_y = int(view_y * scale_factor)
    
    if event == cv2.EVENT_LBUTTONDOWN:
        if flags & cv2.EVENT_FLAG_CTRLKEY:  # Ctrl 키를 누른 상태에서 클릭: 이미지 드래깅 모드
            dragging = True
            drag_start_x, drag_start_y = x, y
        else:  # 일반 클릭: ROI 선택 모드
            drawing = True
            start_x, start_y = orig_x, orig_y
            display_img = get_display_image()
            clone = display_img.copy()
    
    elif event == cv2.EVENT_MOUSEMOVE:
        if dragging:  # 이미지 드래깅
            dx = x - drag_start_x
            dy = y - drag_start_y
            offset_x = max(0, min(offset_x - dx, (zoom_scale - 1) * display_width))
            offset_y = max(0, min(offset_y - dy, (zoom_scale - 1) * display_height))
            drag_start_x, drag_start_y = x, y
            update_display()
        elif drawing:  # ROI 선택
            display_img = get_display_image()
            # 확대 상태를 고려한 디스플레이 좌표 계산
            start_view_x = start_x / scale_factor
            start_view_y = start_y / scale_factor
            
            # 디스플레이 좌표를 화면 좌표로 변환
            display_start_x = int((start_view_x * zoom_scale) - offset_x)
            display_start_y = int((start_view_y * zoom_scale) - offset_y)
            display_current_x = x
            display_current_y = y
            
            cv2.rectangle(display_img, (display_start_x, display_start_y), 
                         (display_current_x, display_current_y), (0, 255, 0), 1)
            cv2.imshow("Select ROI", display_img)
    
    elif event == cv2.EVENT_LBUTTONUP:
        if dragging:
            dragging = False
        elif drawing:
            drawing = False
            end_x, end_y = orig_x, orig_y
            update_display()
            print(f"선택한 원본 좌표: ({start_x}, {start_y}, {end_x}, {end_y})")
            
    elif event == cv2.EVENT_MOUSEWHEEL:
        # Windows에서 마우스 휠 이벤트 처리
        delta = flags >> 16
        if delta > 0:
            zoom_in(x, y)
        else:
            zoom_out(x, y)
    elif event == cv2.EVENT_MOUSEHWHEEL:
        # Linux/Mac에서 마우스 휠 이벤트 처리
        delta = flags
        if delta < 0:
            zoom_in(x, y)
        else:
            zoom_out(x, y)

def zoom_in(x, y):
    global zoom_scale, offset_x, offset_y
    # 현재 마우스 위치를 중심으로 확대
    old_zoom = zoom_scale
    zoom_scale = min(10.0, zoom_scale * zoom_factor)
    
    # 마우스 위치를 중심으로 오프셋 조정
    if old_zoom != zoom_scale:
        offset_x = (offset_x + x) * (zoom_scale / old_zoom) - x
        offset_y = (offset_y + y) * (zoom_scale / old_zoom) - y
        
        # 오프셋 범위 제한
        offset_x = max(0, min(offset_x, (zoom_scale - 1) * display_width))
        offset_y = max(0, min(offset_y, (zoom_scale - 1) * display_height))
        
        print(f"줌 레벨: {zoom_scale:.2f}x")
        update_display()

def zoom_out(x, y):
    global zoom_scale, offset_x, offset_y
    # 현재 마우스 위치를 중심으로 축소
    old_zoom = zoom_scale
    zoom_scale = max(1.0, zoom_scale / zoom_factor)
    
    # 마우스 위치를 중심으로 오프셋 조정
    if old_zoom != zoom_scale:
        offset_x = (offset_x + x) * (zoom_scale / old_zoom) - x
        offset_y = (offset_y + y) * (zoom_scale / old_zoom) - y
        
        # 줌 아웃시 오프셋 조정 (1.0이면 원본 크기로 리셋)
        if zoom_scale == 1.0:
            offset_x, offset_y = 0, 0
        else:
            # 오프셋 범위 제한
            offset_x = max(0, min(offset_x, (zoom_scale - 1) * display_width))
            offset_y = max(0, min(offset_y, (zoom_scale - 1) * display_height))
        
        print(f"줌 레벨: {zoom_scale:.2f}x")
        update_display()

def get_display_image():
    """현재 줌 레벨과 오프셋을 고려한 디스플레이 이미지 생성"""
    # 원본 이미지 로드
    original_img = cv2.imread(image_path)
    
    # 화면 크기에 맞게 리사이징
    resized_img = cv2.resize(original_img, (display_width, display_height))
    
    if zoom_scale > 1.0:
        # 확대할 영역 계산
        view_width = int(display_width / zoom_scale)
        view_height = int(display_height / zoom_scale)
        
        # 보여줄 영역의 시작점 계산
        start_view_x = int(offset_x / zoom_scale)
        start_view_y = int(offset_y / zoom_scale)
        
        # 범위 확인 및 조정
        start_view_x = max(0, min(start_view_x, display_width - view_width))
        start_view_y = max(0, min(start_view_y, display_height - view_height))
        
        # 관심 영역 추출
        roi = resized_img[start_view_y:start_view_y + view_height, 
                         start_view_x:start_view_x + view_width]
        
        # 화면 크기로 확대
        display_img = cv2.resize(roi, (display_width, display_height))
    else:
        display_img = resized_img.copy()
    
    # 선택된 ROI가 있으면 표시
    if start_x != end_x and start_y != end_y:
        # 원본 좌표를 뷰 좌표로 변환
        view_start_x = start_x / scale_factor
        view_start_y = start_y / scale_factor
        view_end_x = end_x / scale_factor
        view_end_y = end_y / scale_factor
        
        # 뷰 좌표를 디스플레이 좌표로 변환
        if zoom_scale > 1.0:
            # 확대된 경우 오프셋 고려
            start_view_x = int(offset_x / zoom_scale)
            start_view_y = int(offset_y / zoom_scale)
            
            display_start_x = int((view_start_x - start_view_x) * zoom_scale)
            display_start_y = int((view_start_y - start_view_y) * zoom_scale)
            display_end_x = int((view_end_x - start_view_x) * zoom_scale)
            display_end_y = int((view_end_y - start_view_y) * zoom_scale)
        else:
            # 1:1 스케일일 경우
            display_start_x = int(view_start_x)
            display_start_y = int(view_start_y)
            display_end_x = int(view_end_x)
            display_end_y = int(view_end_y)
        
        # 화면에 표시될 수 있는 범위인지 확인
        if (display_start_x < display_width and display_start_y < display_height and
            display_end_x > 0 and display_end_y > 0):
            # 사각형 그리기 (범위 제한)
            display_start_x = max(0, min(display_start_x, display_width - 1))
            display_start_y = max(0, min(display_start_y, display_height - 1))
            display_end_x = max(0, min(display_end_x, display_width - 1))
            display_end_y = max(0, min(display_end_y, display_height - 1))
            
            cv2.rectangle(display_img, (display_start_x, display_start_y), 
                         (display_end_x, display_end_y), (0, 255, 0), 1)
    
    return display_img

def update_display():
    """현재 상태에 맞게 디스플레이 업데이트"""
    display_img = get_display_image()
    cv2.imshow("Select ROI", display_img)

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

# 디스플레이 크기 설정
if is_ultrawide and original_width > 1920:
    screen_width = 1600  # 적당한 화면 크기로 조정
    scale_factor = original_width / screen_width
    display_width = screen_width
    display_height = int(original_height / scale_factor)
else:
    display_width = original_width
    display_height = original_height
    scale_factor = 1.0

# 초기 이미지 로드
image = cv2.imread(image_path)
image = cv2.resize(image, (display_width, display_height))
clone = image.copy()

# 창 생성 및 마우스 콜백 설정
cv2.namedWindow("Select ROI")
cv2.setMouseCallback("Select ROI", select_roi)

# 사용 안내 출력
print("\n--- 사용 방법 ---")
print("영역 선택: 마우스 드래그")
print("확대/축소: 마우스 휠 (휠 위치가 줌 중심)")
print("이미지 이동: Ctrl + 마우스 드래그 (확대 상태에서만)")
print("종료: 'q' 키")
print("현재 줌 레벨:", zoom_scale)

# 메인 루프
while True:
    update_display()
    key = cv2.waitKey(1) & 0xFF
    
    if key == ord("q"):
        break
    elif key == ord("r"):  # 리셋
        zoom_scale = 1.0
        offset_x, offset_y = 0, 0
        update_display()
        print("줌 리셋됨")

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