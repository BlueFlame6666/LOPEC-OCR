<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR 테스트 환경 | LOPEC</title>
    <style>
        /* 기본 UI 스타일 정의 
           - 테스트 환경의 전체적인 레이아웃과 컴포넌트 스타일 지정
           - 컨테이너, 버튼, 테이블, 로딩 애니메이션 등의 스타일 포함 */
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
        .loading { display: inline-block; width: 20px; height: 20px; border: 2px solid #ccc; border-top-color: #1a73e8; border-radius: 50%; animation: spin 1s infinite linear; margin-right: 5px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <!-- 메인 컨테이너 - 전체 UI를 담는 컨테이너 -->
    <div class="test-container">
        <h1>OCR 테스트 환경</h1>
        
        <!-- 제어 패널 - OCR 모드 선택 및 작업 시작 버튼 -->
        <div class="control-panel">
            <!-- OCR 모드 선택 라디오 버튼 (신청자/참가자 목록) -->
            <div>
                <label><input type="radio" name="ocrMode" value="applicant" checked> 신청자 목록</label>
                <label><input type="radio" name="ocrMode" value="participant"> 참가자 목록</label>
            </div>
            <!-- OCR 작업 시작 버튼 및 파일 업로드 버튼 -->
            <div>
                <button id="startOcrBtn">OCR 시작</button>
                <button id="toggleUploadBtn" style="margin-left: 10px; background: #4CAF50;">이미지 파일로 시도</button>
                <input type="file" id="imageFileInput" accept="image/*" style="display: none;">
            </div>
        </div>
        
        <!-- OCR 상태 표시 영역 - 현재 처리 상태 및 오류 메시지 표시 -->
        <div class="ocr-status">
            <p id="ocrStatus">OCR 시작 버튼을 클릭하여 클립보드 이미지를 처리하세요.</p>
            <div id="errorInfo" style="color: red; margin-top: 5px; display: none;"></div>
        </div>
        
        <!-- 결과 테이블 - OCR로 추출된 캐릭터 정보 표시 -->
        <table>
            <thead>
                <tr>
                    <th>캐릭터 닉네임</th>
                    <th>아이템 레벨</th>
                    <th>스펙 포인트</th>
                    <th>처리 상태</th>
                    <th>마지막 갱신</th>
                </tr>
            </thead>
            <tbody id="ocrResultBody"></tbody>
        </table>
        
        <!-- 디버그 정보 영역 - 개발/테스트 중 로그 확인용 -->
        <div style="margin-top: 30px;">
            <h3>디버그 정보</h3>
            <button id="toggleDebug">디버그 토글</button>
            <button id="clearDebug">디버그 지우기</button>
            <pre id="debugOutput"></pre>
        </div>
    </div>
    
    <!-- jQuery 라이브러리 로드 - AJAX 요청 및 DOM 조작에 사용 -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    
    <!-- 디버그 유틸리티 스크립트 - 로그 기록 및 표시 기능 -->
    <script>
        /**
         * 디버그 토글 버튼 이벤트 핸들러
         * 디버그 출력 영역을 표시/숨김 처리
         */
        document.getElementById('toggleDebug').addEventListener('click', function() {
            const debugOutput = document.getElementById('debugOutput');
            debugOutput.style.display = debugOutput.style.display === 'none' ? 'block' : 'none';
        });
        
        /**
         * 디버그 내용 지우기 버튼 이벤트 핸들러
         * 디버그 출력 영역의 내용을 초기화
         */
        document.getElementById('clearDebug').addEventListener('click', function() {
            document.getElementById('debugOutput').textContent = '';
        });
        
        /**
         * 디버그 로그 추가 함수
         * 타임스탬프와 함께 로그 메시지를 디버그 출력 영역에 추가
         * 콘솔에도 동일한 메시지 출력
         * @param {string} message - 로그에 추가할 메시지
         */
        window.addDebugLog = function(message) {
            const debugOutput = document.getElementById('debugOutput');
            const timestamp = new Date().toLocaleTimeString();
            debugOutput.textContent += `[${timestamp}] ${message}\n`;
            debugOutput.scrollTop = debugOutput.scrollHeight;
            console.log(message);
        };
        
        window.addDebugLog('페이지 로드됨');
    </script>
    
    <!-- 필수 외부 스크립트 로드 섹션 -->
    <!-- OpenCV.js 로드 - 이미지 처리를 위한 라이브러리 -->
    <script src="https://docs.opencv.org/4.5.5/opencv.js"></script>
    <!-- 스펙 포인트 계산 모듈 로드 - 캐릭터 정보 계산에 사용 -->
    <script src="/asset/js/spec-point.js"></script>
    <!-- 모듈 스크립트 로드 - ES 모듈 형식의 OCR 관련 스크립트 로드 -->
    <script type="module">
        // 타임스탬프로 캐시 방지 - 개발 중 변경사항이 바로 적용되도록 함
        const timestamp = new Date().getTime();
        
        // 모듈 직접 로드 시작
        window.addDebugLog("모듈 로딩 시작...");
        
        try {
            // 모듈 로드 과정: 
            // 1. 캐릭터 데이터 조회 모듈 로드 (characterRead.js)
            // 2. OCR 메인 모듈 로드 (lopec-ocr.js)
            // 각 모듈은 ES Module 형식으로 작성되어 import로 로드
            import('./asset/js/characterRead.js?v=' + timestamp)
                .then(characterModule => {
                    // 캐릭터 데이터 일괄 조회 함수를 전역 객체에 할당
                    window.getBatchCharacterData = characterModule.getBatchCharacterData;
                    window.addDebugLog("characterRead.js 모듈 로드 성공");
                    
                    // lopec-ocr.js는 characterRead.js 로드 후 로드 (의존성 있음)
                    return import('./asset/js/lopec-ocr.js?v=' + timestamp);
                })
                .then(ocrModule => {
                    // LOPEC OCR 객체를 전역 객체에 할당
                    window.LopecOCR = ocrModule.LopecOCR;
                    window.addDebugLog("lopec-ocr.js 모듈 로드 성공");
                    window.addDebugLog("모든 모듈 로드 완료!");
                })
                .catch(error => {
                    // 모듈 로드 오류 처리
                    window.addDebugLog("모듈 로드 오류: " + error.message);
                    console.error("모듈 로드 오류:", error);
                });
        } catch (e) {
            // import 구문 자체 오류 처리
            window.addDebugLog("모듈 로드 시도 중 오류: " + e.message);
            console.error("모듈 로드 오류:", e);
        }

        // DOMContentLoaded 이벤트 - 페이지 로드 완료 시 초기화 작업
        window.addEventListener('DOMContentLoaded', () => {
            // OpenCV.js 로드 상태 확인
            if (typeof cv !== 'undefined') {
                window.addDebugLog("OpenCV.js가 로드되었습니다!");
            } else {
                window.addDebugLog("OpenCV.js 로드 실패");
            }
            
            // 모듈 로드 상태 주기적 확인 (1초 후)
            setTimeout(() => {
                // LopecOCR 모듈 로드 상태 및 필요 함수 존재 여부 확인
                if (typeof window.LopecOCR !== 'undefined') {
                    window.addDebugLog("LopecOCR 모듈이 로드되었습니다!");
                    
                    if (typeof window.LopecOCR.processCharacterData === 'function') {
                        window.addDebugLog("캐릭터 데이터 처리 모듈이 로드되었습니다!");
                    } else {
                        window.addDebugLog("캐릭터 데이터 처리 모듈 로드 실패");
                    }
                } else {
                    window.addDebugLog("LopecOCR 모듈 로드 실패 (1초 후 확인)");
                }
            }, 1000);
        });
    </script>
    
    <!-- 주요 UI 이벤트 및 OCR 처리 로직 스크립트 -->
    <script type="module">
        // 페이지 완전 로드 후 초기화 - 모든 DOM 요소 및 외부 스크립트 로드 완료 확인
        window.addEventListener('DOMContentLoaded', function() {
            // 1초 후 초기화 시도 (모든 스크립트 로드 확인을 위한 지연)
            setTimeout(function() {
                /**
                 * 파일 업로드 토글 버튼 이벤트 핸들러
                 * 클릭 시 숨겨진 파일 입력 요소 활성화
                 */
                document.getElementById('toggleUploadBtn').addEventListener('click', function() {
                    document.getElementById('imageFileInput').click();
                });
                
                /**
                 * 파일 입력 변경 이벤트 핸들러
                 * 이미지 파일 선택 시 OCR 처리 시작
                 */
                document.getElementById('imageFileInput').addEventListener('change', function(e) {
                    if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        window.addDebugLog(`이미지 파일 선택: ${file.name} (${Math.round(file.size / 1024)}KB)`);
                        
                        // 파일에서 이미지 처리 로직 호출
                        processImageFromFile(file);
                    }
                });
                
                /**
                 * 파일에서 이미지 처리 함수
                 * 선택한 이미지 파일을 OCR로 처리하는 로직
                 * 현재는 UI 상태 관리만 구현되어 있으며, 실제 OCR 처리는 확장 필요
                 * 
                 * @param {File} file - 처리할 이미지 파일 객체
                 */
                function processImageFromFile(file) {
                    // UI 상태 업데이트 - 처리 중 상태로 변경
                    const startBtn = document.getElementById('startOcrBtn');
                    startBtn.disabled = true;
                    startBtn.innerHTML = '<span class="loading"></span> 처리 중...';
                    
                    // toggleUploadBtn도 비활성화
                    document.getElementById('toggleUploadBtn').disabled = true;
                    
                    // 에러 메시지 초기화
                    document.getElementById('errorInfo').style.display = 'none';
                    
                    /**
                     * 상태 업데이트 함수 - 처리 상태를 UI에 표시
                     * @param {string} message - 표시할 상태 메시지
                     */
                    const updateStatus = function(message) {
                        document.getElementById('ocrStatus').textContent = message;
                        window.addDebugLog("상태: " + message);
                    };
                    
                    try {
                        window.addDebugLog("파일에서 이미지 처리 시작");
                        updateStatus("파일에서 이미지 처리 중...");
                        
                        // 파일을 OpenCV 처리 가능한 형태로 변환 (이미지 객체로 로드)
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            const img = new Image();
                            img.onload = function() {
                                try {
                                    // 이미지 처리 로직 (현재는 로그만 기록)
                                    window.addDebugLog(`이미지 로드 성공: ${img.width}x${img.height}`);
                                    
                                    // TODO: 이 부분에 LopecOCR 모듈을 사용한 이미지 OCR 처리 로직 추가 필요
                                    // 예: LopecOCR.processImageData(img) 또는 유사한 함수 호출
                                    
                                    updateStatus("이미지 처리 완료");
                                    
                                    // 버튼 상태 복원
                                    startBtn.disabled = false;
                                    startBtn.textContent = "OCR 시작";
                                    document.getElementById('toggleUploadBtn').disabled = false;
                                } catch (error) {
                                    handleProcessingError(error);
                                }
                            };
                            img.onerror = function() {
                                handleProcessingError(new Error("이미지 로드 실패"));
                            };
                            img.src = event.target.result;
                        };
                        reader.onerror = function() {
                            handleProcessingError(new Error("파일 읽기 실패"));
                        };
                        reader.readAsDataURL(file);
                    } catch (error) {
                        handleProcessingError(error);
                    }
                }
                
                /**
                 * 에러 처리 함수
                 * 처리 중 발생한 오류를 UI에 표시하고 로그에 기록
                 * 
                 * @param {Error} error - 발생한 오류 객체
                 */
                function handleProcessingError(error) {
                    window.addDebugLog(`처리 오류: ${error.message}`);
                    document.getElementById('ocrStatus').textContent = "처리 중 오류 발생";
                    
                    // 에러 정보 표시
                    const errorInfo = document.getElementById('errorInfo');
                    errorInfo.textContent = error.message;
                    errorInfo.style.display = 'block';
                    
                    // 버튼 상태 복원
                    const startBtn = document.getElementById('startOcrBtn');
                    startBtn.disabled = false;
                    startBtn.textContent = "OCR 시작";
                    document.getElementById('toggleUploadBtn').disabled = false;
                }
                
                /**
                 * OCR 시작 버튼 이벤트 핸들러
                 * 클립보드 이미지를 사용한 OCR 처리 시작
                 */
                document.getElementById('startOcrBtn').addEventListener('click', function() {
                    window.addDebugLog("OCR 시작 버튼 클릭됨!");
                    
                    // 에러 메시지 초기화
                    document.getElementById('errorInfo').style.display = 'none';
                    
                    // 버튼 비활성화 및 로딩 상태 표시
                    const startBtn = document.getElementById('startOcrBtn');
                    startBtn.disabled = true;
                    startBtn.innerHTML = '<span class="loading"></span> 처리 중...';
                    
                    // 토글 버튼도 비활성화
                    document.getElementById('toggleUploadBtn').disabled = true;
                    
                    // LopecOCR 모듈 사용 처리 흐름
                    if (typeof window.LopecOCR !== 'undefined') {
                        window.addDebugLog("LopecOCR 호출 시도");
                        try {
                            // OCR 처리 직접 시도
                            // 1. 선택된 OCR 모드 확인 (신청자/참가자)
                            const selectedMode = document.querySelector('input[name="ocrMode"]:checked').value;
                            window.addDebugLog("선택된 모드: " + selectedMode);
                            
                            // 선택된 모드에 따라 OCR 버전 설정
                            const ocrVersion = selectedMode === 'applicant' ? 
                                              window.LopecOCR.VERSIONS.APPLICANT : 
                                              window.LopecOCR.VERSIONS.PARTICIPANT;
                            window.addDebugLog("OCR 버전 설정: " + ocrVersion);
                            
                            /**
                             * 상태 업데이트 함수 - OCR 처리 상태를 UI에 실시간 표시
                             * @param {string} message - 표시할 상태 메시지
                             */
                            const updateStatus = function(message) {
                                document.getElementById('ocrStatus').textContent = message;
                                window.addDebugLog("상태: " + message);
                            };
                            
                            // 클립보드 접근 시도 디버그
                            window.addDebugLog("클립보드 접근 시도 시작...");
                            
                            // OCR 처리 흐름 (3단계):
                            // 1. 클립보드 이미지에서 캐릭터 닉네임 추출
                            window.LopecOCR.extractCharactersFromClipboard(
                                "free",  // API 키 타입 (무료)
                                ocrVersion, // OCR 버전 (신청자/참가자)
                                {
                                    // 상태 업데이트 콜백
                                    onStatusUpdate: updateStatus,
                                    // 디버그 정보 콜백
                                    onDebugInfo: window.addDebugLog,
                                    // 오류 처리 콜백
                                    onError: function(error) {
                                        window.addDebugLog("OCR 처리 중 오류 발생: " + error.message);
                                        handleProcessingError(error); // 에러 핸들러 함수 호출
                                    }
                                }
                            ).then(function(characters) {
                                // OCR 추출 성공 처리
                                window.addDebugLog("OCR 처리 완료: " + characters.length + "개 캐릭터 추출");
                                updateStatus("OCR 추출 완료, DB 데이터 조회 중...");
                                
                                // 추출된 캐릭터 목록 초기 표시 (처리 중 상태)
                                showInitialResults(characters);
                                
                                // 2. DB 및 spec-point.js로 추출된 캐릭터 데이터 조회
                                return window.LopecOCR.processCharacterData(
                                    characters, // 추출된 캐릭터 목록
                                    "DEAL",    // 기본 랭킹 타입
                                    updateStatus, // 상태 업데이트 콜백
                                    // 개별 캐릭터 정보 업데이트 콜백
                                    function(nickname, updatedInfo) {
                                        // 닉네임에 해당하는 행 찾기
                                        const rowId = `char-row-${nickname.replace(/\s+/g, '-')}`;
                                        const row = document.getElementById(rowId);
                                        
                                        if (row) {
                                            // 정보가 있는 경우
                                            if (updatedInfo.hasDbInfo) {
                                                // 아이템 레벨 업데이트
                                                row.cells[1].textContent = updatedInfo.itemLevel || '-';
                                                
                                                // 스펙포인트 업데이트
                                                row.cells[2].textContent = updatedInfo.displayScore || '정보 없음';
                                                
                                                // 상태 업데이트
                                                row.cells[3].innerHTML = '<span style="color: green;">✓ DB 조회 완료</span>';
                                                
                                                // 마지막 갱신 시각 업데이트
                                                if (updatedInfo.dbInfo && updatedInfo.dbInfo.REG_DATE) {
                                                    row.cells[4].textContent = updatedInfo.dbInfo.REG_DATE;
                                                }
                                            } else {
                                                // 에러가 있는 경우
                                                row.cells[3].innerHTML = `<span style="color: red;">✗ ${updatedInfo.error || '정보 없음'}</span>`;
                                            }
                                        }
                                        
                                        window.addDebugLog(`${nickname} 캐릭터 정보 업데이트: ${updatedInfo.hasDbInfo ? '성공' : '실패'}`);
                                    }
                                );
                            }).then(function(finalResults) {
                                // 3. 모든 데이터 처리 완료 후 최종 결과 표시
                                window.addDebugLog("데이터 처리 완료: " + finalResults.length + "개 캐릭터");
                                updateStatus("처리 완료! " + finalResults.length + "개 캐릭터 정보 표시");
                                
                                // 최종 결과 테이블 업데이트
                                displayFinalResults(finalResults);
                                
                                // 버튼 다시 활성화
                                startBtn.disabled = false;
                                startBtn.textContent = "OCR 시작";
                                document.getElementById('toggleUploadBtn').disabled = false;
                            }).catch(function(error) {
                                // 전체 처리 과정 중 발생한 오류 처리
                                window.addDebugLog("OCR 처리 오류: " + error.message);
                                handleProcessingError(error); // 에러 핸들러 함수 호출
                            });
                        } catch (e) {
                            // LopecOCR 모듈 호출 과정의 예외 처리
                            window.addDebugLog("LopecOCR 직접 호출 오류: " + e.message);
                            handleProcessingError(e); // 에러 핸들러 함수 호출
                        }
                    } else {
                        // LopecOCR 모듈이 로드되지 않은 경우
                        window.addDebugLog("LopecOCR이 정의되지 않음");
                        handleProcessingError(new Error("OCR 모듈이 로드되지 않았습니다"));
                    }
                });
                
                window.addDebugLog("초기화 완료, OCR 시작 버튼이 활성화되었습니다.");
            }, 1000);
        });
    </script>
    
    <!-- OCR 추출 결과 표시 함수 스크립트 -->
    <script>
        /**
         * OCR 추출 결과 초기 표시 함수
         * OCR로 추출된 캐릭터 목록을 테이블에 표시 (DB 조회 전 상태)
         * 
         * @param {Array} characters - OCR로 추출된 캐릭터 객체 배열
         */
        function showInitialResults(characters) {
            const resultBody = document.getElementById('ocrResultBody');
            resultBody.innerHTML = ''; // 결과 테이블 초기화
            
            for (const character of characters) {
                // 새 행 추가
                const row = document.createElement('tr');
                row.id = `char-row-${character.nickname.replace(/\s+/g, '-')}`;
                
                // 닉네임 셀
                const nicknameCell = document.createElement('td');
                nicknameCell.textContent = character.nickname;
                // 첫 번째 라인의 닉네임인 경우 강조 표시 (본인 캐릭터)
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
                
                // 상태 셀
                const statusCell = document.createElement('td');
                statusCell.innerHTML = '<span class="loading"></span> 처리 중';
                
                // 마지막 갱신 셀 추가
                const lastUpdateCell = document.createElement('td');
                lastUpdateCell.textContent = "조회 중...";
                
                // 행에 셀 추가
                row.appendChild(nicknameCell);
                row.appendChild(itemLevelCell);
                row.appendChild(specPointCell);
                row.appendChild(statusCell);
                row.appendChild(lastUpdateCell); // 마지막 갱신 셀 행에 추가
                
                // 테이블에 행 추가
                resultBody.appendChild(row);
            }
        }
    </script>
    
    <!-- 최종 처리 결과 표시 함수 스크립트 -->
    <script>
        /**
         * 최종 처리 결과 표시 함수
         * DB 및 API 조회가 완료된 캐릭터 정보를 테이블에 최종 표시
         * 
         * @param {Array} characters - DB 조회가 완료된 캐릭터 객체 배열
         */
        function displayFinalResults(characters) {
            characters.forEach(character => {
                // 캐릭터 닉네임으로 해당 행 ID 생성
                const rowId = `char-row-${character.nickname.replace(/\s+/g, '-')}`;
                const row = document.getElementById(rowId);
                
                if (!row) return; // 행을 찾지 못한 경우 스킵
                
                // 아이템 레벨 업데이트 (OCR 또는 DB 데이터)
                const itemLevelCell = row.cells[1];
                if (character.dbInfo && character.dbInfo.LCHA_ITEM_LEVEL) {
                    // DB에서 가져온 아이템 레벨 우선 표시
                    itemLevelCell.textContent = character.dbInfo.LCHA_ITEM_LEVEL;
                } else if (character.itemLevel) {
                    // DB 정보가 없는 경우 OCR로 추출한 아이템 레벨 표시
                    itemLevelCell.textContent = character.itemLevel;
                } else {
                    // 아이템 레벨 정보가 없는 경우
                    itemLevelCell.textContent = '-';
                }
                
                // 스펙포인트 업데이트
                const specPointCell = row.cells[2];
                if (character.dbInfo) {
                    // DB 정보가 있는 경우 처리
                    // 서포터 여부에 따라 다른 점수 표시
                    if (character.displayScore) {
                        // lopec-ocr.js에서 계산한 표시용 점수 사용
                        specPointCell.textContent = character.displayScore;
                    } else if (character.isSupport) {
                        // 서포터의 경우 LCHA_TOTALSUMSUPPORT 사용
                        specPointCell.textContent = character.dbInfo.LCHA_TOTALSUMSUPPORT || character.dbInfo.LCHA_TOTALSUM || "-";
                    } else {
                        // 일반 클래스의 경우 LCHA_TOTALSUM 사용
                        specPointCell.textContent = character.dbInfo.LCHA_TOTALSUM || "-";
                    }
                } else if (character.specData) {
                    // DB 정보는 없지만 spec-point.js에서 정보를 가져온 경우
                    specPointCell.textContent = character.specData.specPoint || "-";
                } else {
                    // 스펙 정보가 전혀 없는 경우
                    specPointCell.textContent = "정보 없음";
                }
                
                // 상태 셀 업데이트
                const statusCell = row.cells[3];
                if (character.hasDbInfo) {
                    // DB 조회 성공
                    statusCell.innerHTML = '<span style="color: green;">✓ DB 조회 완료</span>';
                } else if (character.specData) {
                    // API 조회 성공
                    statusCell.innerHTML = '<span style="color: blue;">✓ API 조회 완료</span>';
                } else {
                    // 정보 조회 실패
                    statusCell.innerHTML = '<span style="color: red;">✗ 정보 없음</span>';
                }
                
                // 마지막 갱신 시각 셀 업데이트
                const lastUpdateCell = row.cells[4]; // 5번째 셀
                if (character.dbInfo && character.dbInfo.REG_DATE) {
                    lastUpdateCell.textContent = character.dbInfo.REG_DATE;
                } else {
                    lastUpdateCell.textContent = "-";
                }
            });
        }
    </script>
</body>
</html>