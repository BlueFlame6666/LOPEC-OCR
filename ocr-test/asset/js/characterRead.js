// 특정 캐릭터의 최고 점수 정보 읽기
export function getLopecCharacterBest(characterNickname) {
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