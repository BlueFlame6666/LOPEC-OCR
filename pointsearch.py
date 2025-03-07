import cv2
import sys

# 선택된 영역의 좌표를 저장할 변수
start_x, start_y, end_x, end_y = 0, 0, 0, 0
drawing = False

def select_roi(event, x, y, flags, param):
    global start_x, start_y, end_x, end_y, drawing, image, clone
    
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        start_x, start_y = x, y
        clone = image.copy()
    
    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            image_to_show = clone.copy()
            cv2.rectangle(image_to_show, (start_x, start_y), (x, y), (0, 255, 0), 1)
            cv2.imshow("Select ROI", image_to_show)
    
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        end_x, end_y = x, y
        cv2.rectangle(image, (start_x, start_y), (end_x, end_y), (0, 255, 0), 1)
        print(f"선택한 영역 좌표: ({start_x}, {start_y}, {end_x}, {end_y})")

# 이미지 파일 경로
if len(sys.argv) > 1:
    image_path = sys.argv[1]
else:
    image_path = input("이미지 파일 경로를 입력하세요: ")

# 이미지 로드
image = cv2.imread(image_path)
clone = image.copy()

# 창 생성 및 마우스 콜백 설정
cv2.namedWindow("Select ROI")
cv2.setMouseCallback("Select ROI", select_roi)

print("영역을 선택하려면 마우스로 드래그하세요.")
print("종료하려면 'q'를 누르세요.")

# 메인 루프
while True:
    cv2.imshow("Select ROI", image)
    key = cv2.waitKey(1) & 0xFF
    
    if key == ord("q"):
        break

cv2.destroyAllWindows()

print(f"최종 선택 영역: ({start_x}, {start_y}, {end_x}, {end_y})")