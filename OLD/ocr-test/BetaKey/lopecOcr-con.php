<?php 
/* ****************************************************************************************************
 * file name    :   /applications/controllers/lopecOcr.php
 * developer    :   BlueFlame
 * description  :   lopecOcr controller
 **************************************************************************************************** */
?>
<?php 
/* **********************************************************************************************************************
 * class name           :   controllerLopecOcr
 * description          :   lopecOcr controller 관련 class
 ********************************************************************************************************************** */
class controllerLopecOcr extends coreProcess {
    
    /* **********************************************************************************************************************
     * function name        :   verifyOcrKey
     * description          :   Verify OCR KEY and update IP
     * @param               :   $bindData       Array(IP, REG_DATE, KEY)
     * @return              :   $retResult      S / F / N / A / D
     ********************************************************************************************************************** */
    function verifyOcrKey($bindData = "") {
        try {
            // Check if IP already has a key registered
            $modelLopecOcr = new modelLopecOcr();
            $queryCheckIp = $modelLopecOcr->selectLopecOcrByIp();
            $checkIpResult = $this->selectViewBindPdo($queryCheckIp, array($bindData[0]));
            
            // If this IP already has a registered key, return error
            if (!empty($checkIpResult)) {
                return "A"; // Already registered IP
            }
            
            // Check if KEY exists
            $queryCheck = $modelLopecOcr->selectLopecOcrByKey();
            $checkResult = $this->selectViewBindPdo($queryCheck, array($bindData[2]));
            
            // If KEY exists, check if it's already assigned to a different IP
            if (!empty($checkResult)) {
                if (!empty($checkResult['OCR_IP']) && $checkResult['OCR_IP'] != $bindData[0]) {
                    return "D"; // Duplicate key (already registered to different IP)
                }
                
                // Update IP
                $queryUpdate = $modelLopecOcr->updateLopecOcrIp();
                $updateResult = $this->processUpdatePdo($queryUpdate, $bindData);
                $retResult = $updateResult;
            } else {
                $retResult = "N"; // Key not found
            }
        } catch (Exception $e) {
            $retResult = "E";
            $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecOcr => verifyOcrKey - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retResult;
    }
    
    /* **********************************************************************************************************************
     * function name        :   useOcrCoin
     * description          :   Use OCR coin and update
     * @param               :   $bindData       Array(IP)
     * @return              :   $retResult      array(result, coin) / F / N
     ********************************************************************************************************************** */
    function useOcrCoin($bindData = "") {
        try {
            // Get current coin value
            $modelLopecOcr = new modelLopecOcr();
            $querySelect = $modelLopecOcr->selectLopecOcrByIp();
            $selectResult = $this->selectViewBindPdo($querySelect, $bindData);
            
            // If IP exists, update coin
            if (!empty($selectResult)) {
                $currentCoin = $selectResult['OCR_COIN'];
                
                // Check if coins are available
                if ($currentCoin > 0) {
                    $newCoin = $currentCoin - 1;
                    $updateBindData = array($newCoin, $bindData[0]);
                    $queryUpdate = $modelLopecOcr->updateLopecOcrCoin();
                    $updateResult = $this->processUpdatePdo($queryUpdate, $updateBindData);
                    
                    if ($updateResult == "S") {
                        $retResult = array("S", $newCoin);
                    } else {
                        $retResult = "F";
                    }
                } else {
                    $retResult = array("Z", 0); // Zero coins
                }
            } else {
                $retResult = "N"; // IP not found
            }
        } catch (Exception $e) {
            $retResult = "E";
            $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecOcr => useOcrCoin - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retResult;
    }
    
    /* **********************************************************************************************************************
     * function name        :   checkOcrCoin
     * description          :   Check remaining OCR coins
     * @param               :   $bindData       Array(IP)
     * @return              :   $retResult      array(result, coin) / N
     ********************************************************************************************************************** */
    function checkOcrCoin($bindData = "") {
        try {
            // Get current coin value
            $modelLopecOcr = new modelLopecOcr();
            $querySelect = $modelLopecOcr->selectLopecOcrByIp();
            $selectResult = $this->selectViewBindPdo($querySelect, $bindData);
            
            // If IP exists, return coin value
            if (!empty($selectResult)) {
                $currentCoin = $selectResult['OCR_COIN'];
                $retResult = array("S", $currentCoin);
            } else {
                $retResult = "N"; // IP not found
            }
        } catch (Exception $e) {
            $retResult = "E";
            $logMsg = " | ".date("Y-m-d H:i:s")." | controllerLopecOcr => checkOcrCoin - try~catch error : ".$e->getCode()." | ".$e->getMessage()." | ";
            die($e->getMessage());
        }
        return $retResult;
    }
}
?>