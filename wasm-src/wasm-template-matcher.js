// wasm-template-matcher.js 
// WebAssembly 모듈과 상호작용하는 JavaScript 코드 - 성능 최적화 버전

class WasmTemplateMatcher {
    constructor() {
      this.isReady = false;
      this.module = null;
      this.matcher = null;
      this.cv = null;
      
      // 워커 풀 관리를 위한 변수 추가
      this.workerPool = null;
      this.workerCount = navigator.hardwareConcurrency || 4; // CPU 코어 수에 맞춤
      this.processingQueue = []; // 처리 대기 작업 큐
    }
  
    // 초기화
    async initialize() {
      try {
        // WASM 모듈 임포트
        const TemplateMatcherModule = await import('../lib/wasm/template-matcher.js');
        this.module = await TemplateMatcherModule.default();
        this.matcher = new this.module.TemplateMatcher();
        
        // 전역 함수 정의 - WASM에서 호출할 수 있도록
        window.findTemplateFromWasm = this.findTemplateWithOpenCV.bind(this);
        window.cropImageFromWasm = this.cropImageRegion.bind(this);
        
        // OpenCV.js 로드
        await this.loadOpenCV();
        
        // 워커 풀 초기화
        await this.initializeWorkerPool();
        
        this.isReady = true;
        return true;
      } catch (error) {
        console.error('WASM 모듈 초기화 실패:', error);
        return false;
      }
    }
  
    // 워커 풀 초기화
    async initializeWorkerPool() {
      this.workerPool = [];
      const workerInitPromises = [];

      // 여러 워커 생성
      for (let i = 0; i < this.workerCount; i++) {
        const worker = new Worker('template-matching-worker.js');
        
        // 워커 초기화 Promise 생성
        const initPromise = new Promise((resolve) => {
          worker.onmessage = (e) => {
            if (e.data.type === 'initialized') {
              // 워커가 초기화되면 이벤트 핸들러 변경
              worker.onmessage = this.handleWorkerMessage.bind(this, i);
              resolve();
            }
          };
        });
        
        // 워커 초기화 메시지 전송
        worker.postMessage({ type: 'initialize' });
        
        this.workerPool.push({
          worker: worker,
          busy: false
        });
        
        workerInitPromises.push(initPromise);
      }
      
      // 모든 워커가 초기화될 때까지 대기
      await Promise.all(workerInitPromises);
      console.log(`${this.workerCount}개 워커 초기화 완료`);
    }
    
    // 워커 메시지 처리
    handleWorkerMessage(workerId, event) {
      const workerInfo = this.workerPool[workerId];
      
      // 워커의 결과 가져오기
      const { type, taskId, results, error } = event.data;
      
      if (type === 'error') {
        console.error(`워커 ${workerId} 오류:`, error);
      }
      
      // 작업 ID를 사용하여 콜백 찾기
      const taskInfo = this.processingQueue.find(task => task.id === taskId);
      
      if (taskInfo) {
        if (type === 'complete') {
          // 성공 콜백 호출
          taskInfo.resolve(results);
        } else if (type === 'error') {
          // 오류 콜백 호출
          taskInfo.reject(new Error(error));
        }
        
        // 처리 완료된 작업 제거
        this.processingQueue = this.processingQueue.filter(task => task.id !== taskId);
      }
      
      // 워커 상태 업데이트
      workerInfo.busy = false;
      
      // 대기 중인 작업 있으면 처리
      this.processNextTask();
    }
    
    // 다음 작업 처리
    processNextTask() {
      // 대기 중인 작업이 없으면 종료
      if (this.processingQueue.length === 0) return;
      
      // 사용 가능한 워커 찾기
      const availableWorkerIndex = this.workerPool.findIndex(info => !info.busy);
      if (availableWorkerIndex === -1) return; // 사용 가능한 워커 없음
      
      // 대기 중인 작업 중 아직 시작되지 않은 첫 번째 작업 찾기
      const pendingTaskIndex = this.processingQueue.findIndex(task => !task.started);
      if (pendingTaskIndex === -1) return; // 대기 중인 작업 없음
      
      const task = this.processingQueue[pendingTaskIndex];
      const workerInfo = this.workerPool[availableWorkerIndex];
      
      // 작업 시작 표시
      task.started = true;
      workerInfo.busy = true;
      
      // 워커에 작업 전송
      workerInfo.worker.postMessage({
        type: task.type,
        taskId: task.id,
        sourceImage: task.sourceImage,
        templates: task.templates,
        threshold: task.threshold
      });
    }
    
    // 병렬 일괄 처리로 템플릿 매칭 (정확도는 유지하면서 성능만 개선)
    async matchTemplatesBatch(sourceImage, templates, threshold = 0.7) {
      if (!this.isReady) {
        throw new Error('WASM 모듈이 초기화되지 않았습니다.');
      }
      
      // 템플릿이 없으면 빈 결과 반환
      if (!templates || templates.length === 0) {
        return [];
      }
      
      // 작업 ID 생성
      const taskId = Date.now() + Math.random().toString(36).substr(2, 9);
      
      // 작업 생성
      const task = {
        id: taskId,
        type: 'matchTemplates',
        sourceImage: sourceImage,
        templates: templates,
        threshold: threshold,
        started: false
      };
      
      // 작업 큐에 추가
      const taskPromise = new Promise((resolve, reject) => {
        task.resolve = resolve;
        task.reject = reject;
      });
      
      this.processingQueue.push(task);
      
      // 다음 작업 처리 시작
      this.processNextTask();
      
      // 작업 완료 대기
      return taskPromise;
    }

    // OpenCV.js 로드
    async loadOpenCV() {
      return new Promise((resolve) => {
        if (window.cv && window.cv.getBuildInformation) {
          this.cv = window.cv;
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://docs.opencv.org/4.7.0/opencv.js';
        script.async = true;
        script.onload = () => {
          // OpenCV 초기화 대기
          const waitForCV = () => {
            if (window.cv && window.cv.getBuildInformation) {
              this.cv = window.cv;
              resolve();
            } else {
              setTimeout(waitForCV, 10);
            }
          };
          waitForCV();
        };
        document.body.appendChild(script);
      });
    }
  
    // 템플릿 매칭 수행 (OpenCV.js 사용)
    findTemplateWithOpenCV(sourceImageData, templateImageData, threshold) {
      // 이 함수는 WASM에서 호출됩니다
      try {
        if (!this.cv) {
          throw new Error('OpenCV가 아직 초기화되지 않았습니다');
        }

        // 소스 이미지와 템플릿 이미지를 Mat 객체로 변환
        const source = this.imageDataToMat(sourceImageData);
        const template = this.imageDataToMat(templateImageData);

        // 결과 이미지 생성
        const result = new this.cv.Mat();
        const mask = new this.cv.Mat();

        // 템플릿 매칭 수행
        this.cv.matchTemplate(source, template, result, this.cv.TM_CCOEFF_NORMED, mask);

        // 최대값 위치 찾기
        const minMax = this.cv.minMaxLoc(result);
        const maxPoint = minMax.maxLoc;
        const maxValue = minMax.maxVal;

        // 임계값보다 높으면 매칭 결과 반환
        if (maxValue >= threshold) {
          const match = {
            x: maxPoint.x,
            y: maxPoint.y,
            width: template.cols,
            height: template.rows,
            confidence: maxValue
          };

          // 메모리 정리
          source.delete();
          template.delete();
          result.delete();
          mask.delete();

          return match;
        }

        // 메모리 정리
        source.delete();
        template.delete();
        result.delete();
        mask.delete();

        return null; // 임계값 이하면 매칭 실패
      } catch (error) {
        console.error('템플릿 매칭 오류:', error);
        return null;
      }
    }
  
    // 이미지 크롭
    cropImageRegion(imageData, x, y, width, height) {
      // 이 함수는 WASM에서 호출됩니다
      try {
        if (!this.cv) {
          throw new Error('OpenCV가 아직 초기화되지 않았습니다');
        }

        // 이미지를 Mat 객체로 변환
        const source = this.imageDataToMat(imageData);

        // 크롭 영역 설정
        const rect = new this.cv.Rect(x, y, width, height);
        
        // 이미지 크롭
        const cropped = source.roi(rect);

        // 크롭된 이미지를 Canvas로 변환
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        this.cv.imshow(canvas, cropped);

        // 메모리 정리
        source.delete();
        cropped.delete();

        // 결과 반환
        return {
          canvas: canvas,
          dataURL: canvas.toDataURL('image/png'),
          width: width,
          height: height
        };
      } catch (error) {
        console.error('이미지 크롭 오류:', error);
        return null;
      }
    }
    
    // 템플릿 배치 매칭 - WASM 버전 사용 (기존 matchTemplateBatch 활용)
    async fastMatchTemplates(sourceImage, templates, threshold = 0.7, timeLimit = 1000) {
      if (!this.isReady) {
        throw new Error('WASM 모듈이 초기화되지 않았습니다.');
      }
      
      // 시작 시간 기록
      const startTime = performance.now();
      
      // 빈 템플릿 확인
      if (!templates || templates.length === 0) {
        return [];
      }
      
      // 최대 처리 시간 내에 처리할 수 있는 데이터 분할
      let allResults = [];
      const batchSize = Math.min(50, Math.ceil(templates.length / this.workerCount)); // 워커당 50개로 제한
      
      try {
        // 이미지 데이터 준비
        let sourceImageData;
        if (sourceImage instanceof ImageData) {
          sourceImageData = sourceImage;
        } else if (sourceImage instanceof HTMLImageElement || sourceImage instanceof HTMLCanvasElement) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = sourceImage.width || sourceImage.naturalWidth;
          canvas.height = sourceImage.height || sourceImage.naturalHeight;
          ctx.drawImage(sourceImage, 0, 0);
          sourceImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } else {
          throw new Error('지원되지 않는 이미지 형식입니다');
        }
        
        // 작업 시작
        for (let i = 0; i < templates.length; i += batchSize) {
          // 시간 제한 확인
          if (performance.now() - startTime > timeLimit) {
            console.log(`시간 제한(${timeLimit}ms)에 도달하여 처리 중단`);
            break;
          }
          
          // 배치 생성
          const batch = templates.slice(i, i + batchSize);
          
          // WASM 매처의 배치 처리 함수 사용
          const batchResults = await this.matcher.matchTemplateBatch(sourceImageData, batch, threshold);
          
          // 결과 수집
          if (batchResults && batchResults.length > 0) {
            for (let j = 0; j < batchResults.length; j++) {
              allResults.push(batchResults[j]);
            }
          }
          
          // 약간의 지연으로 UI 스레드 차단 방지
          await new Promise(r => setTimeout(r, 0));
        }
        
        // 중복 결과 필터링 (같은 영역에 여러 매칭 제거)
        allResults = this.filterDuplicateResults(allResults);
        
        // 신뢰도 기준 정렬
        allResults.sort((a, b) => b.match.confidence - a.match.confidence);
        
        return allResults;
      } catch (error) {
        console.error('템플릿 배치 매칭 오류:', error);
        return allResults; // 오류 발생해도 지금까지 처리된 결과 반환
      }
    }
    
    // 중복 결과 필터링
    filterDuplicateResults(results) {
      if (!results || results.length <= 1) return results;
      
      // 이미 처리된 결과 인덱스 추적
      const processed = new Set();
      const filtered = [];
      
      // 신뢰도 기준 정렬
      const sorted = [...results].sort((a, b) => b.match.confidence - a.match.confidence);
      
      for (let i = 0; i < sorted.length; i++) {
        if (processed.has(i)) continue;
        
        const current = sorted[i];
        filtered.push(current);
        processed.add(i);
        
        // 현재 결과와 가까운 다른 결과 찾기
        for (let j = i + 1; j < sorted.length; j++) {
          if (processed.has(j)) continue;
          
          const other = sorted[j];
          
          // 두 결과의 중심점 간 거리 계산
          const currentCenter = {
            x: current.match.x + current.match.width / 2,
            y: current.match.y + current.match.height / 2
          };
          
          const otherCenter = {
            x: other.match.x + other.match.width / 2,
            y: other.match.y + other.match.height / 2
          };
          
          const distance = Math.sqrt(
            Math.pow(currentCenter.x - otherCenter.x, 2) +
            Math.pow(currentCenter.y - otherCenter.y, 2)
          );
          
          // 거리가 충분히 가까우면 중복으로 간주
          const minDimension = Math.min(current.match.width, current.match.height);
          if (distance < minDimension * 0.5) {
            processed.add(j);
          }
        }
      }
      
      return filtered;
    }
  
    // 추가 유틸리티 함수 - ImageData를 Mat으로 변환
    imageDataToMat(imageData) {
      if (imageData instanceof ImageData) {
        return this.cv.matFromImageData(imageData);
      } else if (imageData instanceof HTMLImageElement || 
                 imageData instanceof HTMLCanvasElement) {
        // 이미지 또는 캔버스인 경우 처리
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageData.width || imageData.naturalWidth;
        canvas.height = imageData.height || imageData.naturalHeight;
        ctx.drawImage(imageData, 0, 0);
        return this.cv.imread(canvas);
      } else {
        throw new Error('지원되지 않는 이미지 형식입니다');
      }
    }
}
  
export default WasmTemplateMatcher;