<?php
include $_SERVER["DOCUMENT_ROOT"]."/applications/commons/common.comm.php";
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR KEY 인증 시스템</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }
        .input-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        button:disabled {
            background-color: #cccccc !important;
            color: #666666 !important;
            cursor: not-allowed;
            opacity: 0.7;
        }
        .btn-confirm {
            background-color: #4CAF50;
            color: white;
            flex: 1;
        }
        .btn-search {
            background-color: #2196F3;
            color: white;
            flex: 1;
        }
        .btn-refresh {
            background-color: #FFC107;
            color: #333;
            flex: 1;
        }
        .result-box {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .coin-display {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OCR KEY 인증 시스템</h1>
        
        <div class="input-group">
            <label for="ocr-key">OCR 베타 KEY</label>
            <input type="text" id="ocr-key" placeholder="KEY를 입력하세요">
        </div>
        
        <div class="button-group">
            <button class="btn-confirm" id="btn-confirm">KEY 등록</button>
            <button class="btn-search" id="btn-search">검색</button>
            <button class="btn-refresh" id="btn-refresh">코인 조회</button>
        </div>
        
        <div class="result-box">
            <p id="result-message">결과 메시지 영역</p>
            <div class="coin-display">
                남은 코인: <span id="coin-count">-</span>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            // 초기 버튼 상태 설정
            $("#btn-search").prop('disabled', true);
            $("#btn-refresh").prop('disabled', true);
            $("#btn-confirm").text("KEY 등록");
            
            // 페이지 로드시 IP 체크
            checkIpRegistration();
            
            // IP 등록 여부 확인 함수
            function checkIpRegistration() {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/applications/process/lopecOcr/",
                    data: {
                        atMode: "checkIp"
                    },
                    success: function(msg) {
                        if(msg.registered) {
                            // 이미 등록된 IP면 버튼 상태 변경
                            $("#btn-search").prop('disabled', false);
                            $("#btn-refresh").prop('disabled', false);
                            $("#btn-confirm").prop('disabled', true);
                            checkCoin(); // 코인 조회
                        } else {
                            // 등록되지 않은 IP면 KEY 등록만 활성화
                            $("#btn-search").prop('disabled', true);
                            $("#btn-refresh").prop('disabled', true);
                            $("#btn-confirm").prop('disabled', false);
                        }
                    },
                    error: function(request, status, error) {
                        console.log("request.status : " + request.status);
                        console.log("request.responseText : " + request.responseText);
                        console.log("request.error : " + request.error);
                    }
                });
            }
            
            // 확인 버튼 - KEY 인증
            $("#btn-confirm").click(function() {
                var ocrKey = $("#ocr-key").val();
                if(ocrKey == "") {
                    $("#result-message").text("KEY를 입력하세요.");
                    return;
                }
                
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/applications/process/lopecOcr/",
                    data: {
                        atMode: "verifyKey",
                        ocrKey: ocrKey
                    },
                    success: function(msg) {
                        $("#result-message").text(msg.message);
                        if(msg.result == "prcS") {
                            // KEY 등록 성공 시 버튼 상태 변경
                            $("#btn-search").prop('disabled', false);
                            $("#btn-refresh").prop('disabled', false);
                            $("#btn-confirm").prop('disabled', true);
                            checkCoin(); // 성공 시 코인 조회
                        }
                    },
                    error: function(request, status, error) {
                        $("#result-message").text("KEY 인증 오류가 발생했습니다.");
                        console.log("request.status : " + request.status);
                        console.log("request.responseText : " + request.responseText);
                        console.log("request.error : " + request.error);
                    }
                });
            });
            
            // 검색 버튼 - 코인 사용
            $("#btn-search").click(function() {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/applications/process/lopecOcr/",
                    data: {
                        atMode: "useCoin"
                    },
                    success: function(msg) {
                        $("#result-message").text(msg.message);
                        if(msg.result == "prcS" || msg.result == "prcZ") {
                            $("#coin-count").text(msg.coin);
                        }
                    },
                    error: function(request, status, error) {
                        $("#result-message").text("코인 사용 오류가 발생했습니다.");
                        console.log("request.status : " + request.status);
                        console.log("request.responseText : " + request.responseText);
                        console.log("request.error : " + request.error);
                    }
                });
            });
            
            // 코인 조회 버튼
            $("#btn-refresh").click(function() {
                checkCoin();
            });
            
            // 코인 조회 함수
            function checkCoin() {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/applications/process/lopecOcr/",
                    data: {
                        atMode: "checkCoin"
                    },
                    success: function(msg) {
                        if(msg.result == "prcS") {
                            $("#coin-count").text(msg.coin);
                        } else {
                            $("#coin-count").text("-");
                            $("#result-message").text(msg.message);
                        }
                    },
                    error: function(request, status, error) {
                        $("#result-message").text("코인 조회 오류가 발생했습니다.");
                        console.log("request.status : " + request.status);
                        console.log("request.responseText : " + request.responseText);
                        console.log("request.error : " + request.error);
                    }
                });
            }
        });
    </script>
</body>
</html>