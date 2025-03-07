<?php 
/* ****************************************************************************************************
 * file name	: 	/applications/model/lopecCharacter.php
 * developer 	: 	blackhiker
 * description 	: 	LOPEC_CHARACTER query
 **************************************************************************************************** */
?>
<?php 
/* **********************************************************************************************************************
 * class name			:	modelLopecCharacter
 * description			: 	LOPEC_CHARACTER query 관련 class
 ********************************************************************************************************************** */
class modelLopecCharacter extends coreUnion {
	
	/* **********************************************************************************************************************
	 * function name		:	fieldSelectLopecCharacter
	 * description			: 	LOPEC_CHARACTER field - list / view 사용
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function fieldSelectLopecCharacter() {
		$retQuery = "";
		try {
			$retQuery .= "   LCHA_IDX                "; // bigint	캐릭터통합정보일련번호
			$retQuery .= " , LCHA_CD                 "; // varchar(50)	캐릭터통합정보내부번호
			$retQuery .= " , LCHA_CHARACTER_NICKNAME "; // varchar(500)	캐릭터닉네임
			$retQuery .= " , LCHA_CHARACTER_LEVEL    "; // bigint	캐릭터레벨
			$retQuery .= " , LCHA_CHARACTER_CLASS    "; // varchar(500)	캐릭터클래스
			$retQuery .= " , LCHA_CHARACTER_IMAGE    "; // varchar(1000)	캐릭터이미지
			$retQuery .= " , LCHA_SERVER             "; // varchar(200)	서버
			$retQuery .= " , LCHA_LEVEL              "; // varchar(100)	레벨
			$retQuery .= " , LCHA_GUILD              "; // varchar(200)	길드
			$retQuery .= " , LCHA_TITLE              "; // varchar(200)	칭호
			$retQuery .= " , LCHA_TOTALSUM           "; // bigint	합계점수
			$retQuery .= " , LCHA_TOTALSUMSUPPORT    "; // bigint	서폿합계점수
			$retQuery .= " , LCHA_ALLTIMEBUFF        "; // bigint	상시버프
			$retQuery .= " , LCHA_FULLBUFF           "; // bigint	풀버프
			$retQuery .= " , LCHA_VERSION            "; // varchar(50)  버전
			$retQuery .= " , LCHA_SEARCH_HIT         "; // bigint	검색COUNT
			$retQuery .= " , LCHA_USERAGENT          "; // text	브라저agent정보
			$retQuery .= " , USE_TN   "; // varchar(10)	사용여부/ USE/DEL
			$retQuery .= " , REG_CD   "; // varchar(40)	등록자내부번호
			$retQuery .= " , REG_ID   "; // varchar(50)	등록자아이디
			$retQuery .= " , REG_IP   "; // varchar(50)	등록자아이피
			$retQuery .= " , REG_DATE "; // varchar(14)	등록일시
			$retQuery .= " , MOD_CD   "; // varchar(40)	수정자내부번호
			$retQuery .= " , MOD_ID   "; // varchar(50)	수정자아이디
			$retQuery .= " , MOD_IP   "; // varchar(50)	수정자아이피
			$retQuery .= " , MOD_DATE "; // varchar(14)	수정일시
			$retQuery .= " , DEL_CD   "; // varchar(40)	삭제자내부번호
			$retQuery .= " , DEL_ID   "; // varchar(50)	삭제자아이디
			$retQuery .= " , DEL_IP   "; // varchar(50)	삭제자아이피
			$retQuery .= " , DEL_DATE "; // varchar(14)	삭제일시  
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => fieldSelectLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	fieldListLopecCharacter
	 * description			: 	LOPEC_CHARACTER field - list / view 사용
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function fieldListLopecCharacter() {
		$retQuery = "";
		try {
			$retQuery .= "   LCHA_IDX                "; // bigint	캐릭터통합정보일련번호
			$retQuery .= " , LCHA_CD                 "; // varchar(50)	캐릭터통합정보내부번호
			$retQuery .= " , LCHA_CHARACTER_NICKNAME "; // varchar(500)	캐릭터닉네임
			$retQuery .= " , LCHA_CHARACTER_LEVEL    "; // bigint	캐릭터레벨
			$retQuery .= " , LCHA_CHARACTER_CLASS    "; // varchar(500)	캐릭터클래스
			$retQuery .= " , LCHA_CHARACTER_IMAGE    "; // varchar(1000)	캐릭터이미지
			$retQuery .= " , LCHA_SERVER             "; // varchar(200)	서버
			$retQuery .= " , LCHA_LEVEL              "; // varchar(100)	레벨
			$retQuery .= " , LCHA_GUILD              "; // varchar(200)	길드
			$retQuery .= " , LCHA_TITLE              "; // varchar(200)	칭호
			$retQuery .= " , LCHA_TOTALSUM           "; // bigint	합계점수
			$retQuery .= " , LCHA_TOTALSUMSUPPORT    "; // bigint	서폿합계점수
			$retQuery .= " , LCHA_ALLTIMEBUFF        "; // bigint	상시버프
			$retQuery .= " , LCHA_FULLBUFF           "; // bigint	풀버프
			$retQuery .= " , LCHA_VERSION            "; // varchar(50) 버전
			$retQuery .= " , LCHA_SEARCH_HIT         "; // bigint	검색COUNT
			$retQuery .= " , LCHA_USERAGENT          "; // text	브라저agent정보
			$retQuery .= " , USE_TN   "; // varchar(10)	사용여부/ USE/DEL
			$retQuery .= " , REG_CD   "; // varchar(40)	등록자내부번호
			$retQuery .= " , REG_ID   "; // varchar(50)	등록자아이디
			$retQuery .= " , REG_IP   "; // varchar(50)	등록자아이피
			$retQuery .= " , REG_DATE "; // varchar(14)	등록일시
			$retQuery .= " , MOD_CD   "; // varchar(40)	수정자내부번호
			$retQuery .= " , MOD_ID   "; // varchar(50)	수정자아이디
			$retQuery .= " , MOD_IP   "; // varchar(50)	수정자아이피
			$retQuery .= " , MOD_DATE "; // varchar(14)	수정일시
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => fieldSelectLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	fieldInsertLopecCharacter
	 * description			: 	LOPEC_CHARACTER field - insert 사용
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function fieldInsertLopecCharacter() {
		$retQuery = "";
		try {
			$retQuery .= "   LCHA_CD                 "; // varchar(50)	캐릭터통합정보내부번호
			$retQuery .= " , LCHA_CHARACTER_NICKNAME "; // varchar(500)	캐릭터닉네임
			$retQuery .= " , LCHA_CHARACTER_LEVEL    "; // bigint	캐릭터레벨
			$retQuery .= " , LCHA_CHARACTER_CLASS    "; // varchar(500)	캐릭터클래스
			$retQuery .= " , LCHA_CHARACTER_IMAGE    "; // varchar(1000)	캐릭터이미지
			$retQuery .= " , LCHA_SERVER             "; // varchar(200)	서버
			$retQuery .= " , LCHA_LEVEL              "; // varchar(100)	레벨
			$retQuery .= " , LCHA_GUILD              "; // varchar(200)	길드
			$retQuery .= " , LCHA_TITLE              "; // varchar(200)	칭호
			$retQuery .= " , LCHA_TOTALSUM           "; // bigint	합계점수
			$retQuery .= " , LCHA_TOTALSUMSUPPORT    "; // bigint	서폿합계점수
			$retQuery .= " , LCHA_ALLTIMEBUFF        "; // bigint	상시버프
			$retQuery .= " , LCHA_FULLBUFF           "; // bigint	풀버프
			$retQuery .= " , LCHA_VERSION            "; // varchar(50)  버전
			$retQuery .= " , LCHA_SEARCH_HIT         "; // bigint	검색COUNT
			$retQuery .= " , LCHA_USERAGENT          "; // text	브라저agent정보
			$retQuery .= " , USE_TN   "; // varchar(10)	사용여부/ USE/DEL
			$retQuery .= " , REG_CD   "; // varchar(40)	등록자내부번호
			$retQuery .= " , REG_ID   "; // varchar(50)	등록자아이디
			$retQuery .= " , REG_IP   "; // varchar(50)	등록자아이피
			$retQuery .= " , REG_DATE "; // varchar(14)	등록일시
			$retQuery .= " , MOD_CD   "; // varchar(40)	수정자내부번호
			$retQuery .= " , MOD_ID   "; // varchar(50)	수정자아이디
			$retQuery .= " , MOD_IP   "; // varchar(50)	수정자아이피
			$retQuery .= " , MOD_DATE "; // varchar(14)	수정일시
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => fieldInsertLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	insertLopecCharacter
	 * description			: 	LOPEC_CHARACTER insert
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function insertLopecCharacter() {		
		$retQuery = "";
		try {
			$retQuery  .= "	INSERT INTO LOPEC_CHARACTER (	";
			$retQuery  .= $this->fieldInsertLopecCharacter();
			$retQuery  .= "	) VALUES (				";
			$retQuery .= "   ? "; // varchar(50)	캐릭터통합정보내부번호
			$retQuery .= " , ? "; // varchar(500)	캐릭터닉네임
			$retQuery .= " , ? "; // bigint	캐릭터레벨
			$retQuery .= " , ? "; // varchar(500)	캐릭터클래스
			$retQuery .= " , ? "; // varchar(1000)	캐릭터이미지
			$retQuery .= " , ? "; // varchar(200)	서버
			$retQuery .= " , ? "; // varchar(100)	레벨
			$retQuery .= " , ? "; // varchar(200)	길드
			$retQuery .= " , ? "; // varchar(200)	칭호
			$retQuery .= " , ? "; // bigint	합계점수
			$retQuery .= " , ? "; // bigint	서폿합계점수
			$retQuery .= " , ? "; // bigint	상시버프
			$retQuery .= " , ? "; // bigint	풀버프
			$retQuery .= " , ? "; // varchar(50) 버전 정보
			$retQuery .= " , ? "; // bigint	검색COUNT
			$retQuery .= " , ? "; // text	브라저agent정보
			$retQuery .= " , ? "; // varchar(10)	사용여부/ USE/DEL
			$retQuery .= " , ? "; // varchar(40)	등록자내부번호
			$retQuery .= " , ? "; // varchar(50)	등록자아이디
			$retQuery .= " , ? "; // varchar(50)	등록자아이피
			$retQuery .= " , DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') "; // varchar(14)	등록일시
			$retQuery .= " , ? "; // varchar(40)	수정자내부번호
			$retQuery .= " , ? "; // varchar(50)	수정자아이디
			$retQuery .= " , ? "; // varchar(50)	수정자아이피
			$retQuery .= " , DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') "; // varchar(14)	수정일시
			$retQuery  .= "	) 	";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => insertLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	insertLopecCharacterBack
	 * description			: 	LOPEC_CHARACTER select - LOPEC_CHARACTER_BACK insert
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function insertLopecCharacterBack($nickName = "") {
		$retQuery = "";
		try {
			$retQuery  .= "	INSERT INTO LOPEC_CHARACTER_BACK 	";
			$retQuery  .= "	SELECT * FROM LOPEC_CHARACTER WHERE 1 = 1 AND LCHA_CHARACTER_NICKNAME = '".$nickName."' ";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => insertLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectBackMaxScore
	 * description     : LOPEC_CHARACTER_BACK 테이블에서 캐릭터의 최고 점수를 조회
	 * @param          : $nickName    캐릭터 닉네임
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectBackMaxScore($nickName = "") {
	    $retQuery = "";
	    try {
	        $retQuery .= " SELECT MAX(LCHA_TOTALSUM) as CNT ";  // CNT
	        $retQuery .= " FROM LOPEC_CHARACTER_BACK ";
	        $retQuery .= " WHERE 1 = 1 ";
	        $retQuery .= " AND LCHA_CHARACTER_NICKNAME = ? ";
	        $retQuery .= " AND USE_TN = ? ";  // 사용 여부 체크
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectBackMaxScore - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectBestScore
	 * description     : LOPEC_CHARACTER_BEST 테이블에서 캐릭터의 현재 최고 점수를 조회
	 * @param          : $nickName    캐릭터 닉네임
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectBestScore($nickName = "") {
	    $retQuery = "";
	    try {
	        $retQuery .= " SELECT LCHB_TOTALSUM as CNT ";  // CNT
	        $retQuery .= " FROM LOPEC_CHARACTER_BEST ";
	        $retQuery .= " WHERE 1 = 1 ";
	        $retQuery .= " AND LCHB_CHARACTER_NICKNAME = ? ";
	        $retQuery .= " AND USE_TN = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectBestScore - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}




	/* **********************************************************************************************************************
	 * function name    : selectBackMaxScoreSupport
	 * description     : LOPEC_CHARACTER_BACK 테이블에서 캐릭터의 최고 서포트 점수를 조회
	 * @param          : $nickName    캐릭터 닉네임
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectBackMaxScoreSupport($nickName = "") {
	    $retQuery = "";
	    try {
	        $retQuery .= " SELECT MAX(LCHA_TOTALSUMSUPPORT) as CNT ";
	        $retQuery .= " FROM LOPEC_CHARACTER_BACK ";
	        $retQuery .= " WHERE 1 = 1 ";
	        $retQuery .= " AND LCHA_CHARACTER_NICKNAME = ? ";
	        $retQuery .= " AND USE_TN = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectBackMaxScoreSupport - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectBestScoreSupport
	 * description     : LOPEC_CHARACTER_BEST 테이블에서 캐릭터의 현재 최고 서포트 점수를 조회
	 * @param          : $nickName    캐릭터 닉네임
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectBestScoreSupport($nickName = "") {
	    $retQuery = "";
	    try {
	        $retQuery .= " SELECT LCHB_TOTALSUMSUPPORT as CNT ";
	        $retQuery .= " FROM LOPEC_CHARACTER_BEST ";
	        $retQuery .= " WHERE 1 = 1 ";
	        $retQuery .= " AND LCHB_CHARACTER_NICKNAME = ? ";
	        $retQuery .= " AND USE_TN = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectBestScoreSupport - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}


	/* **********************************************************************************************************************
	 * function name    : selectLopecCharacterBest
	 * description     : LOPEC_CHARACTER_BEST 테이블에서 특정 캐릭터 정보 조회
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectLopecCharacterBest() {
		$retQuery = "";
		try {
			$retQuery .= " SELECT LCHB_IDX, LCHB_CD, LCHB_CHARACTER_NICKNAME, LCHB_CHARACTER_CLASS,";
			$retQuery .= " LCHB_LEVEL, LCHB_TOTALSUM, LCHB_TOTALSUMSUPPORT, LCHB_ACHIEVE_DATE,";
			$retQuery .= " USE_TN, REG_DATE";
			$retQuery .= " FROM LOPEC_CHARACTER_BEST";
			$retQuery .= " WHERE USE_TN = ?";
			$retQuery .= " AND LCHB_CHARACTER_NICKNAME = ?";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectLopecCharacterBest - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}


	/* **********************************************************************************************************************
	 * function name    : insertOrUpdateBestScore
	 * description     : LOPEC_CHARACTER_BEST 테이블에 최고 점수 저장/갱신
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function insertOrUpdateBestScore() {
	    $retQuery = "";
	    try {
	        $retQuery .= " INSERT INTO LOPEC_CHARACTER_BEST ( ";
	        $retQuery .= "     LCHB_CD, LCHB_CHARACTER_NICKNAME, LCHB_CHARACTER_CLASS, ";
	        $retQuery .= "     LCHB_SERVER, LCHB_LEVEL, LCHB_TOTALSUM, LCHB_ACHIEVE_DATE, ";
	        $retQuery .= "     USE_TN, REG_CD, REG_ID, REG_IP, REG_DATE ";
	        $retQuery .= " ) VALUES ( ";
	        $retQuery .= "     ?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), ";
	        $retQuery .= "     ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') ";
	        $retQuery .= " ) ON DUPLICATE KEY UPDATE ";
	        $retQuery .= "     LCHB_TOTALSUM = CASE ";
	        $retQuery .= "         WHEN VALUES(LCHB_TOTALSUM) > LCHB_TOTALSUM OR LCHB_TOTALSUM IS NULL ";
	        $retQuery .= "         THEN VALUES(LCHB_TOTALSUM) ";
	        $retQuery .= "         ELSE LCHB_TOTALSUM ";
	        $retQuery .= "     END, ";
	        $retQuery .= "     LCHB_SERVER = VALUES(LCHB_SERVER), ";
	        $retQuery .= "     LCHB_ACHIEVE_DATE = CASE ";
	        $retQuery .= "         WHEN VALUES(LCHB_TOTALSUM) > LCHB_TOTALSUM OR LCHB_TOTALSUM IS NULL ";
	        $retQuery .= "         THEN DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') ";
	        $retQuery .= "         ELSE LCHB_ACHIEVE_DATE ";
	        $retQuery .= "     END ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => insertOrUpdateBestScore - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}


	/* **********************************************************************************************************************
	 * function name    : insertOrUpdateBestScoreSupport
	 * description     : LOPEC_CHARACTER_BEST 테이블에 서포트 최고 점수 저장/갱신
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function insertOrUpdateBestScoreSupport() {
	    $retQuery = "";
	    try {
	        $retQuery .= " INSERT INTO LOPEC_CHARACTER_BEST ( ";
	        $retQuery .= "     LCHB_CD, LCHB_CHARACTER_NICKNAME, LCHB_CHARACTER_CLASS, ";
	        $retQuery .= "     LCHB_SERVER, LCHB_LEVEL, LCHB_TOTALSUMSUPPORT, LCHB_ACHIEVE_DATE, ";
	        $retQuery .= "     USE_TN, REG_CD, REG_ID, REG_IP, REG_DATE ";
	        $retQuery .= " ) VALUES ( ";
	        $retQuery .= "     ?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), ";
	        $retQuery .= "     ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') ";
	        $retQuery .= " ) ON DUPLICATE KEY UPDATE ";
	        $retQuery .= "     LCHB_TOTALSUMSUPPORT = CASE ";
	        $retQuery .= "         WHEN VALUES(LCHB_TOTALSUMSUPPORT) > LCHB_TOTALSUMSUPPORT OR LCHB_TOTALSUMSUPPORT IS NULL ";
	        $retQuery .= "         THEN VALUES(LCHB_TOTALSUMSUPPORT) ";
	        $retQuery .= "         ELSE LCHB_TOTALSUMSUPPORT ";
	        $retQuery .= "     END, ";
	        $retQuery .= "     LCHB_SERVER = VALUES(LCHB_SERVER), ";
	        $retQuery .= "     LCHB_ACHIEVE_DATE = CASE ";
	        $retQuery .= "         WHEN VALUES(LCHB_TOTALSUMSUPPORT) > LCHB_TOTALSUMSUPPORT OR LCHB_TOTALSUMSUPPORT IS NULL ";
	        $retQuery .= "         THEN DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') ";
	        $retQuery .= "         ELSE LCHB_ACHIEVE_DATE ";
	        $retQuery .= "     END ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => insertOrUpdateBestScoreSupport - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}



	/* **********************************************************************************************************************
	 * function name    : selectLopecCharacterRankingDeal
	 * description     : LOPEC_CHARACTER_BEST_RANKING_DEAL 테이블에서 랭킹 정보 조회
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectLopecCharacterRankingDeal() {
		$retQuery = "";
		try {
			$retQuery .= " SELECT LCHB_CHARACTER_NICKNAME, LCHB_CHARACTER_CLASS,";
			$retQuery .= " LCHB_TOTALSUM, RANKING_NUM";
			$retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_DEAL_TOP100";
			$retQuery .= " WHERE RANKING_NUM IS NOT NULL";  // 유효한 랭킹 번호가 있는 데이터만 선택
			$retQuery .= " ORDER BY RANKING_NUM ASC";  // 랭킹 순서대로 정렬
			$retQuery .= " LIMIT 100";  // 상위 20명만 선택
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectLopecCharacterRankingDeal - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectLopecCharacterRankingSup
	 * description     : LOPEC_CHARACTER_BEST_RANKING_SUP 테이블에서 랭킹 정보 조회
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectLopecCharacterRankingSup() {
		$retQuery = "";
		try {
			$retQuery .= " SELECT LCHB_CHARACTER_NICKNAME, LCHB_CHARACTER_CLASS,";
			$retQuery .= " LCHB_TOTALSUM, RANKING_NUM";
			$retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_SUP_TOP100";
			$retQuery .= " WHERE RANKING_NUM IS NOT NULL";  // 유효한 랭킹 번호가 있는 데이터만 선택
			$retQuery .= " ORDER BY RANKING_NUM ASC";  // 랭킹 순서대로 정렬
			$retQuery .= " LIMIT 100";  // 상위 20명만 선택
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectLopecCharacterRankingDeal - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}

	
	/* **********************************************************************************************************************
	 * function name    : selectRankingMetadata
	 * description     : LOPEC_RANKING_METADATA 테이블에서 랭킹 타입별 메타데이터 조회
	 * @param          : $rankingType    랭킹 타입 (DEAL/SUP)
	 * @return         : $retQuery      full query
	 ********************************************************************************************************************** */
	function selectRankingMetadata() {
	    $retQuery = "";
	    try {
	        $retQuery .= " SELECT ranking_type, total_count ";
	        $retQuery .= " FROM LOPEC_RANKING_METADATA ";
	        $retQuery .= " WHERE ranking_type = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectRankingMetadata - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectOverallRankingPercentile
	 * description     : DEAL 랭킹에서의 백분율 계산 (메타데이터 테이블 활용)
	 * @param          : $characterNickname    캐릭터 닉네임
	 * @return         : $retQuery            full query
	 ********************************************************************************************************************** */
	function selectOverallRankingPercentile() {
	    $retQuery = "";
	    try {
	        // 캐릭터의 랭킹 정보 및 메타데이터를 활용한 백분율 계산
	        $retQuery .= " SELECT r.LCHB_CHARACTER_NICKNAME, r.LCHB_TOTALSUM, r.RANKING_NUM, ";
	        $retQuery .= " (SELECT total_count FROM LOPEC_RANKING_METADATA WHERE ranking_type = 'DEAL') as TOTAL_CHARACTERS, ";
	        $retQuery .= " ROUND((r.RANKING_NUM / (SELECT total_count FROM LOPEC_RANKING_METADATA WHERE ranking_type = 'DEAL')) * 100, 2) as PERCENTILE ";
	        $retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_DEAL r ";
	        $retQuery .= " WHERE r.LCHB_CHARACTER_NICKNAME = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectOverallRankingPercentile - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectOverallRankingPercentileSup
	 * description     : SUP 랭킹에서의 백분율 계산 (메타데이터 테이블 활용)
	 * @param          : $characterNickname    캐릭터 닉네임
	 * @return         : $retQuery            full query
	 ********************************************************************************************************************** */
	function selectOverallRankingPercentileSup() {
	    $retQuery = "";
	    try {
	        // 캐릭터의 랭킹 정보 및 메타데이터를 활용한 백분율 계산
	        $retQuery .= " SELECT r.LCHB_CHARACTER_NICKNAME, r.LCHB_TOTALSUM, r.RANKING_NUM, ";
	        $retQuery .= " (SELECT total_count FROM LOPEC_RANKING_METADATA WHERE ranking_type = 'SUP') as TOTAL_CHARACTERS, ";
	        $retQuery .= " ROUND((r.RANKING_NUM / (SELECT total_count FROM LOPEC_RANKING_METADATA WHERE ranking_type = 'SUP')) * 100, 2) as PERCENTILE ";
	        $retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_SUP r ";
	        $retQuery .= " WHERE r.LCHB_CHARACTER_NICKNAME = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectOverallRankingPercentileSup - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name    : selectClassRankingDeal
	 * description     : DEAL 타입의 직업별 랭킹 정보 조회
	 * @param          : $baseClass    특정 직업 조회 시 사용
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectClassRankingDeal() {
	    $retQuery = "";
	    try {
	        $retQuery .= " WITH RankedData AS ( ";
	        $retQuery .= "     SELECT ";
	        $retQuery .= "         r.LCHB_CHARACTER_NICKNAME, ";
	        $retQuery .= "         r.LCHB_CHARACTER_CLASS, ";
	        $retQuery .= "         r.LCHB_TOTALSUM, ";
	        $retQuery .= "         m.BASE_CLASS, ";
	        $retQuery .= "         RANK() OVER (PARTITION BY m.BASE_CLASS ORDER BY r.LCHB_TOTALSUM DESC) as CLASS_RANK, ";
	        $retQuery .= "         COUNT(*) OVER (PARTITION BY m.BASE_CLASS) as TOTAL_IN_CLASS ";
	        $retQuery .= "     FROM LOPEC_CHARACTER_BEST_RANKING_DEAL r ";
	        $retQuery .= "     JOIN LOPEC_CLASS_MAPPING m ON r.LCHB_CHARACTER_CLASS = m.DETAIL_CLASS ";
	        $retQuery .= "     WHERE r.RANKING_NUM IS NOT NULL ";
	        $retQuery .= " ) ";
	        $retQuery .= " SELECT ";
	        $retQuery .= "     LCHB_CHARACTER_NICKNAME, ";
	        $retQuery .= "     LCHB_CHARACTER_CLASS, ";
	        $retQuery .= "     LCHB_TOTALSUM, ";
	        $retQuery .= "     BASE_CLASS, ";
	        $retQuery .= "     CLASS_RANK, ";
	        $retQuery .= "     TOTAL_IN_CLASS, ";
	        $retQuery .= "     ROUND(CLASS_RANK * 100.0 / TOTAL_IN_CLASS, 2) as CLASS_PERCENTILE ";
	        $retQuery .= " FROM RankedData ";
	        $retQuery .= " WHERE 1=1 ";
		
	        if (isset($bindData[0]) && !empty($bindData[0])) {
	            $retQuery .= " AND BASE_CLASS = ? ";
	        }
		
	        $retQuery .= " ORDER BY BASE_CLASS, CLASS_RANK ASC ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectClassRankingDeal - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectClassRankingSup
	 * description     : SUP 타입의 직업별 랭킹 정보 조회
	 * @param          : $baseClass    특정 직업 조회 시 사용
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectClassRankingSup() {
	    $retQuery = "";
	    try {
	        $retQuery .= " WITH RankedData AS ( ";
	        $retQuery .= "     SELECT ";
	        $retQuery .= "         r.LCHB_CHARACTER_NICKNAME, ";
	        $retQuery .= "         r.LCHB_CHARACTER_CLASS, ";
	        $retQuery .= "         r.LCHB_TOTALSUM, ";
	        $retQuery .= "         m.BASE_CLASS, ";
	        $retQuery .= "         RANK() OVER (PARTITION BY m.BASE_CLASS ORDER BY r.LCHB_TOTALSUM DESC) as CLASS_RANK, ";
	        $retQuery .= "         COUNT(*) OVER (PARTITION BY m.BASE_CLASS) as TOTAL_IN_CLASS ";
	        $retQuery .= "     FROM LOPEC_CHARACTER_BEST_RANKING_SUP r ";
	        $retQuery .= "     JOIN LOPEC_CLASS_MAPPING m ON r.LCHB_CHARACTER_CLASS = m.DETAIL_CLASS ";
	        $retQuery .= "     WHERE r.RANKING_NUM IS NOT NULL ";
	        $retQuery .= " ) ";
	        $retQuery .= " SELECT ";
	        $retQuery .= "     LCHB_CHARACTER_NICKNAME, ";
	        $retQuery .= "     LCHB_CHARACTER_CLASS, ";
	        $retQuery .= "     LCHB_TOTALSUM, ";
	        $retQuery .= "     BASE_CLASS, ";
	        $retQuery .= "     CLASS_RANK, ";
	        $retQuery .= "     TOTAL_IN_CLASS, ";
	        $retQuery .= "     ROUND(CLASS_RANK * 100.0 / TOTAL_IN_CLASS, 2) as CLASS_PERCENTILE ";
	        $retQuery .= " FROM RankedData ";
	        $retQuery .= " WHERE 1=1 ";
		
	        if (isset($bindData[0]) && !empty($bindData[0])) {
	            $retQuery .= " AND BASE_CLASS = ? ";
	        }
		
	        $retQuery .= " ORDER BY BASE_CLASS, CLASS_RANK ASC ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectClassRankingSup - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}



	/* **********************************************************************************************************************
	 * function name    : selectSingleCharacterRankingDeal
	 * description     : LOPEC_CHARACTER_BEST_RANKING_DEAL 테이블에서 특정 캐릭터의 랭킹 정보 조회
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectSingleCharacterRankingDeal() {
		$retQuery = "";
		try {
			$retQuery .= " SELECT LCHB_CHARACTER_NICKNAME, LCHB_TOTALSUM, RANKING_NUM";
			$retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_DEAL";
			$retQuery .= " WHERE LCHB_CHARACTER_NICKNAME = ?";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectSingleCharacterRankingDeal - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}

	/* **********************************************************************************************************************
	 * function name    : selectSingleCharacterRankingSup
	 * description     : LOPEC_CHARACTER_BEST_RANKING_SUP 테이블에서 특정 캐릭터의 랭킹 정보 조회
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectSingleCharacterRankingSup() {
		$retQuery = "";
		try {
			$retQuery .= " SELECT LCHB_CHARACTER_NICKNAME, LCHB_TOTALSUM, RANKING_NUM";
			$retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_SUP";
			$retQuery .= " WHERE LCHB_CHARACTER_NICKNAME = ?";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectSingleCharacterRankingDeal - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}



	/* **********************************************************************************************************************
	 * function name    : selectCharacterClassRankingDeal
	 * description     : 특정 캐릭터의 DEAL 직업 내 순위 정보 조회
	 * @return         : $retQuery    full query
	 ********************************************************************************************************************** */
	function selectCharacterClassRankingDeal() {
    	$retQuery = "";
    	try {
    	    // 기본 정보 및 직업 내 순위 조회
    	    $retQuery .= " SELECT c.LCHB_CHARACTER_NICKNAME, c.LCHB_CHARACTER_CLASS, ";
    	    $retQuery .= " c.LCHB_TOTALSUM, m.BASE_CLASS, ";
		
    	    // 직업 내 해당 캐릭터보다 점수가 높거나 같은 캐릭터 수 계산 (순위 계산용)
    	    $retQuery .= " (SELECT COUNT(*) FROM LOPEC_CHARACTER_BEST_RANKING_DEAL r ";
    	    $retQuery .= "  JOIN LOPEC_CLASS_MAPPING m2 ON r.LCHB_CHARACTER_CLASS = m2.DETAIL_CLASS ";
    	    $retQuery .= "  WHERE m2.BASE_CLASS = m.BASE_CLASS AND r.LCHB_TOTALSUM >= c.LCHB_TOTALSUM) as CLASS_RANK, ";
		
    	    // 직업 내 전체 캐릭터 수 계산 (백분율 계산용)
    	    $retQuery .= " (SELECT COUNT(*) FROM LOPEC_CHARACTER_BEST_RANKING_DEAL r ";
    	    $retQuery .= "  JOIN LOPEC_CLASS_MAPPING m2 ON r.LCHB_CHARACTER_CLASS = m2.DETAIL_CLASS ";
    	    $retQuery .= "  WHERE m2.BASE_CLASS = m.BASE_CLASS) as TOTAL_IN_CLASS ";
		
    	    // 메인 쿼리
    	    $retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_DEAL c ";
    	    $retQuery .= " JOIN LOPEC_CLASS_MAPPING m ON c.LCHB_CHARACTER_CLASS = m.DETAIL_CLASS ";
    	    $retQuery .= " WHERE c.LCHB_CHARACTER_NICKNAME = ? ";
    	} catch (Exception $e) {
    	    $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectCharacterClassRankingDeal - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
    	    die($e->getMessage());
    	}
    	return $retQuery;
		}

	/* ***************************************************************
	 * function name    : selectCharacterClassRankingSup
	 * description     : 특정 캐릭터의 SUP 직업 내 순위 정보 조회
	 * @return         : $retQuery    full query
	 ************************************************************** */
	function selectCharacterClassRankingSup() {
	    $retQuery = "";
	    try {
	        // 기본 정보 및 직업 내 순위 조회
	        $retQuery .= " SELECT c.LCHB_CHARACTER_NICKNAME, c.LCHB_CHARACTER_CLASS, ";
	        $retQuery .= " c.LCHB_TOTALSUM, m.BASE_CLASS, ";
		
	        // 직업 내 해당 캐릭터보다 점수가 높거나 같은 캐릭터 수 계산 (순위 계산용)
	        $retQuery .= " (SELECT COUNT(*) FROM LOPEC_CHARACTER_BEST_RANKING_SUP r ";
	        $retQuery .= "  JOIN LOPEC_CLASS_MAPPING m2 ON r.LCHB_CHARACTER_CLASS = m2.DETAIL_CLASS ";
	        $retQuery .= "  WHERE m2.BASE_CLASS = m.BASE_CLASS AND r.LCHB_TOTALSUM >= c.LCHB_TOTALSUM) as CLASS_RANK, ";
		
	        // 직업 내 전체 캐릭터 수 계산 (백분율 계산용)
	        $retQuery .= " (SELECT COUNT(*) FROM LOPEC_CHARACTER_BEST_RANKING_SUP r ";
	        $retQuery .= "  JOIN LOPEC_CLASS_MAPPING m2 ON r.LCHB_CHARACTER_CLASS = m2.DETAIL_CLASS ";
	        $retQuery .= "  WHERE m2.BASE_CLASS = m.BASE_CLASS) as TOTAL_IN_CLASS ";
		
	        // 메인 쿼리
	        $retQuery .= " FROM LOPEC_CHARACTER_BEST_RANKING_SUP c ";
	        $retQuery .= " JOIN LOPEC_CLASS_MAPPING m ON c.LCHB_CHARACTER_CLASS = m.DETAIL_CLASS ";
	        $retQuery .= " WHERE c.LCHB_CHARACTER_NICKNAME = ? ";
	    } catch (Exception $e) {
	        $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectCharacterClassRankingSup - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
	        die($e->getMessage());
	    }
	    return $retQuery;
	}



	/* **********************************************************************************************************************
	 * function name		:	updateLopecCharacterSearchHit
	 * description			: 	LOPEC_CHARACTER search hit updates
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function updateLopecCharacterSearchHit() {
		$retQuery = "";
		try {
			$retQuery  .= "	UPDATE LOPEC_CHARACTER SET	";
			$retQuery .= "   LCHA_SEARCH_HIT = LCHA_HITS + 1 ";
			$retQuery  .= " WHERE 1 = 1 ";
			$retQuery .= " AND LCHA_CD = ? ";
			$retQuery	.=  " AND LCHA_CHARACTER_NICKNAME = ? "; // varchar(500)	캐릭터닉네임
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => updateLopecCharacterSearchHit - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	deleteLopecCharacter
	 * description			: 	LOPEC_CHARACTER delete flag
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function deleteLopecCharacter() {
		$retQuery = "";
		try {
			$retQuery  .= " UPDATE LOPEC_CHARACTER SET ";
			$retQuery .= " USE_TN 		= ? ";  // varchar(10)	사용여부/ USE/
			$retQuery .= " , DEL_CD		= ? ";  // varchar(40)	삭제자내부번호
			$retQuery .= " , DEL_ID		= ? ";  // varchar(50)	삭제자아이디
			$retQuery .= " , DEL_IP		= ? ";  // varchar(50)	삭제자아이피
			$retQuery .= " , DEL_DATE	= DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')";  // varchar(14)	삭제일시
			$retQuery  .= " WHERE 1 = 1	";
			$retQuery .= " AND LCHA_CD = ? ";
			$retQuery	.=  " AND LCHA_CHARACTER_NICKNAME = ? "; // varchar(500)	캐릭터닉네임
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => deleteLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	dropLopecCharacter
	 * description			: 	LOPEC_CHARACTER drop
	 * @param				:
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function dropLopecCharacter() {
		$retQuery = "";
		try {
			$retQuery  .= " DELETE FROM LOPEC_CHARACTER ";
			$retQuery  .= " WHERE 1 = 1	";
			$retQuery .=  " AND LCHA_CHARACTER_NICKNAME = ? "; // varchar(500)	캐릭터닉네임
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => dropLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	selectLopecCharacter
	 * description			: 	LOPEC_CHARACTER   select
	 * @param				:	$bindData	Array(id)
	 * @return				: 	$retQuery	full query
	 ********************************************************************************************************************** */
	function selectLopecCharacter($bindData = "") {
		$retQuery = "";
		try {
			$retQuery .= " SELECT	";
			$retQuery .= $this->fieldSelectLopecCharacter();
			$retQuery .= " FROM LOPEC_CHARACTER LCHA";
			$retQuery .= $this->whereLopecCharacter($bindData, "sel", "");
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	selectLopecCharacterNickname
	 * description			: 	LOPEC_CHARACTER   select
	 * @param				:	$bindData	Array(id)
	 * @return				: 	$retQuery	full query
	 ********************************************************************************************************************** */
	function selectLopecCharacterNickname($bindData = "") {
		$retQuery = "";
		try {
			$retQuery .= " SELECT	";
			$retQuery .= $this->fieldSelectLopecCharacter();
			$retQuery .= " FROM LOPEC_CHARACTER LCHA";
			$retQuery .= $this->whereLopecCharacter($bindData, "select_nickname", "");
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => selectLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	batchSelectLopecCharactersNickname
	 * description			: 	LOPEC_CHARACTER 캐릭터 일괄 조회 (여러 닉네임으로 한 번에 조회)
	 * @param				:	$nicknames	Array(닉네임 배열)
	 * @return				: 	$retQuery	full query
	 ********************************************************************************************************************** */
	function batchSelectLopecCharactersNickname($nicknames = array()) {
		$retQuery = "";
		
		try {
			// 닉네임 배열이 비었거나 배열이 아닌 경우, 결과가 없는 쿼리 반환
			if(empty($nicknames) || !is_array($nicknames)) {
				return "SELECT LCHA_CHARACTER_NICKNAME, LCHA_CHARACTER_CLASS, LCHA_LEVEL, LCHA_TOTALSUM, LCHA_TOTALSUMSUPPORT, REG_DATE
						FROM LOPEC_CHARACTER WHERE 1=0";
			}
			
			// 플레이스홀더 생성 (닉네임 배열 길이만큼 '?' 생성)
			$placeholders = implode(',', array_fill(0, count($nicknames), '?'));
			
			// 딜러/서폿 구분 없이 필요한 컬럼만 선택
			$retQuery = 	"SELECT LCHA_CHARACTER_NICKNAME, LCHA_CHARACTER_CLASS, LCHA_LEVEL, 
							LCHA_TOTALSUM, LCHA_TOTALSUMSUPPORT, REG_DATE
							FROM LOPEC_CHARACTER 
							WHERE USE_TN = ? AND LCHA_CHARACTER_NICKNAME IN (".$placeholders.")
							ORDER BY FIELD(LCHA_CHARACTER_NICKNAME, ".implode(',', array_fill(0, count($nicknames), '?')).")";
		} catch (Exception $e) {
			$retQuery = "";
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => batchSelectLopecCharactersNickname - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
		}
		
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	allListLopecCharacter
	 * description			: 	LOPEC_CHARACTER  목록 LIST / 전체 LIST 페이징 없음
	 * @param				:	$bindData		Array(TN_USE)
	 * @return				: 	$retQuery	full query
	 ********************************************************************************************************************** */
	function allListLopecCharacter($bindData = "") {
		$retQuery = "";
		try {
			$retQuery .= " SELECT	";
			$retQuery .= $this->fieldSelectLopecCharacter();
			$retQuery .= " FROM LOPEC_CHARACTER LCHA ";
			$retQuery .= $this->whereLopecCharacter($bindData, "all", "");
			$retQuery .= " ORDER BY LCHA_CHARACTER_LEVEL DESC";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => allListLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	allListLopecCharacter
	 * description			: 	LOPEC_CHARACTER  목록 LIST / 전체 LIST 페이징 없음
	 * @param				:	$bindData		Array(TN_USE)
	 * @return				: 	$retQuery	full query
	 ********************************************************************************************************************** */
	function limitListLopecCharacter($bindData = "", $limitNum = "") {
		$retQuery = "";
		try {
			$retQuery .= " SELECT	";
			$retQuery .= $this->fieldSelectLopecCharacter();
			$retQuery .= " FROM LOPEC_CHARACTER LCHA ";
			$retQuery .= $this->whereLopecCharacter($bindData, "all", "");
			$retQuery .= " ORDER BY LCHA_CHARACTER_LEVEL DESC  LIMIT ". $limitNum."	";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => allListLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	/* **********************************************************************************************************************
	 * function name		:	levelListLopecCharacter
	 * description			: 	LOPEC_CHARACTER   level desc list
	 * @param				:	$bindData	Array(id)
	 * @return				: 	$retQuery	full query
	 ********************************************************************************************************************** */
	function levelListLopecCharacter($bindData = "", $limitNum = "") {
		$retQuery = "";
		try {
			$retQuery .= " SELECT	";
			$retQuery .= $this->fieldSelectLopecCharacter();
			$retQuery .= " FROM LOPEC_CHARACTER LCHA";
			$retQuery .= $this->whereLopecCharacter($bindData, "level_list", "");
			$retQuery .= " ORDER BY LCHA_LEVEL DESC LIMIT ".$limitNum." ";
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => levelListLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	totalCountLopecCharacter
	 * description			: 	LOPEC_CHARACTER 목록 total count
	 * @param				:	$schKind				검색 구분 - 제목 / 내용 / 제목+내용
	 * @param				:	$bindData				삭제구분 / 검색어
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function totalCountLopecCharacter($sckKind = "", $bindData = "") {
		$retQuery = "";
		try {
			$retQuery .= " SELECT ";
			$retQuery .= "	COUNT(LCHA_IDX) AS CNT	";
			$retQuery .= " FROM LOPEC_CHARACTER LCHA ";
			$retQuery .= $this->whereLopecCharacter($bindData, "lst", $sckKind);
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => totalCountLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	startNumLopecCharacter
	 * description			: 	LOPEC_CHARACTER 목록 offset start number
	 * @param				:	$schKind				검색 구분 - 제목 / 내용 / 제목+내용
	 * @param				:	$bindData				삭제구분 / 검색어
	 * @param				:	$limitPeriod			limit 구간 갯수 / 1 사용
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function startNumLopecCharacter($sckKind = "", $bindData = "", $offSet = "") {
		$retQuery = "";
		try {
			$retQuery .= "	SELECT	";
			$retQuery .= "		IFNULL(LCHA_IDX, 0) AS CNT	";
			$retQuery .= "	FROM LOPEC_CHARACTER LCHA	";
			$retQuery .= $this->whereLopecCharacter($bindData, "lst", $sckKind);
			// offset
			if(isset($offSet) == true) {
				$retQuery 	.= "	ORDER BY LCHA_IDX DESC LIMIT ".$offSet.", 1	";
			}
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => startNumLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	listLopecCharacter
	 * description			: 	LOPEC_CHARACTER  목록 LIST
	 * @param				:	$schKind		검색 구분 - 제목 / 내용 / 제목+내용
	 * @param				:	$bindData		삭제구분 / 검색어
	 * @param				:	$startNum		limit 제한 번호
	 * @param				:	$listNum		페이지당 글 수
	 * @return				: 	$retQuery		full query
	 ********************************************************************************************************************** */
	function listLopecCharacter($sckKind = "", $bindData = "", $startNum = "", $listNum = "") {
		$retQuery = "";
		try {
			$retQuery .= "	SELECT 					";
			$retQuery .= $this->fieldSelectLopecCharacter();
			$retQuery .= "	FROM LOPEC_CHARACTER LCHA ";
			$retQuery .= $this->whereLopecCharacter($bindData, "lst", $sckKind);
			// limit 제한 번호
			if(isset($startNum) == true) {
				$retQuery 	.= "	AND LCHA_IDX  <= ".$startNum."	";
			}
			// 페이지당 글 수
			if(isset($listNum) == true) {
				$retQuery 	.= "	ORDER BY LCHA_IDX DESC LIMIT ".$listNum."	";
			}
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => listLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
	
	/* **********************************************************************************************************************
	 * function name		:	whereLopecCharacter
	 * description			: 	목록 query where
	 * @param				:	$bindData				삭제구분 / 그룹내부번호 / 회사(업체)내부번호
	 * 													검색구분 제목 T / 내용 C / 제목+내용 A / 검색어
	 * @return				: 	$retQuery			full query
	 ********************************************************************************************************************** */
	function whereLopecCharacter($bindData = "", $type = "", $sckKind = "") {
		//print_r( $bindData );
		$retQuery = "";
		try {
			$retQuery .= "	WHERE 1 = 1	";
			// 삭제여부
			if($bindData[0] != "") {
				$retQuery .= "	AND USE_TN = ?	";
			}
			switch($type) {
				case "lst" :
					if($bindData[1] != "") {
						$retQuery .= " ";
					}
				break;
				case "all" :
					if($bindData[1] != "") {
						$retQuery .= " ";
					}
				break;
				case "sel" :
					if($bindData[1] != "") {
						$retQuery .= "	AND LCHA_CD = ?	";
					}
				break;
				case "level_list" :
					if($bindData[1] != "") {
						$retQuery .= " ";
					}
				break;
				case "select_nickname" :
					if($bindData[1] != "") {
						$retQuery .= "	AND LCHA_CHARACTER_NICKNAME = ?	";
					}
				break;
			}
		} catch (Exception $e) {
			$logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecCharacter => whereLopecCharacter - try~catch error : ".$e.getCode()." | ".$e.getMessage()." | ";
			die($e->getMessage());
		}
		return $retQuery;
	}
} 
?>