// lostark-ocr.js
// ESM 스타일 import 구문
import { getBatchCharacterData } from './characterRead.js';
import { getCharacterProfile } from './spec-point.js';

// IIFE 대신 변수에 할당
const LopecOCR = (function() {
    // ===========================================================================================
    // 설정 및 상수 정의
    // ===========================================================================================
    
    // OCR API 엔드포인트
    const API_URL = 'https://api.upstage.ai/v1/document-ai/ocr';
    
    // 프록시 서버 API 키 엔드포인트
    const API_KEY_PROXY_URL = 'https://restless-art-6037.tassardar6-c0f.workers.dev'; // 프록시 서버의 API 키 제공 엔드포인트 주소
    
    // OCR 버전 상수 정의
    const OCR_VERSIONS = {
        APPLICANT: 'applicant',    // 신청자 목록 (기존 version1)
        PARTICIPANT: 'participant' // 참가자 목록 (새로운 version2)
    };
    
    // ===========================================================================================
    // 프록시 서버에서 API 키 가져오기
    // ===========================================================================================
    
    /**
     * 프록시 서버에서 OCR API 키를 가져오는 함수
     * @returns {Promise<string>} API 키
     * @throws {Error} API 키 가져오기 실패 시 오류
     */
    async function getOcrApiKey() {
        try {
            // 프록시 서버에 API 키 요청
            const response = await fetch(API_KEY_PROXY_URL);
            
            // 응답 확인
            if (!response.ok) {
                throw new Error(`API 키 가져오기 실패: ${response.status} ${response.statusText}`);
            }
            
            // API 키 추출
            const data = await response.json();
            
            // 응답에서 API 키 확인
            if (!data || !data.apiKey) {
                throw new Error('프록시 서버에서 유효한 API 키를 제공하지 않았습니다');
            }
            
            return data.apiKey;
        } catch (error) {
            console.error('OCR API 키 가져오기 오류:', error);
            throw new Error(`API 키 가져오기 실패: ${error.message}`);
        }
    }
    
    // ===========================================================================================
    // 이미지 처리 관련 함수
    // ===========================================================================================
    
    /**
     * 클립보드에서 이미지를 가져오는 함수
     * @returns {Promise<Blob>} 클립보드의 이미지 Blob
     * @throws {Error} 클립보드 접근 관련 오류
     */
    async function getImageFromClipboard() {
        try {
            console.log("클립보드 접근 시도 중...");
            
            // 클립보드 API 지원 여부 확인
            if (!navigator.clipboard) {
                console.error("navigator.clipboard 객체가 없음 - 브라우저 미지원");
                throw new Error('현재 브라우저에서 클립보드 이미지 접근을 지원하지 않습니다. 크롬이나 엣지 브라우저를 사용해보세요.');
            }
            
            if (!navigator.clipboard.read) {
                console.error("navigator.clipboard.read 메소드가 없음 - 브라우저 미지원");
                throw new Error('현재 브라우저에서 클립보드 읽기 기능을 지원하지 않습니다. 크롬이나 엣지 브라우저를 사용해보세요.');
            }
            
            console.log("클립보드 API 지원 확인됨, 읽기 시도...");
            
            // 클립보드 읽기 시도
            console.time('clipboardRead');
            const items = await navigator.clipboard.read().catch(e => {
                console.error("클립보드 읽기 실패:", e);
                throw e;
            });
            console.timeEnd('clipboardRead');
            console.log("클립보드 항목 수:", items.length);
            
            for (const item of items) {
                console.log("클립보드 항목 타입:", item.types);
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    const imageType = item.types.find(type => type.startsWith('image/'));
                    console.log("이미지 타입 발견:", imageType);
                    
                    try {
                        const blob = await item.getType(imageType);
                        console.log("이미지 블롭 가져옴:", blob.size, "바이트");
                        return blob;
                    } catch (e) {
                        console.error("이미지 블롭 가져오기 실패:", e);
                        throw e;
                    }
                }
            }
            console.error("클립보드에 이미지 없음");
            throw new Error('클립보드에 이미지가 없습니다. Alt+PrtSc로 캡처 후 다시 시도해주세요.');
        } catch (error) {
            console.error("클립보드 접근 오류:", error);
            
            if (error.name === 'NotAllowedError') {
                throw new Error('클립보드 접근 권한이 없습니다. 사이트 권한 설정을 확인해주세요.');
            } else if (error.name === 'SecurityError') {
                throw new Error('보안 설정으로 인해 클립보드에 접근할 수 없습니다.');
            }
            throw new Error(`클립보드 접근 오류: ${error.message}`);
        }
    }
    
    /**
     * 이미지 오른쪽 부분을 크롭하는 함수 (화면 비율에 따라 다르게 처리)
     * @param {Image} img - 크롭할 이미지 객체
     * @returns {Promise<ImageData>} 크롭된 이미지 데이터
     */
    async function cropRightPartOfImage(img) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 이미지 비율 확인 및 크롭 영역 계산
                let cropWidth;
                const aspectRatio = img.width / img.height;
                
                // 화면 비율에 따라 크롭 영역 크기 조정
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
    
    /**
     * Blob를 Base64 문자열로 변환하는 함수
     * @param {Blob} blob - 변환할 이미지 Blob
     * @returns {Promise<string>} Base64 인코딩된 문자열
     */
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    
    /**
     * ImageData를 Blob으로 변환하는 함수
     * @param {ImageData} imageData - 변환할 이미지 데이터
     * @returns {Promise<Blob>} 변환된 이미지 Blob
     */
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
    
    /**
     * Blob에서 이미지 객체를 생성하는 함수
     * @param {Blob} blob - 이미지 Blob
     * @returns {Promise<Image>} 생성된 이미지 객체
     */
    function createImageFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }
    
    /**
     * OCR 결과에서 캐릭터 정보를 추출하는 함수
     * 버전별(신청자/참가자)로 다른 정규식 패턴 사용
     * 
     * @param {Object} ocrData - OCR API 결과 데이터
     * @param {string} version - OCR 처리 버전 (APPLICANT 또는 PARTICIPANT)
     * @param {Function|null} debug - 디버그 로그 콜백 함수
     * @returns {Array} 추출된 캐릭터 정보 배열
     */
    function extractCharacterInfo(ocrData, version = OCR_VERSIONS.APPLICANT, debug = null) {
        const characterResults = [];
        
        try {
            // OCR 결과 유효성 검사
            if (!ocrData) {
                console.error('OCR 결과가 비어있습니다', ocrData);
                return characterResults;
            }
            
            // OCR 텍스트 추출
            let allText = "";
            
            if (ocrData.text) {
                allText = ocrData.text;
                
                // 디버그 로그 기록
                if (debug && typeof debug === 'function') {
                    debug(`OCR 응답 텍스트: ${allText.substring(0, 500)}${allText.length > 500 ? '...(길이 제한)' : ''}`);
                    debug(`전체 텍스트 길이: ${allText.length} 자`);
                }
            } else {
                console.log("최상위 text 필드가 없습니다");
                return characterResults;
            }
            
            // 버전별 처리 (신청자/참가자 구분)
            if (version === OCR_VERSIONS.APPLICANT) {
                // ===========================================================================================
                // 신청자 목록 처리 로직 (APPLICANT 버전)
                // ===========================================================================================
                const levelNicknamePattern = /\n\s*Lv[.,]?(\d+)\s+([^\s]+)/g;
                const itemLevelPattern = /(\d{4}\.\d{2})\s+상세보기/g;
                
                let nicknameMatches = [...allText.matchAll(levelNicknamePattern)];
                let itemLevelMatches = [...allText.matchAll(itemLevelPattern)];
                
                // 디버그 정보 출력
                if (debug && typeof debug === 'function') {
                    debug(`버전: ${version}, 닉네임 매치 개수: ${nicknameMatches.length}, 아이템 레벨 매치 개수: ${itemLevelMatches ? itemLevelMatches.length : 0}`);
                    
                    if (nicknameMatches.length > 0) {
                        debug(`닉네임 첫 매치: ${nicknameMatches[0][0]}, 레벨: ${nicknameMatches[0][1]}, 닉네임 부분: ${nicknameMatches[0][2]}`);
                    }
                    
                    if (itemLevelMatches && itemLevelMatches.length > 0) {
                        debug(`아이템 레벨 첫 매치: ${itemLevelMatches[0][0]}, 추출된 아이템 레벨: ${itemLevelMatches[0][1]}`);
                    }
                }
                
                // 결과 배열 생성 - 매치 유효성 개선
                const hasNicknames = nicknameMatches.length > 0;
                const hasItemLevels = itemLevelMatches && itemLevelMatches.length > 0;
                const isMatchCountEqual = hasNicknames && hasItemLevels && (nicknameMatches.length === itemLevelMatches.length);
                
                // 매치 상태 로깅
                if (debug && typeof debug === 'function') {
                    debug(`매치 상태: 닉네임 ${hasNicknames ? '있음' : '없음'}, 아이템레벨 ${hasItemLevels ? '있음' : '없음'}, 일치 ${isMatchCountEqual ? '일치함' : '불일치'}`);
                }
                
                // 유효한 닉네임과 아이템 레벨 추출 (공통 로직)
                const validNicknames = [];
                const validItemLevels = [];
                
                // 닉네임 추출 및 검증
                for (let i = 0; i < nicknameMatches.length; i++) {
                    const nickname = nicknameMatches[i][2].split('\n')[0].trim().replace(/\s+/g, '');
                    if (isValidNickname(nickname)) {
                        validNicknames.push({
                            nickname: nickname,
                            index: i
                        });
                    }
                }
                
                // 아이템 레벨 추출 및 검증
                if (hasItemLevels) {
                    for (let i = 0; i < itemLevelMatches.length; i++) {
                        const itemLevel = itemLevelMatches[i][1];
                        if (isValidItemLevel(itemLevel)) {
                            validItemLevels.push({
                                itemLevel: itemLevel,
                                index: i
                            });
                        }
                    }
                }
                
                // 디버그 정보 추가
                if (debug && typeof debug === 'function') {
                    debug(`유효한 닉네임 수: ${validNicknames.length}, 유효한 아이템 레벨 수: ${validItemLevels.length}`);
                }
                
                // 최종 결과 생성 (일치 여부에 따라 다른 방식 사용)
                if (isMatchCountEqual && validNicknames.length === validItemLevels.length) {
                    // 인덱스가 정확히 일치하므로 직접 대응
                    for (let i = 0; i < validNicknames.length; i++) {
                        characterResults.push({
                            nickname: validNicknames[i].nickname,
                            itemLevel: validItemLevels[i].itemLevel
                        });
                    }
                    
                    if (debug && typeof debug === 'function') {
                        debug(`정확한 일치 매칭으로 ${validNicknames.length}개 캐릭터 추출 완료`);
                    }
                } else {
                    // 매치 수가 다르거나 유효한 항목 수가 다른 경우 최적 매칭 시도
                    const minLength = Math.min(validNicknames.length, validItemLevels.length);
                    
                    if (debug && typeof debug === 'function') {
                        debug(`최적 매칭으로 ${minLength}개 캐릭터 추출 시도`);
                    }
                    
                    for (let i = 0; i < minLength; i++) {
                        characterResults.push({
                            nickname: validNicknames[i].nickname,
                            itemLevel: validItemLevels[i].itemLevel
                        });
                    }
                }
                
                // 디버그 요약 정보
                if (debug && typeof debug === 'function') {
                    debug(`신청자 목록에서 추출된 캐릭터 수: ${characterResults.length}`);
                }
                
            } else if (version === OCR_VERSIONS.PARTICIPANT) {
                // 참가자 목록용 처리 로직 (새로운 규칙 적용)
                
                // 디버그 로그 헬퍼 함수 - 코드 가독성 향상
                const logDebug = (message) => {
                    if (debug && typeof debug === 'function') {
                        debug(message);
                    }
                };
                
                // 닉네임 후보 처리 헬퍼 함수
                const processNicknameCandidate = (candidateNickname) => {
                    // 닉네임 유효성 검사 수행
                    if (isValidParticipantNickname(candidateNickname)) {
                        // 이미 추가된 닉네임인지 확인
                        const isDuplicate = characterResults.some(item => item.nickname === candidateNickname);
                        
                        if (!isDuplicate) {
                            characterResults.push({
                                nickname: candidateNickname,
                                itemLevel: "" // 참가자 목록에는 아이템 레벨 없음
                            });
                            
                            logDebug(`유효한 닉네임으로 추가: ${candidateNickname}`);
                        } else {
                            logDebug(`중복 닉네임이라 무시: ${candidateNickname}`);
                        }
                    } else {
                        logDebug(`유효하지 않은 닉네임으로 필터링: ${candidateNickname}`);
                    }
                };
                
                // 텍스트 처리 시작
                logDebug("참가자 목록 처리 시작");
                
                // 1. 처리할 텍스트 범위 제한 - "인원 수" 또는 "2번 파티" 패턴 이후 텍스트만 처리
                let processedText = allText;
                let startText = ""; // 첫 번째 닉네임 추출용 텍스트
                
                // A. "인원 수" 패턴 찾기
                const memberCountPattern = /인원\s*수/;
                const memberCountMatch = processedText.match(memberCountPattern);
                
                // B. "2번 파티" 패턴 찾기
                const twoNumberPattern = /2\s*번\s*파티/;
                const twoNumberMatch = processedText.match(twoNumberPattern);
                
                // 패턴 검색 결과에 따른 텍스트 범위 조정
                if (memberCountMatch) {
                    // "인원 수" 패턴 처리
                    const startIndex = memberCountMatch.index;
                    logDebug(`"인원 수" 패턴 발견, 위치: ${startIndex}, 전체 텍스트 길이: ${allText.length}`);
                    
                    if (startIndex > -1) {
                        // "인원 수"를 포함한 위치부터 텍스트 저장
                        processedText = processedText.substring(startIndex);
                        logDebug(`"인원 수" 패턴 이후 텍스트: ${processedText.substring(0, 100)}...`);
                        
                        // 첫 번째 닉네임 추출용 텍스트 준비
                        // "인원 수" 패턴의 길이 계산
                        const patternLength = processedText.match(/인원\s*수/)[0].length;
                        startText = processedText.substring(patternLength).trim();
                        
                        logDebug(`"인원 수" 패턴 길이: ${patternLength}, 이후 텍스트: ${startText.substring(0, 100)}...`);
                    }
                } else if (twoNumberMatch) {
                    // "2번 파티" 패턴 처리
                    const startIndex = twoNumberMatch.index;
                    logDebug(`"2번 파티" 패턴 발견, 위치: ${startIndex}`);
                    
                    if (startIndex > -1) {
                        // 패턴 위치부터 텍스트 추출
                        processedText = processedText.substring(startIndex);
                        logDebug(`"2번 파티" 패턴 이후 텍스트: ${processedText.substring(0, 100)}...`);
                        
                        // "2번 파티" 다음 줄바꿈 이후 텍스트 추출
                        const nextNewlineIndex = processedText.indexOf('\n');
                        if (nextNewlineIndex > -1) {
                            processedText = processedText.substring(nextNewlineIndex);
                            startText = processedText.trim();
                            logDebug(`"2번 파티" 이후 줄바꿈 다음 텍스트: ${startText.substring(0, 100)}...`);
                        }
                    }
                } else {
                    logDebug(`"인원 수"와 "2번 파티" 패턴을 모두 찾을 수 없음, 전체 텍스트 처리`);
                    startText = processedText; // 시작 텍스트도 전체 텍스트로 설정
                }
                
                // 2. 첫 번째 닉네임 추출 시도 (startText 사용)
                logDebug("첫 번째 닉네임 추출 시도");
                
                // 특수문자 및 한자 제거 (텍스트 전처리)
                let cleanedStartText = startText.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, " ")
                                               .replace(/\s+/g, " ")
                                               .trim();
                
                logDebug(`정제된 시작 텍스트: ${cleanedStartText.substring(0, 100)}...`);
                
                // 첫 번째 공백을 찾아 첫 단어 추출
                const firstSpacePos = cleanedStartText.indexOf(' ');
                if (firstSpacePos > 0) {
                    // 첫 번째 단어 추출 및 유효성 검사
                    const firstWordCandidate = cleanedStartText.substring(0, firstSpacePos).trim();
                    logDebug(`첫 번째 단어 후보: ${firstWordCandidate}`);
                    
                    if (isValidParticipantNickname(firstWordCandidate)) {
                        // 유효한 닉네임이면 결과 배열 맨 앞에 추가
                        characterResults.unshift({
                            nickname: firstWordCandidate,
                            itemLevel: "", 
                            isFirstLineNickname: true
                        });
                        logDebug(`첫 번째 닉네임으로 추가: ${firstWordCandidate}`);
                    } else {
                        logDebug(`첫 번째 단어가 유효하지 않음: ${firstWordCandidate}`);
                        
                        // 두 번째 단어 시도
                        const restOfText = cleanedStartText.substring(firstSpacePos + 1).trim();
                        const nextSpaceIndex = restOfText.indexOf(' ');
                        
                        if (nextSpaceIndex > 0) {
                            const secondWordCandidate = restOfText.substring(0, nextSpaceIndex).trim();
                            logDebug(`두 번째 단어 시도: ${secondWordCandidate}`);
                            
                            if (isValidParticipantNickname(secondWordCandidate)) {
                                characterResults.unshift({
                                    nickname: secondWordCandidate,
                                    itemLevel: "", 
                                    isFirstLineNickname: true
                                });
                                logDebug(`두 번째 단어를 첫 닉네임으로 추가: ${secondWordCandidate}`);
                            }
                        }
                    }
                } else {
                    logDebug("첫 번째 공백을 찾을 수 없음");
                }
                
                // 3. 줄 단위로 분리 및 처리
                logDebug("텍스트를 줄 단위로 분리하여 처리 시작");
                const lines = processedText.split('\n')
                                          .map(line => line.trim())
                                          .filter(line => line.length > 0);
                
                logDebug(`분리된 줄 수: ${lines.length}, 처음 10개 줄: ${JSON.stringify(lines.slice(0, 10))}${lines.length > 10 ? '...' : ''}`);
                
                // 4. 파티원 닉네임 추출 - 알려진 서버명 배열
                const knownServerNames = [
                    "루페온", "카제로스", "아브렐슈드", "카단", "니나브", "실리안", "카마인", "아만"
                ];
                
                // 각 줄 처리
                lines.forEach((originalLine, lineIndex) => {
                    // 빠른 필터링: 두 글자 미만, 서버명과 정확히 일치, X 마커 없음
                    if (originalLine.length < 2 || 
                        knownServerNames.includes(originalLine) || 
                        !originalLine.includes("X")) {
                        logDebug(`줄 ${lineIndex} 필터링: ${originalLine.substring(0, 30)}${originalLine.length > 30 ? '...' : ''}`);
                        return; // forEach에서 continue 역할
                    }
                    
                    // 줄 전처리
                    let line = originalLine;
                    
                    // 1. 줄 시작 부분의 숫자+공백 제거
                    line = line.replace(/^\d+\s+/, " ");
                    
                    // 2. 중간에 위치한 단독 숫자+공백 패턴 처리
                    line = line.replace(/\s+\d+\s+/g, " ");
                    
                    // 3. X 앞에 있는 숫자 패턴 특별 처리
                    line = line.replace(/\s+\d+\s*X/g, " X");
                    
                    // 4. "인원"과 "수" 단어 제거
                    if (line.includes("인원") || line.includes("수")) {
                        line = line.replace(/인원|수/g, " ");
                    }
                    
                    // 5. 한글, 영어, 숫자를 제외한 문자 제거 (한자, 특수문자 등)
                    line = line.replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, " ").trim();
                    
                    if (originalLine !== line) {
                        logDebug(`줄 ${lineIndex} 전처리: "${originalLine}" -> "${line}"`);
                    }
                    
                    // X 마커 위치 찾기
                    const allXPositions = [];
                    let pos = line.indexOf("X");
                    while (pos !== -1) {
                        allXPositions.push(pos);
                        pos = line.indexOf("X", pos + 1);
                    }
                    
                    logDebug(`줄 ${lineIndex}: ${allXPositions.length}개의 X 마커 발견`);
                    
                    // 각 X 위치에 대해 앞쪽 닉네임 추출
                    allXPositions.forEach(xPos => {
                        if (xPos <= 0) return;
                        
                        // X 앞의 문자열 추출
                        let beforeX = line.substring(0, xPos).trim();
                        
                        // 앞 쪽 X 이후 텍스트만 고려하도록 처리
                        const xPositionsBeforeCurrent = allXPositions.filter(p => p < xPos);
                        if (xPositionsBeforeCurrent.length > 0) {
                            const lastXBeforeCurrent = Math.max(...xPositionsBeforeCurrent);
                            // 이전 X 다음부터 현재 X 전까지의 텍스트만 고려
                            beforeX = line.substring(lastXBeforeCurrent + 1, xPos).trim();
                        }
                        
                        logDebug(`X(${xPos}) 앞의 텍스트: '${beforeX}'`);
                        
                        // 닉네임 추출 시도 - 두 가지 패턴
                        // 1. X 바로 앞에 있는 단어 패턴 (더 정확한 매칭)
                        const exactPattern = /([가-힣a-zA-Z]{2,20})(?:\s*X)$/;
                        const exactMatch = beforeX.match(exactPattern);
                        
                        if (exactMatch) {
                            // X 바로 앞에 있는 단어를 우선적으로 사용
                            processNicknameCandidate(exactMatch[1]);
                        } else {
                            // 2. 일반적인 단어 추출 패턴
                            const nicknamePattern = /([가-힣a-zA-Z0-9]{2,20})(?:\s|$)/g;
                            const matches = [...beforeX.matchAll(nicknamePattern)];
                            
                            if (matches.length > 0) {
                                // 가장 X에 가까운(마지막) 패턴 매치 선택
                                const lastMatch = matches[matches.length - 1];
                                processNicknameCandidate(lastMatch[1]);
                            }
                        }
                    });
                });
                
                // 5. 첫 번째 단어 닉네임 중복 확인 - 처리된 결과 이후에 한 번 더 시도
                logDebug("첫 번째 닉네임 최종 확인");
                
                const firstSpaceInProcessedText = processedText.indexOf(' ');
                if (firstSpaceInProcessedText > 0) {
                    const firstWordCandidate = processedText.substring(0, firstSpaceInProcessedText).trim();
                    const isDuplicate = characterResults.some(item => item.nickname === firstWordCandidate);
                    
                    if (!isDuplicate && isValidParticipantNickname(firstWordCandidate)) {
                        characterResults.unshift({
                            nickname: firstWordCandidate,
                            itemLevel: "",
                            isFirstLineNickname: true
                        });
                        logDebug(`첫 번째 닉네임으로 최종 추가: ${firstWordCandidate}`);
                    }
                }
                
                logDebug(`참가자 목록 처리 완료: ${characterResults.length}개 닉네임 추출`);
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
    
    /**
     * 메인 OCR 처리 함수 - 클립보드 이미지를 OCR 처리하고 캐릭터 정보 추출
     * 
     * @param {string} apiKey - OCR API 키 ('free'인 경우 프록시에서 가져옴, 직접 제공할 경우 해당 키 사용)
     * @param {string} version - OCR 처리 버전 (APPLICANT 또는 PARTICIPANT)
     * @param {Object} callbacks - 콜백 함수 모음
     * @param {Function} callbacks.onStatusUpdate - 상태 업데이트 콜백
     * @param {Function} callbacks.onDebugInfo - 디버그 정보 콜백
     * @param {Function} callbacks.onImageCropped - 이미지 크롭 완료 콜백
     * @param {Function} callbacks.onError - 에러 콜백
     * @returns {Promise<Array>} 추출된 캐릭터 정보 배열
     */
    async function processClipboardImage(apiKey, version = OCR_VERSIONS.APPLICANT, callbacks = {}) {
        const { onStatusUpdate, onDebugInfo, onImageCropped, onError } = callbacks;
        
        // 상태 업데이트 및 디버그 함수 초기화
        const updateStatus = (message) => {
            if (onStatusUpdate && typeof onStatusUpdate === 'function') {
                onStatusUpdate(message);
            }
        };
        
        const addDebug = (message) => {
            if (onDebugInfo && typeof onDebugInfo === 'function') {
                onDebugInfo(message);
            }
        };
        
        const handleError = (error) => {
            if (onError && typeof onError === 'function') {
                onError(error);
            }
        };
        
        try {
            // API 키 처리 - 프록시 서버에서 가져옴, 직접 제공된 키 사용
            let actualApiKey;
            
            // apiKey가 'free'이거나 제공되지 않은 경우 프록시 서버에서 가져옴
            if (!apiKey || apiKey === 'free') {
                updateStatus('API 키 가져오는 중...');
                addDebug('프록시 서버에서 API 키 요청 시작');
                
                try {
                    actualApiKey = await getOcrApiKey();
                    addDebug('프록시 서버에서 API 키 가져오기 성공');
                } catch (keyError) {
                    addDebug(`API 키 가져오기 실패: ${keyError.message}`);
                    handleError(keyError);
                    throw keyError;
                }
            } else {
                // 직접 제공된 API 키 사용
                actualApiKey = apiKey;
                addDebug('직접 제공된 API 키 사용');
            }
            
            // API 키 유효성 검사
            if (!actualApiKey || typeof actualApiKey !== 'string') {
                throw new Error('유효한 API 키를 가져올 수 없습니다.');
            }
            
            // 버전 유효성 검사
            if (![OCR_VERSIONS.APPLICANT, OCR_VERSIONS.PARTICIPANT].includes(version)) {
                throw new Error('유효한 OCR 버전이 아닙니다: ' + version);
            }
            
            // 1. 클립보드 이미지 가져오기
            updateStatus('클립보드 이미지 가져오는 중...');
            addDebug('클립보드 이미지 요청 시작');
            
            // 클립보드 접근 타임아웃 설정 (10초)
            const clipboardPromise = getImageFromClipboard();
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('클립보드 접근 시간 초과 (10초)')), 10000);
            });
            
            // Promise.race를 사용하여 타임아웃 처리
            const imageBlob = await Promise.race([clipboardPromise, timeoutPromise]).catch(error => {
                addDebug(`클립보드 접근 실패: ${error.message}`);
                handleError(error);
                throw error;
            });
            
            addDebug(`클립보드 이미지 가져옴: ${Math.round(imageBlob.size / 1024)}KB`);
            
            // 2. 이미지 처리 (오른쪽 부분 크롭)
            updateStatus('이미지 처리 중...');
            const img = await createImageFromBlob(imageBlob);
            addDebug(`원본 이미지 크기: ${img.width}x${img.height}, 비율: ${(img.width / img.height).toFixed(2)}`);
            
            const croppedImageData = await cropRightPartOfImage(img);
            addDebug(`크롭된 이미지 크기: ${croppedImageData.width}x${croppedImageData.height}`);
            
            // 이미지 크롭 콜백 호출 (필요한 경우)
            if (onImageCropped && typeof onImageCropped === 'function') {
                onImageCropped(croppedImageData);
            }
            
            // 3. 이미지 데이터를 Blob으로 변환
            const croppedBlob = await imageDataToBlob(croppedImageData);
            addDebug(`처리된 이미지 크기: ${Math.round(croppedBlob.size / 1024)}KB`);
            
            // 4. OCR API 호출 준비
            updateStatus('OCR API 호출 중...');

            // 이미지를 base64로 변환 (API 요구사항에 맞춰 수정)
            const base64Image = await blobToBase64(croppedBlob);
            addDebug(`이미지를 Base64로 변환 완료: ${Math.round(base64Image.length / 1024)}KB`);

            // FormData 객체 생성 (원래 방식으로 복원)
            const formData = new FormData();
            formData.append('document', croppedBlob, 'image.png');
            formData.append('model', 'ocr');
            formData.append('options', JSON.stringify({ language: "ko" }));

            // API 요청 설정 - multipart/form-data 형식으로 전송 (원래 방식)
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${actualApiKey}`
                    // Content-Type은 FormData에서 자동으로 설정됨
                },
                body: formData
            };
            
            // 요청 디버그 정보
            addDebug(`OCR API 호출 시작 (버전: ${version}, API 키: ${actualApiKey.substring(0, 5)}...)`);

            // 5. OCR API 호출
            const response = await fetch(API_URL, requestOptions);
            
            // 응답 상태 확인
            if (!response.ok) {
                const errorResponse = await response.text();
                addDebug(`OCR API 오류: ${response.status} ${response.statusText}`);
                addDebug(`오류 응답: ${errorResponse}`);
                throw new Error(`OCR API 호출 실패: ${response.status} ${response.statusText}`);
            }
            
            // 6. OCR 결과 처리
            const ocrResult = await response.json();
            addDebug('OCR API 응답 수신 완료');
            
            // 7. 캐릭터 정보 추출
            updateStatus('OCR 결과에서 캐릭터 정보 추출 중...');
            const extractedCharacters = extractCharacterInfo(ocrResult, version, addDebug);
            
            // 8. 추출 결과 요약
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
            
            // 9. 변형 닉네임 생성 포함 확장된 결과
            const expandedCharacters = [];
            
            // 추출된 각 캐릭터에 대해 처리
            for (const character of extractedCharacters) {
                // 확장 결과에 원본 캐릭터 추가
                expandedCharacters.push(character);
                
                // 버전에 따라 닉네임 변형 생성 여부 결정
                if (version === OCR_VERSIONS.PARTICIPANT) {
                    // I/l 변형 생성 (참가자 목록에서만)
                    const variations = generateIlVariations(character.nickname);
                    
                    // 변형 닉네임에 대한 처리
                    for (const variant of variations) {
                        if (variant !== character.nickname) {
                            expandedCharacters.push({
                                ...character,
                                nickname: variant,
                                isVariation: true
                            });
                        }
                    }
                    
                    // 디버그 로그
                    if (variations.length > 1) {
                        addDebug(`'${character.nickname}'의 ${variations.length-1}개 변형 생성됨`);
                    }
                }
            }
            
            // 10. 최종 상태 업데이트 및 결과 반환
            const totalCount = expandedCharacters.length;
            const originalCount = extractedCharacters.length;
            
            updateStatus(`${originalCount}개 캐릭터 추출 완료${totalCount > originalCount ? ` (${totalCount-originalCount}개 변형 포함)` : ''}`);
            addDebug(`OCR 처리 완료: ${originalCount}개 캐릭터 추출, ${totalCount}개 최종 결과`);
            
            return expandedCharacters;
            
        } catch (error) {
            // 오류 처리 및 전파
            const errorMessage = `OCR 처리 오류: ${error.message}`;
            updateStatus(errorMessage);
            addDebug(errorMessage);
            
            if (error.stack) {
                addDebug(`오류 스택: ${error.stack}`);
            }
            
            throw error;
        }
    }
    
    /**
     * OCR로 추출된 캐릭터 정보를 DB와 연동하여 확장된 정보를 가져오는 함수
     * @param {Array} characters - OCR에서 추출한 캐릭터 정보 배열
     * @param {string} rankingType - 랭킹 타입 ("DEAL" 또는 "SUP")
     * @param {Function} onProgress - 진행 상황 콜백
     * @param {Function} onCharacterUpdate - 캐릭터 정보 업데이트 콜백 (선택적)
     * @returns {Promise<Array>} 확장된 캐릭터 정보 배열
     */
    async function processCharacterData(characters, rankingType = "DEAL", onProgress = null, onCharacterUpdate = null) {
        // 입력 검증
        if (!Array.isArray(characters) || characters.length === 0) {
            console.error("처리할 캐릭터 정보가 없습니다");
            return [];
        }

        try {
            // 진행 상황 업데이트
            if (onProgress && typeof onProgress === 'function') {
                onProgress("캐릭터 정보 처리 중...");
            }

            // 닉네임 배열 추출
            const nicknames = characters.map(char => char.nickname).filter(Boolean);
            
            if (nicknames.length === 0) {
                console.error("유효한 닉네임이 없습니다");
                return characters; // 원본 반환
            }

            // 로그 출력
            console.log(`${nicknames.length}개 캐릭터 정보 요청 중...`);
            if (onProgress && typeof onProgress === 'function') {
                onProgress(`${nicknames.length}개 캐릭터 정보 요청 중...`);
            }

            // 서버 요청 및 응답 처리
            try {
                // characterRead.js에서 가져온 getBatchCharacterData 함수 호출
                const response = await getBatchCharacterData(nicknames, rankingType);
                
                // 응답 유효성 검사
                let dbCharacters = [];
                let characterDataArray = [];
                let missingNicknames = [...nicknames];

                if (response && response.result === "S" && response.data && response.data !== "" && response.data !== "E") {


                // 데이터가 문자열인지 확인
                const dataStr = String(response.data);
                console.log("파싱할 데이터 문자열:", dataStr);
                characterDataArray = [];
                
                if (dataStr.includes(':')) {
                    const entries = dataStr.split(',');
                    console.log(`${entries.length}개 캐릭터 항목 파싱 시작`);
                    
                    for (const entry of entries) {
                        if (!entry || entry.trim() === '') continue;
                        
                        const parts = entry.split(':');
                        console.log(`항목 파싱: ${entry}`);
                        
                        // 최소 4개 이상의 데이터가 있어야 유효함 (닉네임, 레벨, 직업, 점수1)
                        if (parts.length >= 4) {
                            const nickname = parts[0];
                            const level = parts[1] || "";
                            const characterClass = parts[2] || ""; // 직업 정보
                            const totalSum = parts[3] || "";
                            const totalSumSupport = parts[4] || "";
                            const regDate = parts[5] || "";
                            
                            // 서포터 여부 확인 (직업명에 "서폿" 포함 여부)
                            const isSupport = characterClass.includes("서폿");
                            
                            // 표시할 점수 결정: 서포터면 totalSumSupport, 아니면 totalSum
                            const displayScore = isSupport ? totalSumSupport : totalSum;
                            
                            characterDataArray.push({
                                LCHA_CHARACTER_NICKNAME: nickname,
                                LCHA_LEVEL: level,
                                LCHA_CHARACTER_CLASS: characterClass,
                                LCHA_TOTALSUM: totalSum,
                                LCHA_TOTALSUMSUPPORT: totalSumSupport,
                                IS_SUPPORT: isSupport,
                                DISPLAY_SCORE: displayScore, // 표시용 점수
                                REG_DATE: regDate
                            });
                        }
                    }
                    
                    console.log(`${characterDataArray.length}개 캐릭터 정보 파싱 완료`);
                } 

                // DB에서 응답받지 못한 닉네임 목록 생성
                const respondedNicknames = new Set(characterDataArray.map(data => data.LCHA_CHARACTER_NICKNAME));
                missingNicknames = nicknames.filter(nickname => !respondedNicknames.has(nickname));

                // DB 정보가 있는 캐릭터만 처리
                dbCharacters = characterDataArray;
            } else {
                console.log("서버 응답 실패 or 형식 오류 : ", response);
            }

                // 진행 상황 업데이트
                if (onProgress && typeof onProgress === 'function') {
                    onProgress(`${dbCharacters.length}개 캐릭터 정보 조회 성공`);
                }
                
                // 원본 캐릭터 정보에 DB 데이터 병합
                const result = [...characters];
                

                // DB 정보와 OCR 정보 병합
                for (let i = 0; i < result.length; i++) {
                    const nickname = result[i].nickname;
                    const dbData = dbCharacters.find(item => 
                        item.LCHA_CHARACTER_NICKNAME === nickname
                    );
                    
                    if (dbData) {
                        // DB 정보 병합
                        result[i] = {
                            ...result[i],
                            itemLevel: dbData.LCHA_LEVEL || result[i].itemLevel || "",
                            characterClass: dbData.LCHA_CHARACTER_CLASS,
                            isSupport: dbData.IS_SUPPORT,
                            displayScore: dbData.DISPLAY_SCORE,
                            dbInfo: dbData, // 전체 DB 정보 포함
                            hasDbInfo: true
                        };
                    } else {
                        // DB에 정보가 없는 캐릭터 표시
                        result[i].hasDbInfo = false;
                        
                        // 누락된 닉네임 목록에 포함되어 있으면 처리 중임을 표시
                        if (missingNicknames.includes(nickname)) {
                            result[i].isProcessing = true;
                        }
                    }
                }
                
                // DB에 없는 캐릭터가 있으면 백그라운드에서 처리 시작
                if (missingNicknames.length > 0) {
                    console.log(`DB에 데이터가 없는 캐릭터 ${missingNicknames.length}개 발견:`, missingNicknames);

                    if (onProgress && typeof onProgress === 'function') {
                        onProgress(`DB에 없는 캐릭터 ${missingNicknames.length}개 순차 처리 중...`);
                    }

                    // 순차 처리를 위한 인덱스 관리
                    let currentIndex = 0;

                    // 순차적으로 처리하는 함수
                    const processNextCharacter = function() {
                        // 모든 캐릭터 처리 완료 확인
                        if (currentIndex >= missingNicknames.length) {
                            console.log("모든 누락 캐릭터 처리 완료");
                            return;
                        }

                        // 현재 처리할 닉네임 가져오기
                        const nickname = missingNicknames[currentIndex];
                        console.log(`"${nickname}" 캐릭터 정보 조회 시도... (${currentIndex + 1}/${missingNicknames.length})`);

                        // 진행 상황 업데이트
                        if (onProgress && typeof onProgress === 'function') {
                            onProgress(`캐릭터 정보 처리 중... (${currentIndex + 1}/${missingNicknames.length})`);
                        }

                        // 즉시 실행 함수 패턴 유지 (기존 구조 유지)
                        (function(capturedNickname) {
                            console.log(`"${capturedNickname}" 캐릭터 정보 조회 시도...`);

                            // getCharacterProfile 호출하여 백그라운드에서 처리
                            getCharacterProfile(capturedNickname, function(profileResult) {
                                console.log(`"${capturedNickname}" 캐릭터 정보 조회 및 DB 저장 완료`);

                                // 캐릭터 정보 업데이트를 위한 콜백이 제공된 경우
                                if (onCharacterUpdate && typeof onCharacterUpdate === 'function') {
                                    if (profileResult) {
                                        // profileResult에서 필요한 정보 추출
                                        const level = profileResult.itemLevel ? profileResult.itemLevel.toString() : "";
                                        const characterClass = profileResult.characterClass || "";
                                        const totalSum = profileResult.totalSum ? profileResult.totalSum.toString() : "";
                                        const totalSumSupport = profileResult.totalSumSupport ? profileResult.totalSumSupport.toString() : "";
                                        const isSupport = profileResult.isSupport;
                                        const displayScore = isSupport ? totalSumSupport : totalSum;

                                        // DB 형식과 동일한 구조로 데이터 구성
                                        const updatedCharData = {
                                            LCHA_CHARACTER_NICKNAME: capturedNickname,
                                            LCHA_LEVEL: level,
                                            LCHA_CHARACTER_CLASS: characterClass,
                                            LCHA_TOTALSUM: totalSum,
                                            LCHA_TOTALSUMSUPPORT: totalSumSupport,
                                            IS_SUPPORT: isSupport,
                                            DISPLAY_SCORE: displayScore,
                                            REG_DATE: profileResult.regDate || new Date().toISOString()
                                        };

                                        // 업데이트된 정보로 콜백 호출
                                        onCharacterUpdate(capturedNickname, {
                                            itemLevel: level,
                                            characterClass: characterClass,
                                            isSupport: isSupport,
                                            displayScore: displayScore,
                                            dbInfo: updatedCharData,
                                            hasDbInfo: true,
                                            isProcessing: false
                                        });

                                        console.log(`"${capturedNickname}" 캐릭터 정보 업데이트 완료 (DB 재호출 없이)`);
                                    } else {
                                        onCharacterUpdate(capturedNickname, { 
                                            hasDbInfo: false, 
                                            isProcessing: false,
                                            error: "계산 결과가 없습니다" 
                                        });
                                    }
                                } else {
                                    console.warn(`"${capturedNickname}" onCharacterUpdate 콜백이 없거나 함수가 아닙니다:`, onCharacterUpdate);
                                }

                                // 인덱스 증가 및 다음 캐릭터 처리 (1초 지연)
                                currentIndex++;
                                setTimeout(processNextCharacter, 1000);
                            });
                        })(nickname); // 즉시 실행 함수에 닉네임 전달 (이 부분 유지)
                    };

                    // 첫 번째 캐릭터 처리 시작
                    processNextCharacter();
                }

                return result;
                
            } catch (error) {
                console.error("데이터 처리 중 오류:", error);
                return characters;
            }

        } catch (error) {
            console.error("캐릭터 정보 처리 중 오류 발생:", error);
            if (onProgress && typeof onProgress === 'function') {
                onProgress(`오류 발생: ${error.message}`);
            }
            return characters; // 오류 시 원본 반환
        }
    }
    
    // ===========================================================================================
    // 모듈 인터페이스 - 외부에 노출할 API 정의
    // ===========================================================================================
    return {
        /**
         * 클립보드에서 이미지를 가져와 OCR 처리 후 캐릭터 정보를 추출하는 함수
         * @param {string} apiKey - OCR API 키 ('free'인 경우 프록시에서 가져옴, 직접 제공할 경우 해당 키 사용)
         * @param {string} version - OCR 처리 버전
         * @param {Object} callbacks - 콜백 함수들
         * @returns {Promise<Array>} 추출된 캐릭터 정보 배열
         */
        extractCharactersFromClipboard: processClipboardImage,
        
        /**
         * OCR로 추출된 캐릭터 정보를 DB와 연동하여 확장된 정보를 가져오는 함수
         * @param {Array} characters - OCR에서 추출한 캐릭터 정보 배열
         * @param {string} rankingType - 랭킹 타입 ("DEAL" 또는 "SUP")
         * @param {Function} onProgress - 진행 상황 콜백
         * @param {Function} onCharacterUpdate - 캐릭터 정보 업데이트 콜백
         * @returns {Promise<Array>} 확장된 캐릭터 정보 배열
         */
        processCharacterData: processCharacterData,
        
        /**
         * OCR 처리 버전 상수
         * - APPLICANT: 신청자 목록 처리
         * - PARTICIPANT: 참가자 목록 처리
         */
        VERSIONS: OCR_VERSIONS
    };
})();

// 브라우저 환경에서 전역으로 노출
window.LopecOCR = LopecOCR;

// ESM 내보내기 추가
export default LopecOCR;
export { LopecOCR };