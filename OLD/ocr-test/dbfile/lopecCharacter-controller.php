<?php 
/* ****************************************************************************************************
 * file name	: 	/applications/controllers/board.php
 * developer 	: 	blackhiker
 * description 	: 	BAS_BOARD controller
 **************************************************************************************************** */
?>
<?php 
/* **********************************************************************************************************************
 * class name			:	controllerBrdFile
 * description			: 	BAS_BOARD controller 관련 class
 ********************************************************************************************************************** */
class controllerLopecCharacter extends coreProcess {
	
	/* **********************************************************************************************************************
	 * function name		:	listLopecCharacter
	 * description			: 	BAS_BOARD  목록 LIST /
	 * @param				:	$bindData		Array 	-	사용삭제여부 	메뉴구분	PC/MOBILE구분	상위대메뉴	상위중메뉴
	 * @param				:	$divLopecCharacter		메뉴구분
	 * @return				: 	$retResult		array data
	 ********************************************************************************************************************** */
	function listLopecCharacter($schKind = "", $bindData = "", $listNum = "", $page = "") {
		try {
			//echo " listLopecCharacter ==> listNum ==> ". $listNum ."<br>";
			//echo " listLopecCharacter ==> page ==> ". $page ."<br>";
			// 			$schKind, $bindData, $listNum, $page
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$libPaging	= 	new pagingLib();
			// total count
			$totalQuery			=	$modelLopecCharacter->totalCountLopecCharacter($schKind, $bindData);
			//echo " listLopecCharacter ==> totalQuery ==> ". $totalQuery ."<br>";
			$totalCount			= 	$this->selectOneBindPdo($totalQuery, $bindData);
			//echo " listLopecCharacter ==> totalCount ==> ". $totalCount ."<br>";
			$pageCount 			=	$libPaging->displayPageCount($totalCount, $listNum, $page);
			$curNum				= 	$libPaging->listCurNum($totalCount, $listNum, $page);
			// start num
			$offSet				=	$libPaging->listOffset($listNum, $page);
			//echo " listLopecCharacter ==> offSet ==> ". $offSet ."<br>";
			$startNumQuery		=	$modelLopecCharacter->startNumLopecCharacter($schKind, $bindData, $offSet);
			//echo " listLopecCharacter ==> startNumQuery ==> ". $startNumQuery ."<br>";
			$startNum			=	$this->selectOneBindPdo($startNumQuery, $bindData);
			//echo " listLopecCharacter ==> startNum ==> ". $startNum ."<br>";
			$listQuery			=	$modelLopecCharacter->listLopecCharacter($schKind, $bindData, $startNum, $listNum);
			//echo " listLopecCharacter ==> listQuery ==> ". $listQuery ."<br>";
			$listData			= 	$this->selectListBindPdo($listQuery, $bindData);
			$returnResult		=	Array($totalCount, $pageCount, $curNum, $listData);
		} catch (Exception $e) {
			$returnResult = "EE";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerCategory => marketList - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $returnResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	allListLopecCharacter
	 * description			: 	BAS_BOARD 목록
	 * @param				:	$bindData		Array(TN_USE)
	 * @return				: 	$retResult		array data
	 ********************************************************************************************************************** */
	function allListLopecCharacter($bindData = "") {
		try {
			$modelLopecCharacter		= 	new modelLopecCharacter();
			$query			=	$modelLopecCharacter->allListLopecCharacter($bindData);
			//echo "allListLopecCharacter query : ". $query ."\r\n";
			$retResult		= 	$this->selectListBindPdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "EE";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerUser => listLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	selectLopecCharacter
	 * description			: 	BAS_BOARD select
	 * @param				:	$bindData		Array(TN_USE)
	 * @return				: 	$retResult		array data
	 ********************************************************************************************************************** */
	function selectLopecCharacter($bindData = "") {
		try {
			// basic 
			$modelLopecCharacter		= 	new modelLopecCharacter();
			$query		=	$modelLopecCharacter->selectLopecCharacter();
			$retResult	= 	$this->selectViewBindPdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "EE";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerUser => selectLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	} // 
	
	/* **********************************************************************************************************************
	 * function name		:	selectLopecCharacterNickname
	 * description			: 	BAS_BOARD select
	 * @param				:	$bindData		Array(TN_USE)
	 * @return				: 	$retResult		array data
	 ********************************************************************************************************************** */
	function selectLopecCharacterNickname($bindData = "") {
		try {
			// basic
			$modelLopecCharacter		= 	new modelLopecCharacter();
			$query		=	$modelLopecCharacter->selectLopecCharacterNickname($bindData);
			//echo $query;
			$retResult	= 	$this->selectViewBindPdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "EE";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerUser => selectLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}

	/* **********************************************************************************************************************
	 * function name		:	insertLopecCharacter
	 * description			: 	BAS_BOARD BAS_BOARD_FILE insert
	 * @param				:	$bindData		입력 데이터
	 * @return				: 	$retResult		S / F
	 ********************************************************************************************************************** */
	function insertLopecCharacter($bindData = "") {
		try {
			// query
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$query				= 	$modelLopecCharacter->insertLopecCharacter();
			$retResult 		=	$this->processUpdatePdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => updateLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	insertLopecCharacter
	 * description			: 	LOPEC_CHARACTER select - LOPEC_CHARACTER_BACK insert
	 * @param				:	$bindData		입력 데이터
	 * @return				: 	$retResult		S / F
	 ********************************************************************************************************************** */
	function insertLopecCharacterBack($nickName = "") {
		try {
			// query
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$query				= 	$modelLopecCharacter->insertLopecCharacterBack($nickName);
			//echo "deleteLopecCharacter query : ". $query ."\r\n";
			$retResult 		=	$this->processQueryPdo($query);
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => insertLopecCharacterBack - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	insertLopecCharacterDelNew
	 * description			: 	LOPEC_CHARACTER delete 후 insert
	 * @param				:	$bindData			입력 데이터
	 * @return				: 	$retResult			S / F
	 ********************************************************************************************************************** */
	function insertLopecCharacterDelNew($nickName = "", $drpData = "", $insData = "") {
		try {
			// query
			$modelLopecCharacter = new modelLopecCharacter();
			$selinsQuery = $modelLopecCharacter->insertLopecCharacterBack($nickName);
			$drpQuery = $modelLopecCharacter->dropLopecCharacter();
			$insQuery = $modelLopecCharacter->insertLopecCharacter();
// 			echo " insertLopecCharacterDelNew selinsQuery ===> ".$selinsQuery."\r\n";
// 			echo " insertLopecCharacterDelNew drpQuery ===> ".$drpQuery."\r\n";
// 			echo " insertLopecCharacterDelNew insQuery ===> ".$insQuery."\r\n";
			// conn & transaction
			$conn = $this->transactionStartPdo();
			// LOPEC_CHARACTER select - LOPEC_CHARACTER_BACK insert
			if($nickName == "" || empty($nickName)) {
				$selinsResult = "F";
			} else {
				$selinsResult = $this->transactionQueryPdo($conn, $selinsQuery);
			}
			// LOPEC_CHARACTER drop
			if($drpData == "" || empty($drpData)) {
				$drpResult = "F";
			} else {
				$drpResult = $this->transactionDeletePdo($conn, $drpQuery, $drpData);
			}
			usleep(200000);
			// LOPEC_CHARACTER insert
			if($insData == "" || empty($insData)) {
				$insResult = "F";
			} else {
				$insResult = $this->transactionInsertPdo($conn, $insQuery, $insData);
			}
// 			echo " insertLopecCharacterDelNew selinsResult ===> ".$selinsResult."\r\n";
// 			echo " insertLopecCharacterDelNew drpResult ===> ".$drpResult."\r\n";
// 			echo " insertLopecCharacterDelNew insResult ===> ".$insResult."\r\n";
			// result - commit or rollback
			if($selinsResult == "S" && $drpResult == "S" && $insResult == "S") {
				$this->transactionCommitPdo($conn);
				$retResult = "S";
			} else {
				$this->transactionRollbackPdo($conn);
				$retResult = "F";
			}
			// db conneciton close
			$this->dbDisconnectionPdo();
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecMain => insertLopecMainDelNew - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
		
	/* **********************************************************************************************************************
	 * function name    : processBestScore
	 * description     : 최고 점수 처리 (현재/백업/베스트 테이블의 점수를 비교하여 최고 점수 저장)
	 * @param          : $nickName          캐릭터 닉네임
	 * @param          : $characterClass    캐릭터 클래스
	 * @param          : $level            레벨
	 * @param          : $server           서버
	 * @param          : $currentScore     현재 점수
	 * @return         : $retResult        S / F / E
	 ********************************************************************************************************************** */
	function processBestScore($nickName = "", $characterClass = "", $level = "", $server = "", $currentScore = "") {
	    try {
	        // 전역 변수 사용 선언
	        global $libString;

	        $modelLopecCharacter = new modelLopecCharacter();
		
	        // 1. BACK 테이블에서 최고 점수 조회
	        $backScoreQuery = $modelLopecCharacter->selectBackMaxScore();
	        $backScoreData = $this->selectOneBindPdo($backScoreQuery, array($nickName, TN_USE));
	        $backMaxScore = $backScoreData ? $backScoreData['CNT'] : 0;
		
	        // 2. BEST 테이블에서 저장된 최고 점수 조회
	        $bestScoreQuery = $modelLopecCharacter->selectBestScore();
	        $bestScoreData = $this->selectOneBindPdo($bestScoreQuery, array($nickName, TN_USE));
	        $bestScore = $bestScoreData ? $bestScoreData['CNT'] : 0;

	        // 3. 세 점수 비교하여 최고 점수 결정
	        $maxScore = max($currentScore, $backMaxScore, $bestScore);
		
	        // 4. 최고 점수가 갱신되었거나 BEST 테이블에 데이터가 없는 경우
	        if ($maxScore > $bestScore || !$bestScoreData) {
	            // BEST 테이블의 내부 번호 생성
	            $lchbCd = $libString->getCode("LCHB");
	            // 바인딩할 데이터 준비
	            $bindData = array(
	                $lchbCd,             // LCHB_CD
	                $nickName,           // LCHB_CHARACTER_NICKNAME
	                $characterClass,     // LCHB_CHARACTER_CLASS
					$server,			// LCHB_SERVER
	                $level,             // LCHB_LEVEL
	                $maxScore,          // LCHB_TOTALSUM
	                TN_USE,             // USE_TN
	                $this->regCd,       // REG_CD
	                $this->regId,       // REG_ID
	                $this->regIp        // REG_IP
	            );
			
	            // BEST 테이블에 저장/갱신
	            $query = $modelLopecCharacter->insertOrUpdateBestScore();
	            $retResult = $this->processUpdatePdo($query, $bindData);
	        } else {
	            // 최고 점수가 갱신되지 않아도 성공으로 처리
	            $retResult = "S";
	        }
		
	    } catch (Exception $e) {
	        $retResult = "E";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => processBestScore - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}

	/* **********************************************************************************************************************
	 * function name    : processBestScoreSupport
	 * description     : 서폿 최고 점수 처리 (현재/백업/베스트 테이블의 서폿폿 점수를 비교하여 최고 점수 저장)
	 * @param          : $nickName          캐릭터 닉네임
	 * @param          : $characterClass    캐릭터 클래스
	 * @param          : $level            레벨
	 * @param          : $server           서버
	 * @param          : $currentScore     현재 서폿폿 점수
	 * @return         : $retResult        S / F / E
	 ********************************************************************************************************************** */
	function processBestScoreSupport($nickName = "", $characterClass = "", $level = "", $server = "", $currentScore = "") {
	    try {
	        // 전역 변수 사용 선언
	        global $libString;

	        $modelLopecCharacter = new modelLopecCharacter();
		
	        // 1. BACK 테이블에서 최고 서포트 점수 조회
	        $backScoreQuery = $modelLopecCharacter->selectBackMaxScoreSupport();
	        $backScoreData = $this->selectOneBindPdo($backScoreQuery, array($nickName, TN_USE));
	        $backMaxScore = $backScoreData ? $backScoreData['CNT'] : 0;
		
	        // 2. BEST 테이블에서 저장된 최고 서포트 점수 조회
	        $bestScoreQuery = $modelLopecCharacter->selectBestScoreSupport();
	        $bestScoreData = $this->selectOneBindPdo($bestScoreQuery, array($nickName, TN_USE));
	        $bestScore = $bestScoreData ? $bestScoreData['CNT'] : 0;

	        // 3. 세 점수 비교하여 최고 점수 결정
	        $maxScore = max($currentScore, $backMaxScore, $bestScore);
		
	        // 4. 최고 점수가 갱신되었거나 BEST 테이블에 데이터가 없는 경우
	        if ($maxScore > $bestScore || !$bestScoreData) {
	            // BEST 테이블의 내부 번호 생성
	            $lchbCd = $libString->getCode("LCHB");
	            // 바인딩할 데이터 준비
	            $bindData = array(
	                $lchbCd,             // LCHB_CD
	                $nickName,           // LCHB_CHARACTER_NICKNAME
	                $characterClass,     // LCHB_CHARACTER_CLASS
					$server,			// LCHB_SERVER
	                $level,             // LCHB_LEVEL
	                $maxScore,          // LCHB_TOTALSUMSUPPORT
	                TN_USE,             // USE_TN
	                $this->regCd,       // REG_CD
	                $this->regId,       // REG_ID
	                $this->regIp        // REG_IP
	            );
			
	            // BEST 테이블에 저장/갱신
	            $query = $modelLopecCharacter->insertOrUpdateBestScoreSupport();
	            $retResult = $this->processUpdatePdo($query, $bindData);
	        } else {
	            // 최고 점수가 갱신되지 않아도 성공으로 처리
	            $retResult = "S";
	        }
		
	    } catch (Exception $e) {
	        $retResult = "E";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => processBestScoreSupport - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}





	/* **********************************************************************************************************************
	 * function name    : selectLopecCharacterBest
	 * description     : LOPEC_CHARACTER_BEST에서 캐릭터 최고 점수 정보 조회
	 * @param          : $bindData    Array(TN_USE, 캐릭터닉네임)
	 * @return         : $retResult   array data
	 ********************************************************************************************************************** */
	function selectLopecCharacterBest($bindData = "") {
	    try {
	        // basic
	        $modelLopecCharacter = new modelLopecCharacter();
	        $query = $modelLopecCharacter->selectLopecCharacterBest();
	        $retResult = $this->selectViewBindPdo($query, $bindData);
	    } catch (Exception $e) {
	        $retResult = "EE";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => selectLopecCharacterBest - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name    : selectLopecCharacterRanking
	 * description     : LOPEC_CHARACTER_BEST_RANKING_DEAL/SUP에서 랭킹 정보 조회
	 * @param          : $rankingType 랭킹 타입 (DEAL/SUP)
	 * @param          : $bindData    Array(조회수, 시작번호)
	 * @return         : $retResult   array data
	 ********************************************************************************************************************** */
	function selectLopecCharacterRanking($rankingType = "DEAL") {
	    try {
	        $modelLopecCharacter = new modelLopecCharacter();
		
	        if ($rankingType == "SUP") {
	            $query = $modelLopecCharacter->selectLopecCharacterRankingSup();
	        } else {
	            $query = $modelLopecCharacter->selectLopecCharacterRankingDeal();
	        }
		
	        $retResult = $this->selectListBindPdo($query, array());
	    } catch (Exception $e) {
	        $retResult = "EE";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => selectLopecCharacterRanking - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}


	/* **********************************************************************************************************************
	 * function name    : selectSingleCharacterRanking
	 * description     : 특정 캐릭터의 랭킹 정보 조회
	 * @param          : $bindData    Array(캐릭터닉네임, 테이블명)
	 * @return         : $retResult   array data
	 ********************************************************************************************************************** */
	function selectSingleCharacterRanking($bindData = "") {
	    try {
	        // basic
	        $modelLopecCharacter = new modelLopecCharacter();
	        $tableName = $bindData[1];
		
	        if ($tableName == "LOPEC_CHARACTER_BEST_RANKING_SUP") {
	            $query = $modelLopecCharacter->selectSingleCharacterRankingSup();
	        } else {
	            $query = $modelLopecCharacter->selectSingleCharacterRankingDeal();
	        }
		
	        // bindData에서 테이블명 제거하고 사용
	        $execBindData = array($bindData[0]);
	        $retResult = $this->selectViewBindPdo($query, $execBindData);
	    } catch (Exception $e) {
	        $retResult = "EE";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => selectSingleCharacterRanking - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}


	/* **********************************************************************************************************************
	 * function name    : selectOverallRankingPercentile
	 * description     : 전체 랭킹에서의 백분율 정보 조회 (DEAL/SUP)
	 * @param          : $characterNickname    String    - 캐릭터 닉네임
	 * @param          : $rankingType         String    - 랭킹 타입 (DEAL/SUP)
	 * @return         : $retResult           Array     - 랭킹 데이터
	 ********************************************************************************************************************** */
	function selectOverallRankingPercentile($characterNickname = "", $rankingType = "DEAL") {
	    try {
	        if (empty($characterNickname)) {
	            return null;
	        }

	        $modelLopecCharacter = new modelLopecCharacter();
	        $bindData = array($characterNickname);
		
	        // 랭킹 타입에 따른 쿼리 선택
	        $query = ($rankingType == "SUP") ? 
	            $modelLopecCharacter->selectOverallRankingPercentileSup() : 
	            $modelLopecCharacter->selectOverallRankingPercentile();
		
	        // 백분율 정보 조회
	        $retResult = $this->selectViewBindPdo($query, $bindData);
		
	    } catch (Exception $e) {
	        $retResult = "EE";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => selectOverallRankingPercentile - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}

	/* **********************************************************************************************************************
	 * function name    : selectClassRanking
	 * description     : 직업별 랭킹 정보 조회 (DEAL/SUP)
	 * @param          : $rankingType    String    - 랭킹 타입 (DEAL/SUP)
	 * @param          : $baseClass      String    - 조회할 직업명 (선택적)
	 * @return         : $retResult      Array     - 랭킹 데이터 배열
	 ********************************************************************************************************************** */
	function selectClassRanking($rankingType = "DEAL", $baseClass = "") {
	    try {
	        // 기본 객체 생성
	        $modelLopecCharacter = new modelLopecCharacter();
	        $bindData = array();
		
	        // 특정 직업 조회 시 바인딩 데이터 추가
	        if (!empty($baseClass)) {
	            $bindData[] = $baseClass;
	        }
		
	        // 랭킹 타입에 따른 쿼리 선택
	        if ($rankingType == "SUP") {
	            $query = $modelLopecCharacter->selectClassRankingSup();
	        } else {
	            $query = $modelLopecCharacter->selectClassRankingDeal();
	        }
		
	        // 쿼리 실행 및 결과 반환
	        $retResult = $this->selectListBindPdo($query, $bindData);
		
	    } catch (Exception $e) {
	        $retResult = "EE";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => selectClassRanking - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}

	/* **********************************************************************************************************************
	 * function name    : selectCharacterClassRanking
	 * description     : 특정 캐릭터의 직업 내 랭킹 정보 조회
	 * @param          : $rankingType            String    - 랭킹 타입 (DEAL/SUP)
	 * @param          : $characterNickname      String    - 캐릭터 닉네임
	 * @return         : $retResult              Array     - 랭킹 데이터
	 ********************************************************************************************************************** */
	function selectCharacterClassRanking($rankingType = "DEAL", $characterNickname = "") {
	    try {
	        if (empty($characterNickname)) {
	            return null;
	        }

	        // 기본 객체 생성
	        $modelLopecCharacter = new modelLopecCharacter();
	        $bindData = array($characterNickname);
		
	        // 랭킹 타입에 따른 쿼리 선택
	        if ($rankingType == "SUP") {
	            $query = $modelLopecCharacter->selectCharacterClassRankingSup();
	        } else {
	            $query = $modelLopecCharacter->selectCharacterClassRankingDeal();
	        }
		
	        // 쿼리 실행 및 결과 반환
	        $retResult = $this->selectViewBindPdo($query, $bindData);
		
	    } catch (Exception $e) {
	        $retResult = "EE";
	        $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => selectCharacterClassRanking - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retResult;
	}



	/* **********************************************************************************************************************
	 * function name		:	updateLopecCharacter
	 * description			: 	BAS_BOARD update
	 * @param				:	$bindData		입력 데이터
	 * @return				: 	$retResult		S / F
	 ********************************************************************************************************************** */
	function updateLopecCharacter($bindData = "") {
		try {
			// query
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$query				= 	$modelLopecCharacter->updateLopecCharacter();
			//echo "deleteLopecCharacter query : ". $query ."\r\n";
			$retResult 		=	$this->processUpdatePdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => updateLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	deleteLopecCharacter
	 * description			: 	BAS_BOARD delete
	 * @param				:	$bindData			입력 데이터
	 * @return				: 	$retResult			S / F
	 ********************************************************************************************************************** */
	function deleteLopecCharacter($boardData = "", $fileData = "") {
		try {
			$conn			=	"";
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$modelBrdFile	= 	new modelBrdFile();
			// conn & transaction
			$conn = $this->transactionStartPdo();
			// BAS_BOARD UPDATE
			if($boardData == "" || empty($boardData)) {
				$boardResult		=	"F";
			} else {
				$boardQuery 		= 	$modelLopecCharacter->deleteLopecCharacter();
				//print_r( $boardData );
				//echo $boardQuery;
				// result
				$boardResult	 	=	$this->transactionDeletePdo($conn, $boardQuery, $boardData);
			}
			// BAS_BOARD_FILE UPDATE
			if($fileData == "" || empty($fileData)) {
				$fileResult		=	"S";
			} else {
				$fileQuery		=	$modelBrdFile->deleteBrdFileBrdCd();
				//print_r( $fileData );
				//echo $fileQuery;
				// result
				$fileResult	 	=	$this->transactionDeletePdo($conn, $fileQuery, $fileData);
			}
			//echo " boardResult ===> ".$boardResult."\r\n";
			//echo " fileResult ===> ".$fileResult."\r\n";
			// result - commit or rollback
			if($boardResult == "S" && $fileResult == "S") {
				$this->transactionCommitPdo($conn);
				$retResult = "S";
			} else {
				$this->transactionRollbackPdo($conn);
				$retResult = "F";
			}
			// db conneciton close
			$this->dbDisconnectionPdo();
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => deleteLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	dropLopecCharacter
	 * description			: 	BAS_BOARD drop
	 * @param				:	$bindData			입력 데이터
	 * @return				: 	$retResult			S / F
	 ********************************************************************************************************************** */
	function dropLopecCharacter($bindData = "") {
		try {
			// query
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$query				= 	$modelLopecCharacter->dropLopecCharacter();
			//echo "deleteLopecCharacter query : ". $query ."\r\n";
			$retResult 		=	$this->processDeletePdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => dropLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	dropLopecCharacter
	 * description			: 	BAS_BOARD drop
	 * @param				:	$bindData			입력 데이터
	 * @return				: 	$retResult			S / F
	 ********************************************************************************************************************** */
	function updateLopecCharacterHit($bindData = "") {
		try {
			// query
			$modelLopecCharacter	= 	new modelLopecCharacter();
			$query		= 	$modelLopecCharacter->updateLopecCharacterHit();
			//echo "updateLopecCharacterHit query : ". $query ."\r\n";
			//print_r( $bindData );
			$retResult 		=	$this->processDeletePdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "E";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => updateLopecCharacterHit - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	mainListLopecCharacter
	 * description			: 	BAS_BOARD 목록
	 * @param				:	$bindData		Array(TN_USE)
	 * @return				: 	$retResult		array data
	 ********************************************************************************************************************** */
	function mainListLopecCharacter($bindData = "") {
		try {
			$modelLopecCharacter		= 	new modelLopecCharacter();
			$query			=	$modelLopecCharacter->mainListLopecCharacter($bindData);
			//echo "allListLopecCharacter query : ". $query ."\r\n";
			$retResult		= 	$this->selectListBindPdo($query, $bindData);
		} catch (Exception $e) {
			$retResult = "EE";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerUser => listLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	batchSelectLopecCharacters
	 * description			: 	LOPEC_CHARACTER 여러 캐릭터 닉네임으로 일괄 조회
	 * @param				:	$bindData		Array(TN_USE, array(닉네임들...))
	 * @return				: 	$retResult		array data
	 ********************************************************************************************************************** */
	function batchSelectLopecCharacters($bindData = "") {
		try {
			// basic
			$modelLopecCharacter = new modelLopecCharacter();
			
			// bindData 처리
			if (empty($bindData) || !isset($bindData[1]) || !is_array($bindData[1])) {
				return array(); // 빈 배열 반환
			}
			
			$useTn = $bindData[0]; // TN_USE
			$nicknames = $bindData[1]; // 닉네임 배열
			
			// 닉네임 배열이 비어있는 경우
			if (empty($nicknames)) {
				return array();
			}
			
			// 실제 바인딩에 사용할 배열 구성 (USE_TN + 닉네임 배열 x2)
			$execBindData = array($useTn);
			foreach ($nicknames as $nickname) {
				$execBindData[] = $nickname;
			}
			// ORDER BY FIELD 절에 사용하기 위해 닉네임 배열을 한번 더 추가
			foreach ($nicknames as $nickname) {
				$execBindData[] = $nickname;
			}
			
			// 쿼리 실행 및 결과 반환
			$query = $modelLopecCharacter->batchSelectLopecCharactersNickname($nicknames);
			$retResult = $this->selectListBindPdo($query, $execBindData);
		} catch (Exception $e) {
			$retResult = "EE";
			$logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecCharacter => batchSelectLopecCharacters - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
			die($e->getMessage());
		}
		return $retResult;
	}
	
	/* **********************************************************************************************************************
	 * function name    : selectCombinedCharacterData
	 * description     : 캐릭터의 여러 데이터를 한 번에 통합 조회 (최고 점수, 랭킹, 직업 랭킹, 백분율)
	 * @param          : $characterNickname    String    - 캐릭터 닉네임
	 * @param          : $rankingType         String    - 랭킹 타입 (DEAL/SUP)
	 * @return         : $retResult           Array     - 통합 데이터
	 ********************************************************************************************************************** */
	function selectCombinedCharacterData($characterNickname = "", $rankingType = "DEAL") {
	    try {
	        // 유효성 검사
	        if (empty($characterNickname)) {
	            return null;
	        }
	        
	        // 결과를 담을 배열 초기화
	        $combinedResult = array();
	        
	        // 1. 캐릭터 최고 점수 정보 조회
	        $bindData = Array(TN_USE, $characterNickname);
	        $characterBestData = $this->selectLopecCharacterBest($bindData);
	        $combinedResult['characterBest'] = $characterBestData ? $characterBestData : null;
	        
	        // 2. 특정 캐릭터의 랭킹 정보 조회
	        $tableName = ($rankingType == "SUP") ? "LOPEC_CHARACTER_BEST_RANKING_SUP" : "LOPEC_CHARACTER_BEST_RANKING_DEAL";
	        $rankingBindData = Array($characterNickname, $tableName);
	        $characterRankingData = $this->selectSingleCharacterRanking($rankingBindData);
	        $combinedResult['characterRanking'] = $characterRankingData ? $characterRankingData : null;
	        
	        // 3. 직업 내 랭킹 정보 조회 (baseClass 값은 characterBest에서 가져옴)
	        $baseClass = "";
	        if ($characterBestData && isset($characterBestData['LCHB_CHARACTER_CLASS'])) {
	            $baseClass = $characterBestData['LCHB_CHARACTER_CLASS'];
	        }
			$characterClassRankingData = $this->selectCharacterClassRanking($rankingType, $characterNickname);
			$combinedResult['classRanking'] = $characterClassRankingData ? $characterClassRankingData : null;
	        
	        // 4. 전체 랭킹 내 백분율 정보 조회 (메타데이터 테이블 활용)
	        $percentileData = $this->selectOverallRankingPercentile($characterNickname, $rankingType);
	        
	        // 필드명 변경에 따른 데이터 매핑 (클라이언트 호환성 유지)
	        if($percentileData && isset($percentileData['PERCENTILE']) && !isset($percentileData['OVERALL_PERCENTILE'])) {
	            $percentileData['OVERALL_PERCENTILE'] = $percentileData['PERCENTILE'];
	        }
	        
	        // 랭킹 데이터 일관성 처리
	        if($percentileData && isset($percentileData['RANKING_NUM']) && !isset($percentileData['OVERALL_RANK'])) {
	            $percentileData['OVERALL_RANK'] = $percentileData['RANKING_NUM'];
	        }
	        
	        $combinedResult['percentile'] = $percentileData ? $percentileData : null;
	        
	        return $combinedResult;
	    } catch (Exception $e) {
	        error_log("통합 데이터 조회 오류: " . $e->getMessage());
	        return null;
	    }
	}
}
?>