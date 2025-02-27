<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR 테스트 환경 | LOPEC</title>
    <style>
        /* 기본 스타일 */
        body { font-family: 'Noto Sans KR', sans-serif; padding: 20px; }
        .test-container { max-width: 900px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1a73e8; }
        .control-panel { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 6px; }
        button { padding: 10px 20px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .ocr-status { padding: 15px; background: #f0f4f8; border-left: 4px solid #1a73e8; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f5f5f5; }
        #debugOutput { height: 200px; overflow-y: auto; background: #2c2c2c; color: #eee; padding: 10px; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>OCR 테스트 환경</h1>
        
        <div class="control-panel">
            <div>
                <label><input type="radio" name="ocrMode" value="applicant" checked> 신청자 목록</label>
                <label><input type="radio" name="ocrMode" value="participant"> 참가자 목록</label>
            </div>
            <button id="startOcrBtn">OCR 시작</button>
        </div>
        
        <div class="ocr-status">
            <p id="ocrStatus">OCR 시작 버튼을 클릭하여 클립보드 이미지를 처리하세요.</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>캐릭터 닉네임</th>
                    <th>아이템 레벨</th>
                    <th>스펙 포인트</th>
                </tr>
            </thead>
            <tbody id="ocrResultBody"></tbody>
        </table>
        
        <div style="margin-top: 30px;">
            <h3>디버그 정보</h3>
            <button id="toggleDebug">디버그 토글</button>
            <button id="clearDebug">디버그 지우기</button>
            <pre id="debugOutput"></pre>
        </div>
    </div>
    
    <!-- jQuery 로드 - 원본에서와 동일 버전 -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    
    <!-- 디버그 유틸리티 -->
    <script>
        document.getElementById('toggleDebug').addEventListener('click', function() {
            const debugOutput = document.getElementById('debugOutput');
            debugOutput.style.display = debugOutput.style.display === 'none' ? 'block' : 'none';
        });
        
        document.getElementById('clearDebug').addEventListener('click', function() {
            document.getElementById('debugOutput').textContent = '';
        });
        
        window.addDebugLog = function(message) {
            const debugOutput = document.getElementById('debugOutput');
            const timestamp = new Date().toLocaleTimeString();
            debugOutput.textContent += `[${timestamp}] ${message}\n`;
            debugOutput.scrollTop = debugOutput.scrollHeight;
            console.log(message);
        };
        
        window.addDebugLog('페이지 로드됨');
    </script>
    
    <!-- 중요: 원본과 동일한 방식으로 스크립트 로드 -->
    <script>
        // 정확히 index.php와 동일한 방식으로 스크립트 로드
        document.write('<script src="https://docs.opencv.org/4.5.5/opencv.js"><\/script>');
        document.write('<script src="asset/js/lopec-ocr.js?' + (new Date).getTime() + '"><\/script>');
        document.write('<script type="module" src="asset/js/ocr-integration.js?' + (new Date).getTime() + '"><\/script>');
        
        // OpenCV 로드 확인
        window.addEventListener('load', function() {
            if (typeof cv !== 'undefined') {
                window.addDebugLog("OpenCV.js가 로드되었습니다!");
            } else {
                window.addDebugLog("OpenCV.js 로드 실패");
            }
            
            if (typeof LopecOCR !== 'undefined') {
                window.addDebugLog("LopecOCR 모듈이 로드되었습니다!");
            } else {
                window.addDebugLog("LopecOCR 모듈 로드 실패");
            }
        });
    </script>
    
    <!-- 기존 스크립트 바로 다음에 추가 -->
    <script>
        // 페이지 완전 로드 후 추가 초기화
        window.addEventListener('load', function() {
            // 1초 후 초기화 시도 (모든 스크립트 로드 확인)
            setTimeout(function() {
                // OCR 시작 버튼에 직접 이벤트 리스너 추가
                document.getElementById('startOcrBtn').addEventListener('click', function() {
                    window.addDebugLog("OCR 시작 버튼 클릭됨!");
                    
                    if (typeof OCRIntegration !== 'undefined' && OCRIntegration.init) {
                        window.addDebugLog("OCRIntegration.init() 호출 시도");
                        try {
                            // OCRIntegration 초기화 시도
                            OCRIntegration.init();
                        } catch (e) {
                            window.addDebugLog("OCRIntegration.init() 호출 오류: " + e.message);
                        }
                    } else {
                        window.addDebugLog("OCRIntegration 모듈을 찾을 수 없습니다");
                    }
                    
                    // LopecOCR 직접 호출 시도
                    if (typeof LopecOCR !== 'undefined') {
                        window.addDebugLog("LopecOCR 직접 호출 시도");
                        try {
                            // OCR 처리 직접 시도
                            const selectedMode = document.querySelector('input[name="ocrMode"]:checked').value;
                            const ocrVersion = selectedMode === 'applicant' ? 
                                              LopecOCR.VERSIONS.APPLICANT : 
                                              LopecOCR.VERSIONS.PARTICIPANT;
                            
                            // 상태 업데이트 함수
                            const updateStatus = function(message) {
                                document.getElementById('ocrStatus').textContent = message;
                                window.addDebugLog("상태: " + message);
                            };
                            
                            // LopecOCR 직접 호출
                            LopecOCR.extractCharactersFromClipboard(
                                "free", 
                                ocrVersion,
                                {
                                    onStatusUpdate: updateStatus,
                                    onDebugInfo: window.addDebugLog
                                }
                            ).then(function(characters) {
                                window.addDebugLog("OCR 처리 완료: " + characters.length + "개 캐릭터 추출");
                                // 결과 표시
                                displayResults(characters);
                            }).catch(function(error) {
                                window.addDebugLog("OCR 처리 오류: " + error.message);
                                document.getElementById('ocrStatus').textContent = "오류 발생: " + error.message;
                            });
                        } catch (e) {
                            window.addDebugLog("LopecOCR 직접 호출 오류: " + e.message);
                        }
                    }
                });
                
                // 결과 표시 함수
                function displayResults(characters) {
                    const resultBody = document.getElementById('ocrResultBody');
                    resultBody.innerHTML = ''; // 결과 테이블 초기화
                    
                    for (const character of characters) {
                        // 새 행 추가
                        const row = document.createElement('tr');
                        
                        // 닉네임 셀
                        const nicknameCell = document.createElement('td');
                        nicknameCell.textContent = character.nickname;
                        if (character.isFirstLineNickname) {
                            nicknameCell.style.fontWeight = 'bold';
                            nicknameCell.style.color = '#1a73e8';
                        }
                        
                        // 아이템 레벨 셀
                        const itemLevelCell = document.createElement('td');
                        itemLevelCell.textContent = character.itemLevel || '-';
                        
                        // 스펙포인트 셀
                        const specPointCell = document.createElement('td');
                        specPointCell.textContent = "조회 중...";
                        
                        // 행에 셀 추가
                        row.appendChild(nicknameCell);
                        row.appendChild(itemLevelCell);
                        row.appendChild(specPointCell);
                        
                        // 테이블에 행 추가
                        resultBody.appendChild(row);
                    }
                }
                
                window.addDebugLog("초기화 완료, OCR 시작 버튼이 활성화되었습니다.");
            }, 1000);
        });
    </script>
</body>
</html>