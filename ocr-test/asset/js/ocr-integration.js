// OCR 통합 모듈
// spec-point.js 의존성 제거
// const { getCharacterProfile, highTierSpecPointObj } = window;

// OCR 사이드바 통합 모듈
window.OCRIntegration = (function() {
    // 특정 캐릭터의 API 호출을 제한하는 플래그 객체
    const processingCharacters = new Set();
    // 캐릭터 결과 캐시
    const resultCache = {};
    // 현재 API 요청 상태
    let isCurrentlyRequesting = false;
    // 대기 중인 요청 큐
    const requestQueue = [];
    
    // OCR 모듈 초기화 대기
    function waitForOCRModule() {
        if (typeof LopecOCR !== 'undefined' && typeof cv !== 'undefined') {
            initializeOCR();
        } else {
            setTimeout(waitForOCRModule, 500);
        }
    }

    // OCR 기능 초기화
    function initializeOCR() {
        // spec-point.js 의존성 제거
        // const getCharacterProfile = window.getCharacterProfile;
        // const highTierSpecPointObj = window.highTierSpecPointObj;
        
        // OCR 시작 버튼 클릭 이벤트
        document.getElementById('startOcrBtn').addEventListener('click', async function() {
            await startOCRProcess();
        });
    }

    // OCR 처리 시작
    async function startOCRProcess() {
        const ocrStatus = document.getElementById('ocrStatus');
        const resultBody = document.getElementById('ocrResultBody');
        
        try {
            ocrStatus.textContent = "클립보드에서 이미지 처리 중...";
            resultBody.innerHTML = ''; // 결과 테이블 초기화
            
            // 선택된 OCR 모드 확인
            const selectedMode = document.querySelector('input[name="ocrMode"]:checked').value;
            const ocrVersion = selectedMode === 'applicant' ? 
                               LopecOCR.VERSIONS.APPLICANT : 
                               LopecOCR.VERSIONS.PARTICIPANT;
            
            // API 키 (현재는 "free"로 고정, 추후 필요시 설정 옵션 추가 가능)
            const apiKey = "free";
            
            // LopecOCR 모듈 호출
            const characters = await LopecOCR.extractCharactersFromClipboard(
                apiKey, 
                ocrVersion,
                {
                    onStatusUpdate: updateStatus
                }
            );
            
            if (!characters || characters.length === 0) {
                ocrStatus.textContent = "추출된 캐릭터 정보가 없습니다. 다시 시도해주세요.";
                return;
            }
            
            ocrStatus.textContent = `${characters.length}개의 캐릭터 정보가 추출되었습니다. 스펙 정보 조회 중...`;
            
            // 순차적으로 캐릭터 처리 (API 제한 고려)
            await processCharactersSequentially(characters);
            
        } catch (error) {
            ocrStatus.textContent = `오류 발생: ${error.message}`;
            console.error('OCR 처리 오류:', error);
        }
    }
    
    // 상태 업데이트
    function updateStatus(message) {
        document.getElementById('ocrStatus').textContent = message;
    }
    
    // 순차적으로 캐릭터 데이터 처리
    async function processCharactersSequentially(characters) {
        const resultBody = document.getElementById('ocrResultBody');
        const ocrStatus = document.getElementById('ocrStatus');
        
        // 처음 최대 16명의 캐릭터만 처리
        const charactersToProcess = characters.slice(0, 16);
        const totalCharacters = charactersToProcess.length;
        
        // 디버그 로그 추가
        console.log('처리 전 캐릭터 목록:', charactersToProcess.map(c => ({
            nickname: c.nickname,
            isFirstLineNickname: c.isFirstLineNickname
        })));
        
        // 캐릭터 셀 참조를 저장할 객체
        const characterCells = {};
        
        // 첫 번째 닉네임 캐릭터를 찾아 맨 앞으로 이동
        const firstNicknameCharacterIndex = charactersToProcess.findIndex(char => char.isFirstLineNickname);
        
        console.log('첫 번째 닉네임 캐릭터 인덱스:', firstNicknameCharacterIndex);
        
        if (firstNicknameCharacterIndex > 0) {
            // 첫 번째 닉네임 캐릭터를 맨 앞으로 이동
            const firstNicknameCharacter = charactersToProcess.splice(firstNicknameCharacterIndex, 1)[0];
            charactersToProcess.unshift(firstNicknameCharacter);
            console.log('첫 번째 닉네임을 맨 앞으로 이동:', firstNicknameCharacter.nickname);
        }
        
        console.log('처리 후 캐릭터 목록:', charactersToProcess.map(c => c.nickname));
        
        // 먼저 모든 행을 테이블에 추가
        for (let i = 0; i < charactersToProcess.length; i++) {
            const character = charactersToProcess[i];
            
            // 새 행 추가
            const row = document.createElement('tr');
            
            // 닉네임 셀
            const nicknameCell = document.createElement('td');
            nicknameCell.textContent = character.nickname;
            nicknameCell.classList.add('character-nickname');
            
            // 첫 번째 닉네임에 특별 스타일 적용
            if (character.isFirstLineNickname) {
                nicknameCell.classList.add('first-line-nickname');
                nicknameCell.style.fontWeight = 'bold';
                nicknameCell.style.color = '#1a73e8';
                row.setAttribute('data-first-nickname', 'true');
            }
            
            nicknameCell.addEventListener('click', function() {
                window.location.href = `/search/search.php?headerCharacterName=${character.nickname}`;
            });
            
            // 아이템 레벨 셀
            const itemLevelCell = document.createElement('td');
            itemLevelCell.textContent = character.itemLevel || '-';
            
            // 스펙포인트 셀 (초기에는 "로딩 중"으로 표시)
            const specPointCell = document.createElement('td');
            specPointCell.textContent = "대기 중...";
            specPointCell.setAttribute('data-character', character.nickname);
            
            // 행에 셀 추가
            row.appendChild(nicknameCell);
            row.appendChild(itemLevelCell);
            row.appendChild(specPointCell);
            
            // 테이블에 행 추가
            resultBody.appendChild(row);
            
            // 셀 참조 저장
            characterCells[character.nickname] = specPointCell;
        }
        
        // 완전 순차 처리 방식으로 변경
        let completedCount = 0;
        const startTime = Date.now();
        
        // 하나씩 처리
        for (let i = 0; i < charactersToProcess.length; i++) {
            const character = charactersToProcess[i];
            const cell = characterCells[character.nickname];
            
            // 현재 캐릭터 처리 상태 업데이트
            cell.textContent = "처리 중...";
            ocrStatus.textContent = `${i+1}/${totalCharacters} 캐릭터 처리 중: ${character.nickname}`;
            
            // API 호출 및 처리 대기
            try {
                await fetchCharacterData(character.nickname, cell);
                completedCount++;
                
                // 진행률 업데이트
                const elapsedTime = (Date.now() - startTime) / 1000;
                const estimatedTotalTime = (elapsedTime / completedCount) * totalCharacters;
                const remainingTime = Math.max(0, Math.round(estimatedTotalTime - elapsedTime));
                
                ocrStatus.textContent = `${completedCount}/${totalCharacters} 완료. 예상 남은 시간: 약 ${remainingTime}초`;
            } catch (error) {
                console.error(`${character.nickname} 처리 중 오류:`, error);
                cell.textContent = "오류 발생";
            }
            
            // 다음 캐릭터 처리 전 잠시 대기 (API 안정성 향상)
            if (i < charactersToProcess.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        ocrStatus.textContent = `${totalCharacters}개 캐릭터 정보 조회 완료 (${totalTime}초 소요)`;
    }
    
    // 캐릭터 데이터 가져오기 - characterRead.js 활용
    function fetchCharacterData(nickname, cell) {
        return new Promise((resolve, reject) => {
            // 캐시에 결과가 있는지 확인
            if (resultCache[nickname]) {
                cell.textContent = resultCache[nickname].toLocaleString();
                resolve();
                return;
            }
            
            // characterRead.js의 함수 사용
            window.characterReadModule.getLopecCharacterBest(nickname)
                .then(response => {
                    if (response && response.result === "S" && response.data) {
                        const specPoint = response.data.LCHB_TOTALSUM || 0;
                        cell.textContent = specPoint > 0 ? specPoint.toLocaleString() : "정보 없음";
                        resultCache[nickname] = specPoint;
                    } else {
                        cell.textContent = "정보 없음";
                    }
                    resolve();
                })
                .catch(error => {
                    console.error(`${nickname} DB 조회 오류:`, error);
                    cell.textContent = "DB 오류";
                    resolve(); // 오류가 있어도 진행
                });
        });
    }
    
    // 공개 메서드
    return {
        init: function() {
            waitForOCRModule();
        }
    };
})();

// 페이지 로드 시 OCR 통합 모듈 초기화
document.addEventListener('DOMContentLoaded', function() {
    OCRIntegration.init();
});

console.log("OCRIntegration 모듈이 로드됨:", typeof OCRIntegration); 