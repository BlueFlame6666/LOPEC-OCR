// lostark-ocr.js
const LopecOCR = (function() {
    // API URL
    const API_URL = 'https://api.upstage.ai/v1/document-ai/ocr';
    
    // OCR 버전 정의
    const OCR_VERSIONS = {
        APPLICANT: 'applicant', // 신청자 목록 (기존 version1)
        PARTICIPANT: 'participant' // 참가자 목록 (새로운 version2)
    };
    
    // 이미지 처리 관련 함수들
    async function getImageFromClipboard() {
        try {
            // 클립보드 API 지원 여부 확인
            if (!navigator.clipboard || !navigator.clipboard.read) {
                throw new Error('현재 브라우저에서 클립보드 이미지 접근을 지원하지 않습니다. 크롬이나 엣지 브라우저를 사용해보세요.');
            }
            
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    const blob = await item.getType(item.types.find(type => type.startsWith('image/')));
                    return blob;
                }
            }
            throw new Error('클립보드에 이미지가 없습니다. Alt+PrtSc로 캡처 후 다시 시도해주세요.');
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                throw new Error('클립보드 접근 권한이 없습니다. 사이트 권한 설정을 확인해주세요.');
            } else if (error.name === 'SecurityError') {
                throw new Error('보안 설정으로 인해 클립보드에 접근할 수 없습니다.');
            }
            throw new Error(`클립보드 접근 오류: ${error.message}`);
        }
    }
    
    // 이미지 오른쪽 부분 크롭
    async function cropRightPartOfImage(img) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 이미지 비율 확인 및 크롭 영역 계산
                let cropWidth;
                const aspectRatio = img.width / img.height;
                
                if (aspectRatio > 2.1) { // 21:9 이상의 울트라와이드
                    cropWidth = img.width * 0.6;
                } else if (aspectRatio > 1.7) { // 16:9 모니터
                    cropWidth = img.width * 0.5;
                } else { // 4:3 등 기타 비율
                    cropWidth = img.width * 0.4;
                }
                
                // 오른쪽 부분 추출
                const cropX = img.width - cropWidth;
                
                canvas.width = cropWidth;
                canvas.height = img.height;
                
                // 이미지 오른쪽 부분만 그리기
                ctx.drawImage(img, cropX, 0, cropWidth, img.height, 0, 0, cropWidth, img.height);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                resolve(imageData);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // ImageData를 Blob으로 변환
    function imageDataToBlob(imageData) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            
            const ctx = canvas.getContext('2d');
            ctx.putImageData(imageData, 0, 0);
            
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('ImageData에서 Blob 변환 실패'));
                }
            }, 'image/png');
        });
    }
    
    // Blob에서 이미지 객체 생성
    function createImageFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }
    
    // OCR 결과에서 캐릭터 정보 추출 - 버전별 다른 정규식 패턴 사용
    function extractCharacterInfo(ocrData, version = OCR_VERSIONS.APPLICANT, debug = null) {
        const characterResults = [];
        
        try {
            if (!ocrData) {
                console.error('OCR 결과가 비어있습니다', ocrData);
                return characterResults;
            }
            
            let allText = "";
            
            if (ocrData.text) {
                allText = ocrData.text;
                
                // OCR 결과 텍스트를 디버그 로그에 추가
                if (debug && typeof debug === 'function') {
                    debug(`OCR 응답 텍스트: ${allText.substring(0, 500)}${allText.length > 500 ? '...(길이 제한)' : ''}`);
                    debug(`전체 텍스트 길이: ${allText.length} 자`);
                }
            } else {
                console.log("최상위 text 필드가 없습니다");
                return characterResults;
            }
            
            if (version === OCR_VERSIONS.APPLICANT) {
                // 신청자 목록용 패턴 (기존 version1)
                const levelNicknamePattern = /\n\s*Lv[.,]?(\d+)\s+([^\s]+)/g;
                const itemLevelPattern = /(\d{4}\.\d{2})\s+상세보기/g;
                
                let nicknameMatches = [...allText.matchAll(levelNicknamePattern)];
                let itemLevelMatches = [...allText.matchAll(itemLevelPattern)];
                
                // 디버그 정보 출력
                if (debug && typeof debug === 'function') {
                    debug(`버전: ${version}, 닉네임 매치 개수: ${nicknameMatches.length}, 아이템 레벨 매치 개수: ${itemLevelMatches.length}`);
                    
                    if (nicknameMatches.length > 0) {
                        debug(`닉네임 첫 매치: ${nicknameMatches[0][0]}, 레벨: ${nicknameMatches[0][1]}, 닉네임 부분: ${nicknameMatches[0][2]}`);
                    }
                    
                    if (itemLevelMatches && itemLevelMatches.length > 0) {
                        debug(`아이템 레벨 첫 매치: ${itemLevelMatches[0][0]}, 추출된 아이템 레벨: ${itemLevelMatches[0][1]}`);
                    }
                }
                
                // 결과 배열 생성
                if (nicknameMatches.length > 0 && itemLevelMatches && nicknameMatches.length === itemLevelMatches.length) {
                    for (let i = 0; i < nicknameMatches.length; i++) {
                        const nickname = nicknameMatches[i][2].split('\n')[0].trim().replace(/\s+/g, '');
                        const itemLevel = itemLevelMatches[i][1];
                        
                        if (isValidNickname(nickname) && isValidItemLevel(itemLevel)) {
                            characterResults.push({
                                nickname: nickname,
                                itemLevel: itemLevel
                            });
                        }
                    }
                } else {
                    // 매치 수가 다를 경우 최대한 많은 정보 추출 시도
                    // 이전 로직 유지
                    if (debug && typeof debug === 'function') {
                        debug('닉네임과 아이템 레벨 매치 수가 일치하지 않음. 매칭 시도 중...');
                    }
                    
                    // 유효한 닉네임 추출
                    const validNicknames = [];
                    for (let i = 0; i < nicknameMatches.length; i++) {
                        const nickname = nicknameMatches[i][2].split('\n')[0].trim().replace(/\s+/g, '');
                        if (isValidNickname(nickname)) {
                            validNicknames.push({
                                nickname: nickname,
                                index: i
                            });
                        }
                    }
                    
                    // 유효한 아이템 레벨 추출
                    const validItemLevels = [];
                    for (let i = 0; i < itemLevelMatches.length; i++) {
                        const itemLevel = itemLevelMatches[i][1];
                        if (isValidItemLevel(itemLevel)) {
                            validItemLevels.push({
                                itemLevel: itemLevel,
                                index: i
                            });
                        }
                    }
                    
                    // 추출된 정보 중 더 적은 쪽 기준으로 매칭
                    const minLength = Math.min(validNicknames.length, validItemLevels.length);
                    for (let i = 0; i < minLength; i++) {
                        characterResults.push({
                            nickname: validNicknames[i].nickname,
                            itemLevel: validItemLevels[i].itemLevel
                        });
                    }
                }
            } else if (version === OCR_VERSIONS.PARTICIPANT) {
                // 참가자 목록용 처리 로직 (새로운 규칙 적용)
                
                // 1. 처리할 텍스트 범위 제한 - "인원 수" 또는 "2번 파티" 패턴 이후 텍스트만 처리
                let processedText = allText;
                
                // 첫 번째 시도: "인원 수" 패턴 찾기 (보다 유연한 정규식 사용)
                const memberCountPattern = /인원\s*수/;
                const memberCountMatch = processedText.match(memberCountPattern);
                
                // 두 번째 시도: "2번 파티" 패턴 찾기 (첫 번째 패턴을 찾지 못한 경우)
                const twoNumberPattern = /2\s*번\s*파티/;
                
                if (memberCountMatch) {
                    // "인원 수" 이후의 텍스트로 제한
                    const startIndex = memberCountMatch.index;
                    if (startIndex > -1) {
                        // "인원 수"를 포함한 위치부터 텍스트 저장
                        let textAfterMemberCount = processedText.substring(startIndex);
                        
                        if (debug && typeof debug === 'function') {
                            debug(`"인원 수" 패턴 발견, 이후 텍스트만 사용: ${textAfterMemberCount.substring(0, 100)}...`);
                            debug(`"인원 수" 패턴 위치: ${startIndex}, 전체 텍스트 길이: ${allText.length}`);
                        }
                        
                        // "인원 수" 패턴 다음에 오는 단어 찾기
                        // 먼저 "인원 수" 패턴의 길이를 계산
                        const patternLength = textAfterMemberCount.match(/인원\s*수/)[0].length;
                        
                        // "인원 수" 패턴 이후의 텍스트
                        const textAfterPattern = textAfterMemberCount.substring(patternLength).trim();
                        
                        if (debug && typeof debug === 'function') {
                            debug(`"인원 수" 패턴 길이: ${patternLength}`);
                            debug(`"인원 수" 패턴 이후 텍스트: ${textAfterPattern.substring(0, 100)}...`);
                        }
                        
                        // 특수문자 및 한자 제거 (텍스트 전처리)
                        let cleanedText = textAfterPattern.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, " ");
                        cleanedText = cleanedText.replace(/\s+/g, " ").trim(); // 연속된 공백을 하나로 압축
                        
                        if (debug && typeof debug === 'function') {
                            debug(`정제된 텍스트: ${cleanedText.substring(0, 100)}...`);
                        }
                        
                        // 첫 번째 공백을 찾아 첫 단어 추출
                        const firstSpaceAfterPattern = cleanedText.indexOf(' ');
                        if (firstSpaceAfterPattern > 0) {
                            // 첫 번째 단어 추출
                            const firstWordCandidate = cleanedText.substring(0, firstSpaceAfterPattern).trim();
                            
                            if (debug && typeof debug === 'function') {
                                debug(`"인원 수" 패턴 이후 첫 번째 단어: ${firstWordCandidate}`);
                                debug(`첫 번째 공백 위치: ${firstSpaceAfterPattern}`);
                            }
                            
                            // 유효성 검사 후 닉네임으로 추가
                            if (isValidParticipantNickname(firstWordCandidate)) {
                                characterResults.unshift({
                                    nickname: firstWordCandidate,
                                    itemLevel: "", 
                                    isFirstLineNickname: true
                                });
                                
                                if (debug && typeof debug === 'function') {
                                    debug(`"인원 수" 패턴 이후 첫 번째 닉네임으로 추가: ${firstWordCandidate}`);
                                    debug(`현재 caracterResults 배열: ${JSON.stringify(characterResults)}`);
                                }
                            } else {
                                if (debug && typeof debug === 'function') {
                                    debug(`"인원 수" 패턴 이후 첫 번째 단어 유효하지 않음: ${firstWordCandidate}`);
                                    
                                    // 유효하지 않은 이유 상세 확인
                                    const knownServerNames = [
                                        "루페온", "실리안", "아만", "카마인", "카제로스", "아브렐슈드", "카단", "니나브"
                                    ];
                                    const excludedExactWords = [
                                        "파티", "찾기", "신청", "수락", "거절", "참가자", "신청자", "레이드", "수강석", 
                                        "확인", "취소", "귓속말", "길드", "친구", "차단", "정보", "캐릭터", "모집중"
                                    ];
                                    
                                    if (knownServerNames.includes(firstWordCandidate)) {
                                        debug(`유효하지 않은 이유: 서버명과 일치`);
                                    } else if (firstWordCandidate === "인원" || firstWordCandidate === "수") {
                                        debug(`유효하지 않은 이유: "인원" 또는 "수"와 정확히 일치`);
                                    } else if (excludedExactWords.includes(firstWordCandidate)) {
                                        debug(`유효하지 않은 이유: 제외 단어 목록에 포함됨`);
                                    } else if (!/[a-zA-Z가-힣]/.test(firstWordCandidate)) {
                                        debug(`유효하지 않은 이유: 한글 또는 영문자 포함 안 됨`);
                                    } else if (firstWordCandidate.length < 2 || firstWordCandidate.length > 20) {
                                        debug(`유효하지 않은 이유: 길이 제한 (${firstWordCandidate.length}자)`);
                                    } else {
                                        debug(`유효하지 않은 이유: 알 수 없음`);
                                    }
                                    
                                    // 다음 단어 시도
                                    const restOfText = cleanedText.substring(firstSpaceAfterPattern + 1).trim();
                                    const nextSpaceIndex = restOfText.indexOf(' ');
                                    
                                    if (nextSpaceIndex > 0) {
                                        const secondWordCandidate = restOfText.substring(0, nextSpaceIndex).trim();
                                        debug(`두 번째 단어 시도: ${secondWordCandidate}`);
                                        
                                        if (isValidParticipantNickname(secondWordCandidate)) {
                                            characterResults.unshift({
                                                nickname: secondWordCandidate,
                                                itemLevel: "", 
                                                isFirstLineNickname: true
                                            });
                                            debug(`두 번째 단어를 첫 닉네임으로 추가: ${secondWordCandidate}`);
                                        } else {
                                            debug(`두 번째 단어도 유효하지 않음: ${secondWordCandidate}`);
                                        }
                                    }
                                }
                            }
                        } else if (debug && typeof debug === 'function') {
                            debug(`"인원 수" 패턴 이후 텍스트에서 공백을 찾을 수 없음`);
                        }
                        
                        // 원래 코드처럼 텍스트 자르기 계속 진행
                        processedText = processedText.substring(startIndex);
                    }
                } else {
                    // "인원 수" 패턴이 없는 경우 "2번 파티" 패턴 시도
                    const twoNumberMatch = processedText.match(twoNumberPattern);
                    
                    if (twoNumberMatch) {
                        // "2번 파티" 이후의 텍스트로 제한
                        const startIndex = twoNumberMatch.index;
                        if (startIndex > -1) {
                            // 인덱스 다음 위치부터 텍스트 자르기
                            processedText = processedText.substring(startIndex);
                            
                            if (debug && typeof debug === 'function') {
                                debug(`"2번 파티" 패턴 발견, 이후 텍스트만 사용: ${processedText.substring(0, 100)}...`);
                            }
                            
                            // "2번 파티" 다음에 오는 첫 번째 줄바꿈(\n) 이후의 텍스트만 처리
                            const nextNewlineIndex = processedText.indexOf('\n');
                            if (nextNewlineIndex > -1) {
                                processedText = processedText.substring(nextNewlineIndex);
                                
                                if (debug && typeof debug === 'function') {
                                    debug(`"2번 파티" 이후 줄바꿈 다음 텍스트만 사용: ${processedText.substring(0, 100)}...`);
                                }
                            }
                        }
                    } else if (debug && typeof debug === 'function') {
                        debug(`"인원 수"와 "2번 파티" 패턴을 모두 찾을 수 없음, 전체 텍스트 처리`);
                        debug(`텍스트 처음 100자: ${allText.substring(0, 100)}`);
                        debug(`"인원 수" 패턴: ${memberCountPattern.toString()}`);
                        debug(`"2번 파티" 패턴: ${twoNumberPattern.toString()}`);
                    }
                }
                
                // 3. 텍스트를 줄 단위로 분리하고 전처리
                const lines = processedText.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0); // 빈 줄 제거
                
                if (debug && typeof debug === 'function') {
                    debug(`분리된 줄 수: ${lines.length}`);
                    debug(`처리할 줄 목록: ${JSON.stringify(lines.slice(0, 10))}${lines.length > 10 ? '...(길이 제한)' : ''}`);
                }
                
                // 4. 파티원 닉네임 추출 규칙 적용
                
                // 알려진 서버명 배열
                const knownServerNames = [
                    "루페온", "카제로스", "아브렐슈드", "카단", "니나브", "실리안", "카마인", "아만"
                ];
                
                // 각 줄 처리
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    
                    // 규칙: 두 글자 미만인지 확인
                    if (line.length < 2) {
                        if (debug && typeof debug === 'function') {
                            debug(`두 글자 미만이라 무시: ${line}`);
                        }
                        continue;
                    }
                    
                    // 규칙: 서버명과 정확히 일치하는 경우 무시
                    if (knownServerNames.includes(line)) {
                        if (debug && typeof debug === 'function') {
                            debug(`서버명과 정확히 일치하여 무시: ${line}`);
                        }
                        continue;
                    }
                    
                    // 규칙: 숫자 패턴 처리 강화 - 다양한 위치의 숫자 제거
                    const originalLine = line;
                    
                    // 1. 줄 시작 부분의 숫자+공백 제거 
                    line = line.replace(/^\d+\s+/, " ");
                    
                    // 2. 중간에 위치한 단독 숫자+공백 패턴 처리
                    line = line.replace(/\s+\d+\s+/g, " ");
                    
                    // 3. X 앞에 있는 숫자 패턴 특별 처리
                    line = line.replace(/\s+\d+\s*X/g, " X");
                    
                    if (originalLine !== line && debug && typeof debug === 'function') {
                        debug(`숫자 패턴 제거: ${originalLine} -> ${line}`);
                    }
                    
                    // 새로운 규칙: 줄에 X가 포함되어 있는지 확인 (순서 변경, 먼저 확인만 하고 제거는 나중에)
                    if (!line.includes("X")) {
                        if (debug && typeof debug === 'function') {
                            debug(`X가 포함되지 않아 무시: ${line}`);
                        }
                        continue;
                    }
                    
                    // "인원"과 "수" 단어 제거
                    let processedLine = line;
                    if (processedLine.includes("인원") || processedLine.includes("수")) {
                        const originalInwonLine = processedLine;
                        processedLine = processedLine.replace(/인원|수/g, " ");
                        if (debug && typeof debug === 'function') {
                            debug(`"인원"과 "수" 제거: ${originalInwonLine} -> ${processedLine}`);
                        }
                    }
                    
                    // 한글, 영어, 숫자를 제외한 문자 제거 (한자, 특수문자 등)
                    const originalProcessedLine = processedLine;
                    processedLine = processedLine.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, " ");
                    if (originalProcessedLine !== processedLine && debug && typeof debug === 'function') {
                        debug(`특수문자/한자 제거: ${originalProcessedLine} -> ${processedLine}`);
                    }
                    
                    // 앞뒤 공백 제거
                    processedLine = processedLine.trim();
                    
                    // 개선된 로직: 모든 "X" 마커를 찾아 각각의 앞에 있는 단어 추출
                    const allXPositions = [];
                    let pos = processedLine.indexOf("X");
                    while (pos !== -1) {
                        allXPositions.push(pos);
                        pos = processedLine.indexOf("X", pos + 1);
                    }
                    
                    if (debug && typeof debug === 'function') {
                        debug(`찾은 X 마커 개수: ${allXPositions.length}`);
                    }
                    
                    // 각 X 위치에 대해 앞쪽 닉네임 추출
                    for (const xPos of allXPositions) {
                        if (xPos <= 0) continue;
                        
                        // X 앞의 문자열 추출
                        let beforeX = processedLine.substring(0, xPos).trim();
                        
                        // 앞 쪽 X 이후 텍스트만 고려하도록 처리
                        const xPositionsBeforeCurrent = allXPositions.filter(p => p < xPos);
                        if (xPositionsBeforeCurrent.length > 0) {
                            const lastXBeforeCurrent = Math.max(...xPositionsBeforeCurrent);
                            // 이전 X 다음부터 현재 X 전까지의 텍스트만 고려
                            beforeX = processedLine.substring(lastXBeforeCurrent + 1, xPos).trim();
                        }
                        
                        if (debug && typeof debug === 'function') {
                            debug(`X(${xPos}) 앞의 텍스트: '${beforeX}'`);
                        }
                        
                        // 닉네임 추출을 위한 정규식 패턴
                        // 1. X 바로 앞에 있는 단어 패턴 (더 정확한 매칭)
                        const exactPattern = /([가-힣a-zA-Z]{2,20})(?:\s*X)$/;
                        const exactMatch = beforeX.match(exactPattern);
                        
                        if (exactMatch) {
                            // X 바로 앞에 있는 단어를 우선적으로 사용
                            const candidateNickname = exactMatch[1];
                            
                            if (debug && typeof debug === 'function') {
                                debug(`X 바로 앞의 정확한 닉네임 후보: ${candidateNickname}`);
                            }
                            
                            // 닉네임 유효성 검사 및 추가 로직...
                            processNicknameCandidate(candidateNickname);
                        } else {
                            // 일반적인 단어 추출 패턴 (기존 방식)
                            const nicknamePattern = /([가-힣a-zA-Z0-9]{2,20})(?:\s|$)/g;
                            const matches = [...beforeX.matchAll(nicknamePattern)];
                            
                            if (matches.length > 0) {
                                // 가장 X에 가까운(마지막) 패턴 매치 선택
                                const lastMatch = matches[matches.length - 1];
                                const candidateNickname = lastMatch[1];
                                
                                if (debug && typeof debug === 'function') {
                                    debug(`일반 패턴으로 찾은 닉네임 후보: ${candidateNickname}`);
                                }
                                
                                // 닉네임 유효성 검사 및 추가 로직...
                                processNicknameCandidate(candidateNickname);
                            }
                        }
                        
                        // 닉네임 후보 처리를 위한 내부 함수
                        function processNicknameCandidate(candidateNickname) {
                            // 닉네임 유효성 검사 수행
                            if (isValidParticipantNickname(candidateNickname)) {
                                // 이미 추가된 닉네임인지 확인
                                const isDuplicate = characterResults.some(item => item.nickname === candidateNickname);
                                
                                if (!isDuplicate) {
                                    characterResults.push({
                                        nickname: candidateNickname,
                                        itemLevel: "" // 참가자 목록에는 아이템 레벨 없음
                                    });
                                    
                                    if (debug && typeof debug === 'function') {
                                        debug(`유효한 닉네임으로 추가: ${candidateNickname}`);
                                    }
                                } else if (debug && typeof debug === 'function') {
                                    debug(`중복 닉네임이라 무시: ${candidateNickname}`);
                                }
                            } else if (debug && typeof debug === 'function') {
                                debug(`유효하지 않은 닉네임으로 필터링: ${candidateNickname}`);
                            }
                        }
                    }
                }
                
                // 첫 번째 닉네임 추출 - 처리된 결과 이후에 수행
                // 이 방식으로 처리하면 항상 첫 번째 닉네임이 결과 맨 앞에 배치됨
                const firstSpaceInProcessedText = processedText.indexOf(' ');
                if (debug && typeof debug === 'function') {
                    debug(`첫 번째 닉네임 추출 시작 - 처리된 텍스트: ${processedText.substring(0, 50)}...`);
                }
                
                if (firstSpaceInProcessedText > 0) {
                    // 처리된 텍스트의 첫 부분 추출 시도
                    const firstWordCandidate = processedText.substring(0, firstSpaceInProcessedText).trim();
                    
                    if (debug && typeof debug === 'function') {
                        debug(`첫 번째 공백 위치: ${firstSpaceInProcessedText}, 추출 후보: ${firstWordCandidate}`);
                    }
                    
                    // 이미 결과에 있는 닉네임인지 확인
                    const isDuplicate = characterResults.some(item => item.nickname === firstWordCandidate);
                    
                    // 중복이 아니고 유효한 경우에만 추가
                    if (!isDuplicate && isValidParticipantNickname(firstWordCandidate)) {
                        characterResults.unshift({  // 결과 배열의 앞에 추가
                            nickname: firstWordCandidate,
                            itemLevel: "", // 참가자 목록에는 아이템 레벨 없음
                            isFirstLineNickname: true
                        });
                        
                        if (debug && typeof debug === 'function') {
                            debug(`첫 번째 닉네임으로 추가: ${firstWordCandidate}`);
                        }
                    } else if (debug && typeof debug === 'function') {
                        debug(`첫 번째 닉네임 후보 제외 이유: ${isDuplicate ? '중복' : '유효하지 않음'}`);
                    }
                } else if (debug && typeof debug === 'function') {
                    debug(`처리된 텍스트에서 공백을 찾을 수 없음`);
                }
                
                if (debug && typeof debug === 'function') {
                    debug(`처리 후 추출된 닉네임 수: ${characterResults.length}`);
                    debug(`추출된 닉네임 목록: ${JSON.stringify(characterResults.map(c => c.nickname))}`);
                }
            } else {
                console.error('알 수 없는 OCR 버전:', version);
                return characterResults;
            }
            
            return characterResults;
        } catch (error) {
            console.error('캐릭터 정보 추출 중 오류:', error);
            if (debug && typeof debug === 'function') {
                debug(`캐릭터 정보 추출 중 오류: ${error.message}`);
                debug(`오류 상세: ${error.stack}`);
            }
            return [];
        }
    }
    
    // 닉네임 유효성 검사 (신청자 목록용)
    function isValidNickname(nickname) {
        if (!nickname || nickname.length < 2 || nickname.length > 20) return false;
        
        const excludedWords = ['lv', 'level', 'hp', 'mp', '상세보기', '수락', '거절', '파티', '찾기', '수강석', '특성', '체력', '정보', '귓속말', '길드'];
        if (excludedWords.some(word => nickname.toLowerCase().includes(word))) return false;
        
        return true;
    }
    
    // 참가자 목록용 닉네임 유효성 검사 (새 규칙 적용)
    function isValidParticipantNickname(nickname) {
        // 서버명과 정확히 일치하는지 확인
        const knownServerNames = [
            "루페온", "실리안", "아만", "카마인", "카제로스", "아브렐슈드", "카단", "니나브"
        ];
        if (knownServerNames.includes(nickname)) return false;
        
        // "인원" 또는 "수"와 정확히 일치하는 경우 제외
        if (nickname === "인원" || nickname === "수") return false;
        
        // 알려진 UI 요소나 게임 용어 필터링
        const excludedExactWords = [
            "파티", "찾기", "신청", "수락", "거절", "참가자", "신청자", "레이드", "수강석", 
            "확인", "취소", "귓속말", "길드", "친구", "차단", "정보", "캐릭터", "모집중"
        ];
        if (excludedExactWords.includes(nickname)) return false;
        
        // 닉네임에는 최소한 한 개의 한글 또는 영문자가 포함되어야 함
        if (!/[a-zA-Z가-힣]/.test(nickname)) return false;
        
        // 숫자로만 구성된 경우 제외 규칙 제거 (사용자 요청에 따라)
        
        // 두 글자 이상 20자 이하 확인
        if (!nickname || nickname.length < 2 || nickname.length > 20) return false;
        
        return true;
    }
    
    // 아이템 레벨 유효성 검사
    function isValidItemLevel(itemLevel) {
        return /^\d{4}\.\d{2}$/.test(itemLevel);
    }
    
    // I와 l 변형 생성 (성능 최적화)
    function generateIlVariations(nickname) {
        let ilCount = 0;
        const positions = [];
        
        // I와 l의 위치와 개수 파악
        for (let i = 0; i < nickname.length; i++) {
            if (nickname[i] === 'I' || nickname[i] === 'l') {
                ilCount++;
                positions.push(i);
            }
        }
        
        // I/l이 없거나 3개 이상이면 원본만 반환 (변형이 너무 많아짐)
        if (ilCount === 0 || ilCount > 2) {
            return [nickname];
        }
        
        const variations = [];
        const totalCombinations = Math.pow(2, positions.length);
        
        // 변형 생성 (최대 4개까지만 - 2개 문자의 경우)
        for (let i = 0; i < totalCombinations; i++) {
            let variant = nickname.split('');
            
            for (let j = 0; j < positions.length; j++) {
                const bitIsSet = (i & (1 << j)) !== 0;
                variant[positions[j]] = bitIsSet ? 'I' : 'l';
            }
            
            variations.push(variant.join(''));
        }
        
        return variations;
    }
    
    // 메인 OCR 처리 함수 - 전달된 API 키와 버전 사용
    async function processClipboardImage(apiKey, version = OCR_VERSIONS.APPLICANT, callbacks = {}) {
        const { onStatusUpdate, onDebugInfo, onImageCropped } = callbacks;
        
        // API 키 유효성 검사
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('유효한 API 키가 필요합니다.');
        }
        
        // 버전 유효성 검사
        if (![OCR_VERSIONS.APPLICANT, OCR_VERSIONS.PARTICIPANT].includes(version)) {
            throw new Error('유효한 OCR 버전이 아닙니다: ' + version);
        }
        
        // 'free'로 입력된 경우 기본 API 키 사용 (HTML 인터페이스 호환성 유지)
        const actualApiKey = apiKey === 'free' ? 'up_cdqdDDwambXqQoPoLvaHWmrWC3MO7' : apiKey;
        
        // 상태 업데이트 함수
        const updateStatus = (message) => {
            if (onStatusUpdate && typeof onStatusUpdate === 'function') {
                onStatusUpdate(message);
            }
            //console.log(message); // 콘솔에도 기록
        };
        
        // 디버그 정보 추가 함수
        const addDebug = (message) => {
            if (onDebugInfo && typeof onDebugInfo === 'function') {
                onDebugInfo(message);
            }
            //console.log(message); // 콘솔에도 기록
        };
        
        try {
            updateStatus('클립보드에서 이미지 가져오는 중...');
            addDebug(`OCR 버전: ${version}`);
            
            // 클립보드에서 이미지 가져오기
            const imageBlob = await getImageFromClipboard();
            
            updateStatus('이미지 처리 중...');
            // 이미지 로드
            const img = await createImageFromBlob(imageBlob);
            
            // 이미지 오른쪽 부분 추출
            let processedBlob;
            try {
                const croppedImage = await cropRightPartOfImage(img);
                
                // 크롭된 이미지 콜백 호출
                if (onImageCropped && typeof onImageCropped === 'function') {
                    onImageCropped(croppedImage);
                }
                
                processedBlob = await imageDataToBlob(croppedImage);
            } catch (error) {
                addDebug(`이미지 분할 실패: ${error.message}. 원본 이미지 사용`);
                processedBlob = imageBlob;
            }
            
            // API 호출 - 전달된 API 키 사용
            updateStatus('OCR API 호출 중...');
            try {
                const formData = new FormData();
                formData.append('document', processedBlob, 'image.png');
                
                const headers = new Headers();
                headers.append('Authorization', `Bearer ${actualApiKey}`); // 전달된 API 키 사용
                
                addDebug('API 호출 시작: ' + API_URL);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: formData,
                    mode: 'cors'
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    if (response.status === 401) {
                        throw new Error('API 키가 유효하지 않습니다. 올바른 API 키를 입력해주세요.');
                    } else if (response.status === 429) {
                        throw new Error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
                    } else {
                        throw new Error(`API 오류 (${response.status}): ${errorText}`);
                    }
                }
                
                const data = await response.json();
                addDebug('API 응답 수신 완료');
                
                // 캐릭터 정보 추출 - 선택된 버전에 맞는 추출 로직 사용
                updateStatus('캐릭터 정보 추출 중...');
                const extractedCharacters = extractCharacterInfo(data, version, addDebug);
                
                // 추출 결과 정보 로깅
                addDebug(`추출된 캐릭터 수: ${extractedCharacters.length}`);
                if (extractedCharacters.length > 0) {
                    addDebug(`첫 번째 캐릭터: ${extractedCharacters[0].nickname}, 아이템 레벨: ${extractedCharacters[0].itemLevel}`);
                    // isFirstLineNickname 속성 확인
                    const firstNicknameChar = extractedCharacters.find(char => char.isFirstLineNickname);
                    if (firstNicknameChar) {
                        addDebug(`첫 번째 닉네임 플래그가 있는 캐릭터: ${firstNicknameChar.nickname}`);
                    } else {
                        addDebug(`첫 번째 닉네임 플래그가 있는 캐릭터 없음`);
                    }

                    // 추출된 모든 캐릭터 로그
                    addDebug(`추출된 모든 캐릭터: ${JSON.stringify(extractedCharacters.map(c => ({
                        nickname: c.nickname,
                        isFirstLineNickname: c.isFirstLineNickname
                    })))}`);
                }
                
                // 변형 닉네임 생성 포함 확장된 결과
                const expandedCharacters = [];
                
                extractedCharacters.forEach(item => {
                    // 원본 닉네임 추가
                    expandedCharacters.push({
                        nickname: item.nickname,
                        itemLevel: item.itemLevel || '',
                        isOriginal: true,
                        isFirstLineNickname: item.isFirstLineNickname
                    });
                    
                    // I/l 변형 생성 및 추가
                    const variations = generateIlVariations(item.nickname);
                    
                    // 원본과 다른 변형만 추가
                    variations.forEach(variant => {
                        if (variant !== item.nickname) {
                            expandedCharacters.push({
                                nickname: variant,
                                itemLevel: item.itemLevel || '',
                                isOriginal: false,
                                isFirstLineNickname: item.isFirstLineNickname
                            });
                        }
                    });
                });
                
                // 디버그 로그 추가 - 확장된 결과 확인
                if (onDebugInfo && typeof onDebugInfo === 'function') {
                    addDebug(`확장된 캐릭터 결과:`);
                    expandedCharacters.forEach((char, idx) => {
                        addDebug(`${idx+1}. ${char.nickname} - 원본: ${char.isOriginal}, 첫 번째 닉네임: ${char.isFirstLineNickname}`);
                    });
                    
                    // 첫 번째 닉네임 플래그가 있는 캐릭터 확인
                    const firstNicknameFound = expandedCharacters.some(char => char.isFirstLineNickname === true);
                    addDebug(`최종 결과에 첫 번째 닉네임 캐릭터 포함: ${firstNicknameFound}`);
                    
                    if (firstNicknameFound) {
                        const firstChar = expandedCharacters.find(char => char.isFirstLineNickname === true);
                        addDebug(`최종 첫 번째 닉네임 캐릭터: ${firstChar.nickname}`);
                    }
                }
                
                updateStatus('처리 완료!');
                return expandedCharacters;
            } catch (error) {
                console.error('API 호출 중 오류:', error);
                throw new Error(`API 호출 실패: ${error.message}`);
            }
        } catch (error) {
            console.error('이미지 처리 중 오류 발생:', error);
            throw error;
        }
    }
    
    // 외부에 노출할 인터페이스
    return {
        extractCharactersFromClipboard: processClipboardImage,
        VERSIONS: OCR_VERSIONS // 버전 정보 외부에 노출
    };
})();