export default {
    async fetch(request, env) {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      };
  
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
      }
  
      try {
        // 요청의 Origin 헤더 확인
        const origin = request.headers.get('Origin') || request.headers.get('Referer');
        
        // 허용된 도메인 리스트 (쉼표로 구분된 문자열에서 배열로 변환)
        const allowedDomains = (env.ALLOWED_DOMAINS || '').split(',').map(domain => domain.trim());
        
        // 개발 모드 여부 확인 (환경 변수로 제어)
        const devMode = env.DEV_MODE === 'true' || env.DEV_MODE === '1';
        
        // 개발 환경 체크 (localhost 또는 127.0.0.1)
        const isLocalhost = origin && (
          origin.includes('localhost') || 
          origin.includes('127.0.0.1') || 
          origin.startsWith('http://192.168.')
        );
        
        // 허용된 도메인인지 확인
        const isAllowedOrigin = 
          (devMode && isLocalhost) || // 개발 모드일 때만 로컬호스트 허용
          (origin && (
            // ngrok 도메인 허용 (테스트용)
            origin.includes('clam-adapted-mink.ngrok-free.app') ||
            // 기존 허용 도메인 목록 검사
            allowedDomains.some(domain => 
              origin === domain || origin.endsWith('.' + domain) || origin.includes(domain)
            )
          ));
        
        // 허용되지 않은 도메인이면 접근 거부
        if (!isAllowedOrigin) {
          return new Response(JSON.stringify({
            error: '접근이 허용되지 않은 출처입니다.',
            devMode: devMode,
            isLocalhost: isLocalhost
          }), {
            status: 403,
            headers
          });
        }
        
        // CORS 헤더 업데이트 - 모든 도메인이 아닌 요청한 도메인만 허용
        headers['Access-Control-Allow-Origin'] = origin;
  
        // API 키 선택 로직
        let apiKeys;
        
        // 개발 모드일 경우 개발용 API 키 사용 (설정된 경우)
        if (devMode && env.DEV_API_KEY) {
          apiKeys = [env.DEV_API_KEY];
        } else {
          // 프로덕션 또는 개발용 키가 없는 경우 일반 API 키 사용
          apiKeys = [
            env.LOSTARK_API_1,
            env.LOSTARK_API_2,
            env.LOSTARK_API_3,
            env.LOSTARK_API_4,
            env.LOSTARK_API_5
          ].filter(key => key); // undefined나 빈 값 제거
        }
  
        if (apiKeys.length === 0) {
          throw new Error('설정된 API 키가 없습니다');
        }
  
        // 무작위로 하나의 키를 선택합니다
        const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  
        return new Response(JSON.stringify({
          apiKey: randomKey
        }), { headers });
  
      } catch (error) {
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 500,
          headers
        });
      }
    }
  };