// characterRead.js - 캐릭터 정보 조회 모듈

// 전역에서 접근 가능한 모듈 객체 생성
window.characterReadModule = {};

// 특정 캐릭터의 최고 점수 정보 읽기
function getLopecCharacterBest(characterNickname) {
    var atMode = "selectCharacterBest";
    var requestData = {
        atMode: atMode,
        lchaCharacterNickname: characterNickname
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            //console.log("달성 최고 점수");
            return response;
        },
        error: function(request, status, error) {
            console.log("LOPEC_CHARACTER_BEST 조회 실패");
            //console.log("request.status : " + request.status);
            //console.log("request.responseText : " + request.responseText);
        }
    });
}

// 다중 캐릭터 정보 한 번에 조회
function getBatchCharacters(nicknames) {
    var atMode = "batchQueryCharacters";
    
    // 닉네임이 문자열인 경우 배열로 변환
    if (typeof nicknames === 'string') {
        nicknames = [nicknames];
    }
    
    // 닉네임 배열이 아니거나 비어있는 경우 처리
    if (!Array.isArray(nicknames) || nicknames.length === 0) {
        console.log("유효한 닉네임 배열이 필요합니다");
        return $.Deferred().reject("유효한 닉네임 배열이 필요합니다").promise();
    }
    
    // 최대 20개로 제한
    if (nicknames.length > 20) {
        console.log("최대 20개의 닉네임만 처리 가능합니다. 처음 20개만 사용합니다.");
        nicknames = nicknames.slice(0, 20);
    }
    
    var requestData = {
        atMode: atMode,
        nicknames: JSON.stringify(nicknames)
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "../applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            console.log("다중 캐릭터 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("다중 캐릭터 조회 실패");
            console.log("상태:", request.status);
            console.log("오류:", error);
        }
    });
}

// 랭킹 정보 읽기 (타입별)
export function getLopecCharacterRanking(type) {
    var atMode = "selectRanking";
    var requestData = {
        atMode: atMode,
        rankingType: type
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            //console.log("전체 랭킹 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("LOPEC_CHARACTER_BEST_RANKING 조회 실패");
            //console.log("request.status : " + request.status);
        }
    });
}


// 특정 캐릭터의 랭킹 정보만 조회
export function getCharacterRankingInfo(characterNickname, rankingType) {
    var atMode = "selectCharacterRanking";
    var requestData = {
        atMode: atMode,
        rankingType: rankingType, // "DEAL" 또는 "SUP"
        lchaCharacterNickname: characterNickname
    };
    
    console.log("랭킹 조회 요청:", requestData);

    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            //console.log("캐릭터 랭킹 정보 조회 성공");
            console.log("받은 응답:", response);
            return response;
        },
        error: function(request, status, error) {
            console.log("캐릭터 랭킹 정보 조회 실패");
            //console.log("request.status : " + request.status);
            //console.log("응답 텍스트:", request.responseText);
            //console.log("오류 상세:", error);
        }
    });
}

// 해당 캐릭터의 직업 내 순위
export function getClassRanking(rankingType, baseClass = "") {
    var atMode = "selectClassRanking";
    var requestData = {
        atMode: atMode,
        rankingType: rankingType,
        baseClass: baseClass
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            //console.log("직업별 랭킹 조회 성공");
            return response;
        },
        error: function(request, status, error) {
            console.log("직업별 랭킹 조회 실패");
            //console.log("상태:", request.status);
            //console.log("오류:", error);
        }
    });
}

// 해당 캐릭터의 전체 랭킹 내 백분율
export function getOverallRankingPercentile(characterNickname, rankingType = "DEAL") {
    var atMode = "selectOverallPercentile";
    var requestData = {
        atMode: atMode,
        lchaCharacterNickname: characterNickname,
        rankingType: rankingType
    };
    
    return $.ajax({ 
        dataType: "json",
        type: "POST",
        url: "/applications/process/lopecCharacterBest/",
        data: requestData,
        success: function(response) {
            console.log(`${rankingType} 전체 랭킹 백분율 조회 성공`);
            return response;
        },
        error: function(request, status, error) {
            console.log(`${rankingType} 전체 랭킹 백분율 조회 실패`);
            //console.log("상태:", request.status);
            //console.log("오류:", error);
        }
    });
}

// 전역 객체에 함수 등록
window.characterReadModule = {
    getLopecCharacterBest: getLopecCharacterBest,
    getBatchCharacters: getBatchCharacters,
    getRankingInfoByType: getRankingInfoByType,
    getRankingPercentileByType: getRankingPercentileByType
};

// 명시적으로 전역 스코프에도 노출
window.getBatchCharacters = getBatchCharacters;