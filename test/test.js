// API 엔드포인트 URL을 지정합니다
import fetch from 'node-fetch';
const nickname = "검은연주";  // 예시 닉네임
const encodedNickname = encodeURIComponent(nickname);  // 특수문자나 한글을 안전하게 인코딩
const url = `http://lopec-api-sever-env.eba-qkfmyhqb.ap-northeast-2.elasticbeanstalk.com/${encodedNickname}`;

async function getCharacterInfo() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("캐릭터 정보:", data);
    } catch (error) {
        console.error("에러 발생:", error);
    }
}

getCharacterInfo();