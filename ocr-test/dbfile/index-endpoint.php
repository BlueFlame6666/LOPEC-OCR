<?php
/* ***************************************************************************************************************************
 * session check
 * ************************************************************************************************************************* */
session_start();
header("Content-Type: text/json; charset=utf-8");
if (!preg_match("/".$_SERVER['HTTP_HOST']."/i", $_SERVER['HTTP_REFERER'])) {
    exit("Direct Access not Allowed!");
}

/* ***************************************************************************************************************************
 * config / common include
 * ************************************************************************************************************************* */
include $_SERVER["DOCUMENT_ROOT"]."/applications/commons/common.comm.php";
?>
<?php 
/* **********************************************************************************************************
 * json data response
 * ******************************************************************************************************** */
$responseData = $_REQUEST;

/* **********************************************************************************************************
 * common parameter
 * ******************************************************************************************************** */
if(isset($responseData["atMode"]) || !empty($responseData["atMode"])) { 
    $atMode = $libString->strInsertDb($responseData["atMode"]); 
} else { 
    $atMode = ""; 
}

$regCd = "lopec1234567890";
$regId = "lopec";
$regName = "로펙";
$regIp = $libVisit->getIp();
$regDate = $libDate->getToDateTime();

/* **********************************************************************************************************
 * page parameter
 * ******************************************************************************************************** */
// character info
if(isset($responseData["lchaCharacterNickname"]) || !empty($responseData["lchaCharacterNickname"])) { 
    $lchaCharacterNickname = $libString->strInsertDb($responseData["lchaCharacterNickname"]); 
} else { 
    $lchaCharacterNickname = ""; 
}

// pagination
if(isset($responseData["page"]) || !empty($responseData["page"])) { 
    $page = (int)$libString->strInsertDb($responseData["page"]); 
} else { 
    $page = 1; 
}

if(isset($responseData["limit"]) || !empty($responseData["limit"])) { 
    $limit = (int)$libString->strInsertDb($responseData["limit"]); 
} else { 
    $limit = 100; 
}

// ranking type
if(isset($responseData["rankingType"]) || !empty($responseData["rankingType"])) { 
    $rankingType = $libString->strInsertDb($responseData["rankingType"]); 
} else { 
    $rankingType = "DEAL"; // 기본값 
}

$offset = ($page - 1) * $limit;

$result = "";
$returnResult = Array();
$data = Array();

/* **********************************************************************************************************
 * database process
 * ******************************************************************************************************** */
try {
    switch ($atMode) {
        case "selectCharacterBest":
            try {
                // 캐릭터 최고 점수 조회
                if(!empty($lchaCharacterNickname)) {
                    $bindData = Array(TN_USE, $lchaCharacterNickname);
                    $characterBestData = $controllerLopecCharacter->selectLopecCharacterBest($bindData);
                    
                    if($characterBestData) {
                        $result = "S";
                        $data = $characterBestData;
                    } else {
                        $result = "F";
                    }
                } else {
                    $result = "F";
                }
            } catch (Exception $e) {
                $result = "E";
                // 로그 기록 등 오류 처리
            }
            break;
            
            case "selectRanking":
                try {
                    if($rankingType != "SUP" && $rankingType != "DEAL") {
                        $rankingType = "DEAL";
                    }
                    
                    $rankingData = $controllerLopecCharacter->selectLopecCharacterRanking($rankingType);
                    
                    if($rankingData) {
                        $result = "S";
                        $cleanData = array_map(function($row) {
                            return array(
                                'LCHB_CHARACTER_NICKNAME' => $row['LCHB_CHARACTER_NICKNAME'],
                                'LCHB_CHARACTER_CLASS' => $row['LCHB_CHARACTER_CLASS'],
                                'LCHB_TOTALSUM' => $row['LCHB_TOTALSUM'],
                                'RANKING_NUM' => $row['RANKING_NUM']
                            );
                        }, $rankingData);
                        $data = $cleanData;
                    } else {
                        $result = "F";
                    }
                } catch (Exception $e) {
                    $result = "E";
                }
                break;

        case "batchQueryCharacters":
            try {
                // 닉네임 파라미터 확인
                if (!isset($responseData["nicknames"]) || empty($responseData["nicknames"])) {
                    $result = "F";
                    $returnResult["error"] = "캐릭터 닉네임 목록이 필요합니다";
                    error_log("일괄 캐릭터 조회 실패: 닉네임 목록 누락");
                    break;
                }
                
                // 닉네임 파라미터 처리 (쉼표로 구분된 문자열)
                $nicknamesStr = $responseData["nicknames"];
                
                // 쉼표로 구분된 문자열을 배열로 변환
                $nicknames = explode(',', $nicknamesStr);
                
                // 닉네임 배열 유효성 검사
                if (empty($nicknames)) {
                    $result = "S"; // 성공으로 처리하되 빈 데이터 반환
                    $data = "";
                    error_log("일괄 캐릭터 조회: 유효한 닉네임이 없음");
                    break;
                }
                
                // 요청 개수 제한 (최대 20개)
                if (count($nicknames) > 20) {
                    $nicknames = array_slice($nicknames, 0, 20);
                    error_log("일괄 캐릭터 조회: 요청 개수 초과, 20개로 제한됨");
                }
                
                // 닉네임 배열 정제 (중복 제거 및 빈 값 필터링)
                $nicknames = array_values(array_filter(array_unique($nicknames), function($v) {
                    return !empty(trim($v));
                }));
                
                // 닉네임 배열이 비었는지 다시 확인
                if (empty($nicknames)) {
                    $result = "S"; // 성공으로 처리하되 빈 데이터 반환
                    $data = "";
                    error_log("일괄 캐릭터 조회: 정제 후 유효한 닉네임이 없음");
                    break;
                }
                
                // 컨트롤러 호출
                $bindData = array(TN_USE, $nicknames);
                $charactersData = $controllerLopecCharacter->batchSelectLopecCharacters($bindData);
                
                if ($charactersData && !empty($charactersData)) {
                    $result = "S";
                    
                    // 문자열 형식으로 응답 데이터 생성 (직업 정보 추가)
                    $responseStr = "";
                    foreach ($charactersData as $character) {
                        if (isset($character['LCHA_CHARACTER_NICKNAME'])) {
                            // 캐릭터 정보를 콜론(:)으로 구분하고, 각 캐릭터는 쉼표(,)로 구분
                            if (!empty($responseStr)) {
                                $responseStr .= ",";
                            }
                            $responseStr .= $character['LCHA_CHARACTER_NICKNAME'] . ":" .
                                           ($character['LCHA_LEVEL'] ?? "") . ":" .
                                           ($character['LCHA_CHARACTER_CLASS'] ?? "") . ":" .
                                           ($character['LCHA_TOTALSUM'] ?? "") . ":" .
                                           ($character['LCHA_TOTALSUMSUPPORT'] ?? "") . ":".
                                           ($character['REG_DATE'] ?? "");
                            
                            // 검색 카운트 증가 - 오류 발생하므로 주석 처리
                            // $hitBindData = array($character['LCHA_CHARACTER_NICKNAME']);
                            // $controllerLopecCharacter->updateLopecCharacterHit($hitBindData);
                        }
                    }
                    
                    $data = $responseStr; // 문자열 응답으로 설정
                    
                } else {
                    $result = "F";
                    $returnResult["error"] = "캐릭터 정보를 찾을 수 없습니다";
                    error_log("일괄 캐릭터 조회: 데이터 없음");
                }
            } catch (Exception $e) {
                $result = "E";
                error_log("일괄 캐릭터 조회 오류: " . $e->getMessage());
            }
            break;

        case "selectCharacterRanking":
            try {
                error_log("캐릭터 랭킹 요청: " . $lchaCharacterNickname);
                error_log("랭킹 타입: " . $rankingType);
                // 필수 파라미터 확인
                if(!empty($lchaCharacterNickname)) {
                    // 랭킹 타입에 따라 테이블 선택
                    if($rankingType == "SUP") {
                        $tableName = "LOPEC_CHARACTER_BEST_RANKING_SUP";
                    } else {
                        $tableName = "LOPEC_CHARACTER_BEST_RANKING_DEAL";
                    }
                    
                    $bindData = Array($lchaCharacterNickname, $tableName);
                    $rankingData = $controllerLopecCharacter->selectSingleCharacterRanking($bindData);
                    
                    if($rankingData) {
                        $result = "S";
                        $cleanData = array(
                            'LCHB_CHARACTER_NICKNAME' => $rankingData['LCHB_CHARACTER_NICKNAME'],
                            'LCHB_TOTALSUM' => $rankingData['LCHB_TOTALSUM'],
                            'RANKING_NUM' => $rankingData['RANKING_NUM']
                        );
                        $data = $cleanData;
                    } else {
                        $result = "F";
                        error_log("랭킹 정보 없음");
                    }
                } else {
                    $result = "F";
                    error_log("닉네임 없음");
                }
            } catch (Exception $e) {
                $result = "E";
                error_log("랭킹 조회 오류: " . $e->getMessage());
                // 로그 기록 등 오류 처리
            }
            break;
        case "selectClassRanking":
            try {
                // 랭킹 타입 검증
                if($rankingType != "SUP" && $rankingType != "DEAL") {
                    $rankingType = "DEAL";
                }
                
                // 기본 직업명 파라미터 처리
                $baseClass = isset($responseData["baseClass"]) ? 
                    $libString->strInsertDb($responseData["baseClass"]) : "";
                
                // 랭킹 데이터 조회
                $rankingData = $controllerLopecCharacter->selectClassRanking($rankingType, $baseClass);
                
                if($rankingData) {
                    $result = "S";
                    $data = $rankingData;
                } else {
                    $result = "F";
                }
            } catch (Exception $e) {
                $result = "E";
                error_log("클래스 랭킹 조회 오류: " . $e->getMessage());
            }
            break;
        case "selectOverallPercentile":
            try {
                // 필수 파라미터 검증
                if(empty($lchaCharacterNickname)) {
                    $result = "F";
                    $returnResult["error"] = "캐릭터 닉네임이 필요합니다";
                    error_log("전체 백분율 조회 실패: 캐릭터 닉네임 누락");
                    break;
                }
        
                // 랭킹 타입 검증 및 기본값 설정
                if($rankingType != "SUP" && $rankingType != "DEAL") {
                    $rankingType = "DEAL";
                }
                
                $percentileData = $controllerLopecCharacter->selectOverallRankingPercentile($lchaCharacterNickname, $rankingType);
                
                if($percentileData) {
                    $result = "S";
                    
                    // 필드명 변경에 따른 데이터 매핑 (클라이언트 호환성 유지)
                    if(isset($percentileData['PERCENTILE']) && !isset($percentileData['OVERALL_PERCENTILE'])) {
                        $percentileData['OVERALL_PERCENTILE'] = $percentileData['PERCENTILE'];
                    }
                    
                    // 랭킹 데이터 일관성 처리
                    if(isset($percentileData['RANKING_NUM']) && !isset($percentileData['OVERALL_RANK'])) {
                        $percentileData['OVERALL_RANK'] = $percentileData['RANKING_NUM'];
                    }
                    
                    $data = $percentileData;
                } else {
                    $result = "F";
                    $returnResult["error"] = "랭킹 데이터를 찾을 수 없습니다";
                    error_log("전체 백분율 조회 실패: 데이터 없음 - 캐릭터: " . $lchaCharacterNickname);
                }
            } catch (Exception $e) {
                $result = "E";
                error_log("전체 백분율 조회 오류: " . $e->getMessage());
            }
            break;
        case "selectCombinedCharacterData":
            try {
                // 필수 파라미터 검증
                if(empty($lchaCharacterNickname)) {
                    $result = "F";
                    $returnResult["error"] = "캐릭터 닉네임이 필요합니다";
                    error_log("통합 데이터 조회 실패: 캐릭터 닉네임 누락");
                    break;
                }
                
                // 랭킹 타입 검증 및 기본값 설정
                if($rankingType != "SUP" && $rankingType != "DEAL") {
                    $rankingType = "DEAL";
                }
                
                // 통합 데이터 조회
                $combinedData = $controllerLopecCharacter->selectCombinedCharacterData($lchaCharacterNickname, $rankingType);
                
                if($combinedData) {
                    $result = "S";
                    $data = $combinedData;
                } else {
                    $result = "F";
                    $returnResult["error"] = "캐릭터 데이터를 찾을 수 없습니다";
                    error_log("통합 데이터 조회 실패: 데이터 없음 - 캐릭터: " . $lchaCharacterNickname);
                }
            } catch (Exception $e) {
                $result = "E";
                error_log("통합 데이터 조회 오류: " . $e->getMessage());
            }
            break;
    }

    // process result
    if($result == "S") {
        $returnResult["result"] = "S";
        $returnResult["code"] = 1000;
        $returnResult["data"] = $data;
    } else if ($result == "F") {
        $returnResult["result"] = "F";
        $returnResult["code"] = -8888;
        $returnResult["error"] = "조회 실패";
    } else if ($result == "E") {
        $returnResult["result"] = "E";
        $returnResult["code"] = -9999;
        $returnResult["error"] = "조회 중 오류 발생";
    }

} catch (Exception $e) {
    $returnResult["result"] = "EXC";
    $returnResult["code"] = -9999;
    $returnResult["error"] = "error-exception";
}

$jsonResult = json_encode($returnResult);
// result print
print $jsonResult;
?>