<?php
/* ***************************************************************************************************************************
 * session check
 * ************************************************************************************************************************* */
//include $_SERVER["DOCUMENT_ROOT"]."/applications/sessions/session.sys.php";

session_start();
// session_cache_limiter("private");
// session_cache_expire(480); // 60 * 8 = 480 / 8시간
// ini_set("session.cookie_lifetime", 28800);	// 60 * 60 * 8 = 28800 / 8시간
// ini_set("session.cache_expire", 28800);
// ini_set("session.gc_maxlifetime", 28800);
header("Content-Type: text/json; charset=utf-8");
if (!preg_match("/".$_SERVER['HTTP_HOST']."/i", $_SERVER['HTTP_REFERER'])) {
	exit("Direct Access not Allowed!");
}
/* ***************************************************************************************************************************
 * file 		: /applications/processs/lpecCharacter
 * developer 	: blackhiker
 * description 	: lpecCharacter  process
 * ************************************************************************************************************************* */

/* ***************************************************************************************************************************
 * config / common include
 * ************************************************************************************************************************* */
include $_SERVER["DOCUMENT_ROOT"]."/applications/commons/common.comm.php";
?>
<?php 
/* **********************************************************************************************************
 * json data response
 * ******************************************************************************************************** */
$responseData 				= 	$_REQUEST;

/* **********************************************************************************************************
 * common parameter
 * ******************************************************************************************************** */
if(isset($responseData["atMode"]) || !empty($responseData["atMode"])) { $atMode = $libString->strInsertDb($responseData["atMode"]); } else { $atMode = ""; }	// action mode
// if(isset($responseData["regCd"]) || !empty($responseData["regCd"])) { $regCd = $libString->strInsertDb($responseData["regCd"]); } else { $regCd = ""; }	// 등록자내부번호
// if(isset($responseData["regId"]) || !empty($responseData["regId"])) { $regId = $libString->strInsertDb($responseData["regId"]); } else { $regId = ""; }	// 등록자아이디
// if(isset($responseData["regName"]) || !empty($responseData["regName"])) { $regName = $libString->strInsertDb($responseData["regName"]); } else { $regName = ""; }	// 등록자이름
$regCd 					=	"lopec1234567890";
$regId 					=	"lopec";
$regName				=	"로펙";
$regIp					=	$libVisit->getIp();
$regDate				=	$libDate->getToDateTime();

// echo " atMode =====> ". $atMode;

/* **********************************************************************************************************
 * page parameter
 * ******************************************************************************************************** */
// character info
if(isset($responseData["lchaCd"]) || !empty($responseData["lchaCd"])) { $lchaCd = $libString->strInsertDb($responseData["lchaCd"]); } else { $lchaCd  = ""; }
if(isset($responseData["lchaCharacterNickname"]) || !empty($responseData["lchaCharacterNickname"])) { $lchaCharacterNickname = $libString->strInsertDb($responseData["lchaCharacterNickname"]); } else { $lchaCharacterNickname  = ""; }
if(isset($responseData["lchaCharacterLevel"]) || !empty($responseData["lchaCharacterLevel"])) { $lchaCharacterLevel = $libString->strInsertDb($responseData["lchaCharacterLevel"]); } else { $lchaCharacterLevel  = ""; }
if(isset($responseData["lchaCharacterClass"]) || !empty($responseData["lchaCharacterClass"])) { $lchaCharacterClass = $libString->strInsertDb($responseData["lchaCharacterClass"]); } else { $lchaCharacterClass  = ""; }
if(isset($responseData["lchaCharacterImage"]) || !empty($responseData["lchaCharacterImage"])) { $lchaCharacterImage = $libString->strInsertDb($responseData["lchaCharacterImage"]); } else { $lchaCharacterImage  = ""; }
if(isset($responseData["lchaServer"]) || !empty($responseData["lchaServer"])) { $lchaServer = $libString->strInsertDb($responseData["lchaServer"]); } else { $lchaServer  = ""; }
if(isset($responseData["lchaLevel"]) || !empty($responseData["lchaLevel"])) { $lchaLevel = $libString->strInsertDb($responseData["lchaLevel"]); } else { $lchaLevel  = ""; }
$lchaLevel = str_replace(",", "", $lchaLevel);
if(isset($responseData["lchaGuild"]) || !empty($responseData["lchaGuild"])) { $lchaGuild = $libString->strInsertDb($responseData["lchaGuild"]); } else { $lchaGuild  = ""; }
if(isset($responseData["lchaTitle"]) || !empty($responseData["lchaTitle"])) { $lchaTitle = $libString->strInsertDb($responseData["lchaTitle"]); } else { $lchaTitle  = ""; }
if(isset($responseData["lchaTotalsum"]) || !empty($responseData["lchaTotalsum"])) { $lchaTotalsum = $libString->strInsertDb($responseData["lchaTotalsum"]); } else { $lchaTotalsum = ""; }
if(isset($responseData["lchaTotalsumSupport"]) || !empty($responseData["lchaTotalsumSupport"])) { $lchaTotalsumSupport = $libString->strInsertDb($responseData["lchaTotalsumSupport"]); } else { $lchaTotalsumSupport = ""; }
if(isset($responseData["lchaAlltimebuff"]) || !empty($responseData["lchaAlltimebuff"])) { $lchaAlltimebuff = $libString->strInsertDb($responseData["lchaAlltimebuff"]); } else { $lchaAlltimebuff = ""; }
if(isset($responseData["lchaFullbuff"]) || !empty($responseData["lchaFullbuff"])) { $lchaFullbuff = $libString->strInsertDb($responseData["lchaFullbuff"]); } else { $lchaFullbuff = ""; }
if(isset($responseData["lchaVersion"]) || !empty($responseData["lchaVersion"])) { $lchaVersion = $libString->strInsertDb($responseData["lchaVersion"]); } else { $lchaVersion = ""; }
if(isset($responseData["lchaSearchHit"]) || !empty($responseData["lchaSearchHit"])) { $lchaSearchHit = $libString->strInsertDb($responseData["lchaSearchHit"]); } else { $lchaSearchHit  = ""; }
if(empty($lchaSearchHit) || $lchaSearchHit == "") {
	$lchaSearchHit = 0;
}
$lchaUseragent = $_SERVER['HTTP_USER_AGENT'];	// $libVisit->getUserAgent();
$result = "";
$returnResult	=	Array();

/* **********************************************************************************************************
 * database process
 * ******************************************************************************************************** */
try {
	
	switch ($atMode) {

		case "insertCharacter" :	 
			try {
				// 캐릭터 명으로 조회
				$lchaCharacterNickname = trim($lchaCharacterNickname);
				$selectBindData = Array(TN_USE, $lchaCharacterNickname);
				$characerData = $controllerLopecCharacter->selectLopecCharacterNickname($selectBindData);
				if($characerData) {	// 캐릭터 존재
// 					echo " insertCharacter character 111 ";
					// LOPEC_CHARACTER select - LOPEC_CHARACTER_BACK insert					
					// LOPEC_CHARACTER delete
					$drpData 	=	Array($lchaCharacterNickname);
					// LOPEC_CHARACTER insert
					$lchaCd 	=	$libString->getCode("LCHA");
					$insData	=	Array($lchaCd, $lchaCharacterNickname, $lchaCharacterLevel, $lchaCharacterClass, $lchaCharacterImage
											, $lchaServer, $lchaLevel, $lchaGuild, $lchaTitle, $lchaTotalsum, $lchaTotalsumSupport
											, $lchaAlltimebuff, $lchaFullbuff, $lchaVersion, $lchaSearchHit, $lchaUseragent
											, TN_USE, $regCd, $regId, $regIp, $regCd, $regId, $regIp);
					$result = $controllerLopecCharacter->insertLopecCharacterDelNew($lchaCharacterNickname, $drpData, $insData);
				} else {	// 캐릭터 미존재
// 					echo " insertCharacter character 222 ";
					$lchaCd 	=	$libString->getCode("LCHA");
					$bindData	=	Array($lchaCd, $lchaCharacterNickname, $lchaCharacterLevel, $lchaCharacterClass, $lchaCharacterImage
											, $lchaServer, $lchaLevel, $lchaGuild, $lchaTitle, $lchaTotalsum, $lchaTotalsumSupport
											, $lchaAlltimebuff, $lchaFullbuff, $lchaVersion, $lchaSearchHit, $lchaUseragent
											, TN_USE, $regCd, $regId, $regIp, $regCd, $regId, $regIp);
					$result = $controllerLopecCharacter->insertLopecCharacter($bindData);
				}

				if($result == "S") {
					// 딜러 점수 처리
					$bestScoreResult = $controllerLopecCharacter->processBestScore(
						$lchaCharacterNickname,
						$lchaCharacterClass,
						$lchaLevel,
						$lchaServer,
						$lchaTotalsum
					);

					// 서폿 점수 처리
					$bestSupportScoreResult = $controllerLopecCharacter->processBestScoreSupport(
						$lchaCharacterNickname,
						$lchaCharacterClass,
						$lchaLevel,
						$lchaServer,
						$lchaTotalsumSupport
					);
					$result = "S";
				}

			} catch (Exception $e) {
				$result = "E";
				$logMsg = " process.as => insertOrder - try~catch error : ".$e." | ";
				die($e->getMessage());
			}
			// process result
			if($result == "S") {
				$returnResult["result"] = "prcS";
				$returnResult["code"] = 1000;
			} else if ($result == "F") {
				$returnResult["result"] = "prcF";
				$returnResult["code"] 	= -8888;
				$returnResult["error"] 	= "common-process-fail";
			} else if ($result == "E") {
				$returnResult["result"] = "prcE";
				$returnResult["code"] 	= -9999;
				$returnResult["error"] 	= "common-process-exception";
			}
		break;
	}

} catch (Exception $e) {

	$returnResult["result"] = "EXC";
	$returnResult["code"] 	= -9999;
	$returnResult["error"] 	= "error-exception-db process";

}

$jsonResult	= json_encode($returnResult);
// result print
print $jsonResult;
?>