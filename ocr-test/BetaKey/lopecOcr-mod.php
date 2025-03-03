<?php
/* ****************************************************************************************************
 * file name    :   /applications/model/lopecOcr.php
 * developer    :   BlueFlame
 * description  :   LOPEC_OCR_KEY query
 **************************************************************************************************** */
?>
<?php 
/* **********************************************************************************************************************
 * class name           :   modelLopecOcr
 * description          :   LOPEC_OCR_KEY query 관련 class
 ********************************************************************************************************************** */
class modelLopecOcr extends coreUnion {
    
    /* **********************************************************************************************************************
     * function name        :   fieldSelectLopecOcr
     * description          :   LOPEC_OCR_KEY field - list / view 사용
     * @param               :
     * @return              :   $retQuery           full query
     ********************************************************************************************************************** */
    function fieldSelectLopecOcr() {
        $retQuery = "";
        try {
            $retQuery .= "   OCR_IDX      "; // bigint    OCR키 일련번호
            $retQuery .= " , OCR_IP       "; // varchar(50)   사용자 IP
            $retQuery .= " , OCR_KEY      "; // varchar(100)  OCR 베타 키
            $retQuery .= " , OCR_COIN     "; // int           남은 코인 수
            $retQuery .= " , OCR_REG_DATE "; // varchar(20)   등록일시
        } catch (Exception $e) {
            $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecOcr => fieldSelectLopecOcr - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retQuery;
    }
    
    /* **********************************************************************************************************************
     * function name        :   updateLopecOcrIp
     * description          :   Update user IP by OCR KEY
     * @param               :
     * @return              :   $retQuery           full query
     ********************************************************************************************************************** */
    function updateLopecOcrIp() {
        $retQuery = "";
        try {
            $retQuery   .=  " UPDATE LOPEC_OCR_KEY ";
            $retQuery   .=  " SET OCR_IP = ?, OCR_REG_DATE = ? ";
            $retQuery   .=  " WHERE OCR_KEY = ? ";
        } catch (Exception $e) {
            $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecOcr => updateLopecOcrIp - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retQuery;
    }
    
    /* **********************************************************************************************************************
     * function name        :   selectLopecOcrByKey
     * description          :   Select OCR record by KEY
     * @param               :
     * @return              :   $retQuery           full query
     ********************************************************************************************************************** */
    function selectLopecOcrByKey() {
        $retQuery = "";
        try {
            $retQuery   .=  " SELECT ";
            $retQuery   .=  $this->fieldSelectLopecOcr();
            $retQuery   .=  " FROM LOPEC_OCR_KEY ";
            $retQuery   .=  " WHERE OCR_KEY = ? ";
        } catch (Exception $e) {
            $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecOcr => selectLopecOcrByKey - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retQuery;
    }
    
    /* **********************************************************************************************************************
     * function name        :   selectLopecOcrByIp
     * description          :   Select OCR record by IP
     * @param               :
     * @return              :   $retQuery           full query
     ********************************************************************************************************************** */
    function selectLopecOcrByIp() {
        $retQuery = "";
        try {
            $retQuery   .=  " SELECT ";
            $retQuery   .=  $this->fieldSelectLopecOcr();
            $retQuery   .=  " FROM LOPEC_OCR_KEY ";
            $retQuery   .=  " WHERE OCR_IP = ? ";
        } catch (Exception $e) {
            $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecOcr => selectLopecOcrByIp - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retQuery;
    }
    
    /* **********************************************************************************************************************
     * function name        :   updateLopecOcrCoin
     * description          :   Update coin value by IP
     * @param               :
     * @return              :   $retQuery           full query
     ********************************************************************************************************************** */
    function updateLopecOcrCoin() {
        $retQuery = "";
        try {
            $retQuery   .=  " UPDATE LOPEC_OCR_KEY ";
            $retQuery   .=  " SET OCR_COIN = ? ";
            $retQuery   .=  " WHERE OCR_IP = ? ";
        } catch (Exception $e) {
            $logMsg = " | ".date("Y-m-d H:i:s")." | modelLopecOcr => updateLopecOcrCoin - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retQuery;
    }
}
?>