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
 * file         : /applications/processs/lopecOcr
 * developer    : blackhiker
 * description  : OCR KEY process
 * ************************************************************************************************************************* */

/* ***************************************************************************************************************************
 * config / common include
 * ************************************************************************************************************************* */
include $_SERVER["DOCUMENT_ROOT"]."/applications/commons/common.comm.php";

// 컨트롤러와 모델 파일 include
include $_SERVER["DOCUMENT_ROOT"]."/applications/controllers/lopecOcr.php"; // 컨트롤러 파일 경로
include $_SERVER["DOCUMENT_ROOT"]."/applications/models/lopecOcr.php"; // 모델 파일 경로 

// 컨트롤러 객체 인스턴스화
$controllerLopecOcr = new controllerLopecOcr();
?>
<?php 
/* **********************************************************************************************************
 * json data response
 * ******************************************************************************************************** */
$responseData               =   $_REQUEST;

/* **********************************************************************************************************
 * common parameter / page parameter
 * ******************************************************************************************************** */
if(isset($responseData["atMode"]) || !empty($responseData["atMode"])) { $atMode = $libString->strInsertDb($responseData["atMode"]); } else { $atMode = ""; }    // action mode
if(isset($responseData["ocrKey"]) || !empty($responseData["ocrKey"])) { $ocrKey = $libString->strInsertDb($responseData["ocrKey"]); } else { $ocrKey = ""; }    // OCR Key

$regIp = $libVisit->getIp();
$regDate = $libDate->getToDateTime();

$result = "";
$returnResult   =   Array();

/* **********************************************************************************************************
 * database process
 * ******************************************************************************************************** */
try {
    
    switch ($atMode) {

        case "verifyKey" :   
            try {
                $bindData = Array($regIp, $regDate, $ocrKey);
                $result = $controllerLopecOcr->verifyOcrKey($bindData);
                //echo "process result  : ". $result ."\r\n";
            } catch (Exception $e) {
                $result = "E";
                $logMsg = " process.lopecOcr => verifyKey - try~catch error : ".$e." | ";
                die($e->getMessage());
            }
            // process result
            if($result == "S") {
                $returnResult["result"] = "prcS";
                $returnResult["code"] = 1000;
                $returnResult["message"] = "KEY 인증 성공";
            } else if ($result == "N") {
                $returnResult["result"] = "prcN";
                $returnResult["code"]  = -7777;
                $returnResult["message"]  = "잘못된 KEY 입니다";
            } else if ($result == "A") {
                $returnResult["result"] = "prcA";
                $returnResult["code"]  = -6666;
                $returnResult["message"]  = "이미 이 IP에 등록된 KEY가 있습니다";
            } else if ($result == "D") {
                $returnResult["result"] = "prcD";
                $returnResult["code"]  = -5555;
                $returnResult["message"]  = "다른 IP에서 이미 사용 중인 KEY입니다";
            } else if ($result == "F") {
                $returnResult["result"] = "prcF";
                $returnResult["code"]  = -8888;
                $returnResult["message"]  = "KEY 인증 실패";
            } else if ($result == "E") {
                $returnResult["result"] = "prcE";
                $returnResult["code"]  = -9999;
                $returnResult["message"]  = "KEY 인증 오류";
            }
        break;
        
        case "useCoin" :   
            try {
                $bindData = Array($regIp);
                $result      =   $controllerLopecOcr->useOcrCoin($bindData);
                //echo "process result  : ". $result ."\r\n";
            } catch (Exception $e) {
                $result = "E";
                $logMsg = " process.lopecOcr => useCoin - try~catch error : ".$e." | ";
                die($e->getMessage());
            }
            // process result
            if(is_array($result) && $result[0] == "S") {
                $returnResult["result"] = "prcS";
                $returnResult["code"] = 1000;
                $returnResult["coin"] = $result[1];
                $returnResult["message"] = "코인 사용 성공";
            } else if(is_array($result) && $result[0] == "Z") {
                $returnResult["result"] = "prcZ";
                $returnResult["code"] = -6666;
                $returnResult["coin"] = 0;
                $returnResult["message"] = "남은 코인이 없습니다";
            } else if ($result == "N") {
                $returnResult["result"] = "prcN";
                $returnResult["code"]  = -7777;
                $returnResult["message"]  = "등록된 KEY가 없습니다";
            } else if ($result == "F") {
                $returnResult["result"] = "prcF";
                $returnResult["code"]  = -8888;
                $returnResult["message"]  = "코인 사용 실패";
            } else if ($result == "E") {
                $returnResult["result"] = "prcE";
                $returnResult["code"]  = -9999;
                $returnResult["message"]  = "코인 사용 오류";
            }
        break;
        
        case "checkCoin" :   
            try {
                $bindData = Array($regIp);
                $result      =   $controllerLopecOcr->checkOcrCoin($bindData);
                //echo "process result  : ". $result ."\r\n";
            } catch (Exception $e) {
                $result = "E";
                $logMsg = " process.lopecOcr => checkCoin - try~catch error : ".$e." | ";
                die($e->getMessage());
            }
            // process result
            if(is_array($result) && $result[0] == "S") {
                $returnResult["result"] = "prcS";
                $returnResult["code"] = 1000;
                $returnResult["coin"] = $result[1];
                $returnResult["message"] = "코인 조회 성공";
            } else if ($result == "N") {
                $returnResult["result"] = "prcN";
                $returnResult["code"]  = -7777;
                $returnResult["message"]  = "등록된 KEY가 없습니다";
            } else if ($result == "E") {
                $returnResult["result"] = "prcE";
                $returnResult["code"]  = -9999;
                $returnResult["message"]  = "코인 조회 오류";
            }
        break;
        
        case "checkIp" :   
            try {
                $bindData = Array($regIp);
                $result = $controllerLopecOcr->checkOcrCoin($bindData);
            } catch (Exception $e) {
                $result = "E";
                $logMsg = " process.lopecOcr => checkIp - try~catch error : ".$e." | ";
                die($e->getMessage());
            }
            
            if(is_array($result) && $result[0] == "S") {
                $returnResult["result"] = "prcS";
                $returnResult["code"] = 1000;
                $returnResult["coin"] = $result[1];
                $returnResult["message"] = "등록된 IP입니다";
                $returnResult["registered"] = true;
            } else {
                $returnResult["result"] = "prcN";
                $returnResult["code"]  = -7777;
                $returnResult["message"]  = "등록되지 않은 IP입니다";
                $returnResult["registered"] = false;
            }
        break;
        
    }

} catch (Exception $e) {

    $returnResult["result"] = "EXC";
    $returnResult["code"]  = -9999;
    $returnResult["error"]  = "error-exception-db process";

}

$jsonResult = json_encode($returnResult);
// result print
print $jsonResult;
?>