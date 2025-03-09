/**
 * OpenCV 기반 템플릿 매칭 및 이미지 크롭 모듈 (다중 모드 지원)
 * 여러 크롭 모드를 지원하여 같은 템플릿으로 서로 다른 영역을 추출할 수 있습니다.
 */
class OpenCVTemplateImageCropper {
  constructor() {
    this.templates = {}; // 템플릿 이미지 저장 객체
    this.cropRegions = {}; // 크롭 영역 설정 저장 객체 (모드별 구성)
    this.debugMode = false; // 디버그 모드 플래그
    this.isOpenCVLoaded = false; // OpenCV 로드 여부
    this.currentMode = 'default'; // 기본 모드 설정
    this.availableModes = ['default']; // 사용 가능한 모드 목록\
    this.characterMapping = {}; // 문자 매핑 데이터 저장 객체
    this.characterTemplates = {}; // 문자 인식용 템플릿 이미지 저장
    
  }

  /**
   * 모듈 초기화
   * @param {Object} options - 초기화 옵션
   * @param {Object} options.templates - 템플릿 정보 객체
   * @param {boolean} options.debug - 디버그 모드 활성화 여부
   * @param {string} options.opencvPath - OpenCV.js 경로 (기본값: 'https://docs.opencv.org/4.7.0/opencv.js')
   * @param {Array<string>} options.modes - 사용할 모드 목록 (기본값: ['default'])
   * @param {string} options.defaultMode - 기본 모드 (기본값: 'default')
   * @returns {Promise<boolean>} 초기화 성공 여부
   */
  async initialize(options = {}) {
    try {
      this.debugMode = !!options.debug;
      
      // 모드 설정
      this.availableModes = options.modes || ['default'];
      this.currentMode = options.defaultMode || 'default';
      
      if (!this.availableModes.includes(this.currentMode)) {
        this.availableModes.push(this.currentMode);
      }
      
      if (this.debugMode) {
        console.log('OpenCV 템플릿 매칭 모듈 초기화 중...');
        console.log(`사용 가능한 모드: ${this.availableModes.join(', ')}`);
        console.log(`현재 모드: ${this.currentMode}`);
      }
      
      // OpenCV.js 로드
      await this.loadOpenCV(options.opencvPath || 'https://docs.opencv.org/4.7.0/opencv.js');
      
      // 템플릿 로드
      await this.loadTemplates(options.templates || {});
      
      if (this.debugMode) {
        console.log('OpenCV 템플릿 매칭 모듈 초기화 완료');
      }
      
      return true;
    } catch (error) {
      console.error('OpenCV 템플릿 매칭 모듈 초기화 오류:', error);
      return false;
    }
  }

  /**
   * 현재 사용 중인 모드 변경
   * @param {string} mode - 설정할 모드
   * @returns {boolean} 모드 변경 성공 여부
   */
  setMode(mode) {
    if (!this.availableModes.includes(mode)) {
      console.error(`지원하지 않는 모드: ${mode}`);
      return false;
    }
    
    this.currentMode = mode;
    
    if (this.debugMode) {
      console.log(`모드 변경: ${mode}`);
    }
    
    return true;
  }

  /**
   * 사용 가능한 모드 목록 반환
   * @returns {Array<string>} 모드 목록
   */
  getAvailableModes() {
    return [...this.availableModes];
  }

  /**
   * 현재 모드 반환
   * @returns {string} 현재 모드
   */
  getCurrentMode() {
    return this.currentMode;
  }

  /**
   * OpenCV.js 라이브러리 로드
   * @param {string} opencvPath - OpenCV.js 경로
   * @returns {Promise<void>}
   */
  loadOpenCV(opencvPath) {
    return new Promise((resolve, reject) => {
      if (window.cv) {
        this.isOpenCVLoaded = true;
        if (this.debugMode) {
          console.log('OpenCV가 이미 로드되어 있습니다.');
        }
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', opencvPath);
      
      // OpenCV.js가 로드되면 호출되는 이벤트
      script.onload = () => {
        // OpenCV.js 로드 완료 후 대기
        const waitForCV = () => {
          if (window.cv && window.cv.Mat) {
            this.isOpenCVLoaded = true;
            if (this.debugMode) {
              console.log('OpenCV 로드 완료');
            }
            resolve();
          } else {
            // 100ms 후 다시 확인
            setTimeout(waitForCV, 100);
          }
        };
        
        waitForCV();
      };
      
      script.addEventListener('error', () => {
        reject(new Error('OpenCV.js 로드 실패'));
      });
      
      document.body.appendChild(script);
    });
  }

  /**
   * 템플릿 이미지 로드
   * @param {Object} templates - 템플릿 정보 객체
   * @returns {Promise<void>}
   */
  async loadTemplates(templates) {
    this.templates = {};
    this.cropRegions = {};
    
    const loadPromises = [];
    
    for (const [key, templateInfo] of Object.entries(templates)) {
      if (this.debugMode) {
        console.log(`템플릿 로드 중: ${key}`);
      }
      
      loadPromises.push(
        this.loadTemplateImage(templateInfo.url)
          .then(image => {
            this.templates[key] = image;
            
            // 모든 모드에 대한 크롭 영역 설정
            this.cropRegions[key] = {};
            
            // 각 모드별 크롭 영역 설정
            this.availableModes.forEach(mode => {
              const modeKey = mode === 'default' ? 'cropRegion' : `cropRegion_${mode}`;
              
              // 해당 모드의 크롭 영역이 있으면 사용, 없으면 기본 크롭 영역 사용
              this.cropRegions[key][mode] = templateInfo[modeKey] || templateInfo.cropRegion;
            });
            
            if (this.debugMode) {
              console.log(`템플릿 로드 완료: ${key} (${image.width}x${image.height})`);
              console.log(`크롭 영역 설정:`, this.cropRegions[key]);
            }
          })
      );
    }
    
    await Promise.all(loadPromises);
    
    if (this.debugMode) {
      console.log(`${Object.keys(templates).length}개 템플릿 로드 완료`);
    }
  }


  /**
   * 문자 매핑 데이터 로드 및 처리
   * @param {Object|string} mapping - 매핑 데이터 객체 또는 JSON 파일 경로
   * @param {string} baseImagePath - 이미지 파일 기본 경로 (선택사항)
   * @returns {Promise<boolean>} 로딩 성공 여부
   */
  async loadCharacterMapping(mapping, baseImagePath = '') {
    try {
      this.characterMapping = {};

      // JSON 문자열이나 파일 경로인 경우 객체로 변환
      let mappingData = mapping;
      if (typeof mapping === 'string') {
        // 파일에서 로드
        const response = await fetch(mapping);
        mappingData = await response.json();
      }

      if (this.debugMode) {
        console.log(`문자 매핑 데이터 로드 중... 항목 수: ${Object.keys(mappingData).length}`);
      }

      // 경로 정규화 함수
      const normalizePath = (path) => {
        // 윈도우 경로를 웹 호환 경로로 변환
        return path.replace(/\\/g, '/').replace(/^\.\//, baseImagePath);
      };

      // 매핑 데이터 처리
      for (const [key, data] of Object.entries(mappingData)) {
        this.characterMapping[key] = {
          character: data.character,
          filePath: normalizePath(data.file_path)
        };
      }

      if (this.debugMode) {
        console.log(`문자 매핑 데이터 로드 완료: ${Object.keys(this.characterMapping).length}개 항목`);
      }

      return true;
    } catch (error) {
      console.error('문자 매핑 데이터 로드 오류:', error);
      return false;
    }
  }

  /**
   * 문자 인식용 템플릿 이미지 로드
   * @param {number} batchSize - 한 번에 로드할 템플릿 수 (기본값: 50)
   * @param {Function} progressCallback - 진행 상황 콜백 함수
   * @returns {Promise<number>} 로드된 템플릿 수
   */
  async loadCharacterTemplates(batchSize = 50, progressCallback = null) {
    if (!this.characterMapping) {
      throw new Error('문자 매핑 데이터가 로드되지 않았습니다. loadCharacterMapping()을 먼저 호출하세요.');
    }

    // 템플릿 저장소 초기화
    this.characterTemplates = {};

    const total = Object.keys(this.characterMapping).length;
    let loaded = 0;
    let errors = 0;

    if (this.debugMode) {
      console.log(`문자 템플릿 이미지 로드 시작: 총 ${total}개`);
    }

    // 배치 단위로 처리
    const keys = Object.keys(this.characterMapping);

    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);

      // 병렬 로드
      await Promise.allSettled(
        batch.map(async (key) => {
          try {
            const mapping = this.characterMapping[key];

            // 이미지 로드
            const img = await this.loadTemplateImage(mapping.filePath);

            // 템플릿 저장
            this.characterTemplates[key] = {
              image: img,
              character: mapping.character
            };

            loaded++;
          } catch (error) {
            if (this.debugMode) {
              console.error(`템플릿 로드 실패 (ID: ${key}):`, error);
            }
            errors++;
          }
        })
      );

      // 진행 상황 콜백
      if (progressCallback && typeof progressCallback === 'function') {
        progressCallback({
          total,
          loaded,
          errors,
          progress: (loaded / total) * 100
        });
      }

      if (this.debugMode) {
        console.log(`템플릿 로드 진행: ${loaded}/${total} (${((loaded / total) * 100).toFixed(2)}%)`);
      }
    }

    if (this.debugMode) {
      console.log(`템플릿 로드 완료: ${loaded}개 성공, ${errors}개 실패`);
    }

    return loaded;
  }

  
  /**
   * 템플릿 이미지 개별 로드
   * @param {string} url - 이미지 URL
   * @returns {Promise<HTMLImageElement>}
   */
  loadTemplateImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`템플릿 이미지 로드 실패: ${url}`));
      img.src = url;
    });
  }

  /**
   * 클립보드에서 이미지 가져오기
   * @returns {Promise<Blob>} 이미지 Blob
   */
  async getImageFromClipboard() {
    try {
      if (this.debugMode) {
        console.log('클립보드 접근 시도 중...');
      }
      
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('현재 브라우저에서 클립보드 이미지 접근을 지원하지 않습니다.');
      }

      const items = await navigator.clipboard.read();
      
      if (this.debugMode) {
        console.log(`클립보드 항목 수: ${items.length}`);
      }
      
      for (const item of items) {
        if (this.debugMode) {
          console.log('클립보드 항목 타입:', item.types);
        }
        
        if (item.types.some(type => type.startsWith('image/'))) {
          const imageType = item.types.find(type => type.startsWith('image/'));
          const blob = await item.getType(imageType);
          
          if (this.debugMode) {
            console.log(`이미지 블롭 가져옴: ${blob.size} 바이트`);
          }
          
          return blob;
        }
      }
      
      throw new Error('클립보드에 이미지가 없습니다.');
    } catch (error) {
      console.error('클립보드 접근 오류:', error);
      throw error;
    }
  }

  /**
   * 이미지를 OpenCV Mat 객체로 변환
   * @param {HTMLImageElement|HTMLCanvasElement} imgElem - 이미지 요소
   * @returns {cv.Mat} OpenCV Mat 객체
   */
  imageToMat(imgElem) {
    const mat = cv.imread(imgElem);
    return mat;
  }

  /**
   * Blob을 HTMLImageElement로 변환
   * @param {Blob} blob - 이미지 Blob
   * @returns {Promise<HTMLImageElement>}
   */
  async blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * 템플릿 매칭 수행 (OpenCV 사용)
   * @param {HTMLImageElement} sourceImage - 소스 이미지
   * @param {HTMLImageElement} templateImage - 템플릿 이미지
   * @param {number} threshold - 매칭 임계값 (기본값: 0.7)
   * @returns {Object|null} 매칭 결과 또는 null
   */
  findTemplateWithOpenCV(sourceImage, templateImage, threshold = 0.7) {
    if (!this.isOpenCVLoaded) {
      throw new Error('OpenCV가 로드되지 않았습니다.');
    }

    if (this.debugMode) {
      console.log(`OpenCV 템플릿 매칭 시작`);
      console.time('templateMatching');
    }

    try {
      // 이미지를 OpenCV Mat으로 변환
      const sourceMat = this.imageToMat(sourceImage);
      const templateMat = this.imageToMat(templateImage);
      
      // 결과 행렬 생성
      const resultMat = new cv.Mat();
      const mask = new cv.Mat(); // 마스크 없음
      
      // 템플릿 매칭 수행 (TM_CCOEFF_NORMED 방식 사용)
      cv.matchTemplate(sourceMat, templateMat, resultMat, cv.TM_CCOEFF_NORMED, mask);
      
      // 최대값 및 위치 찾기
      const result = cv.minMaxLoc(resultMat);
      
      // 최대값 추출 (TM_CCOEFF_NORMED에서는 최대값이 최적 매칭)
      const { maxVal, maxLoc } = result;
      
      // 메모리 해제
      sourceMat.delete();
      templateMat.delete();
      resultMat.delete();
      mask.delete();
      
      if (this.debugMode) {
        console.timeEnd('templateMatching');
      }
      
      if (maxVal >= threshold) {
        const match = {
          x: maxLoc.x,
          y: maxLoc.y,
          width: templateImage.width,
          height: templateImage.height,
          confidence: maxVal
        };
        
        if (this.debugMode) {
          console.log(`템플릿 매칭 성공: 위치(${match.x}, ${match.y}), 신뢰도: ${match.confidence.toFixed(4)}`);
        }
        
        return match;
      } else {
        if (this.debugMode) {
          console.log(`템플릿 매칭 실패: 최대 신뢰도 ${maxVal.toFixed(4)}가 임계값 ${threshold} 미만`);
        }
        
        return null;
      }
    } catch (error) {
      console.error('OpenCV 템플릿 매칭 오류:', error);
      throw error;
    }
  }




  /**
   * 이미지에서 문자 템플릿 매칭 수행
   * @param {HTMLImageElement|HTMLCanvasElement} image - 분석할 이미지
   * @param {number} threshold - 매칭 임계값 (기본값: 0.7)
   * @returns {Array<Object>} 매칭 결과 배열 (신뢰도 내림차순 정렬)
   */
  findCharactersInImage(image, threshold = 0.7) {
    if (!this.characterTemplates || Object.keys(this.characterTemplates).length === 0) {
      throw new Error('문자 템플릿이 로드되지 않았습니다. loadCharacterTemplates()를 먼저 호출하세요.');
    }

    if (this.debugMode) {
      console.log(`문자 인식 시작: 템플릿 수 ${Object.keys(this.characterTemplates).length}개`);
      console.time('characterRecognition');
    }

    try {
      const results = [];

      // 모든 템플릿으로 매칭 시도
      for (const [key, template] of Object.entries(this.characterTemplates)) {
        try {
          const match = this.findTemplateWithOpenCV(image, template.image, threshold);

          if (match) {
            results.push({
              id: key,
              character: template.character,
              confidence: match.confidence,
              position: {
                x: match.x,
                y: match.y,
                width: match.width,
                height: match.height
              }
            });
          }
        } catch (error) {
          if (this.debugMode) {
            console.warn(`템플릿 매칭 실패 (ID: ${key}):`, error);
          }
        }
      }

      // 신뢰도 기준 내림차순 정렬
      const sortedResults = results.sort((a, b) => b.confidence - a.confidence);

      if (this.debugMode) {
        console.timeEnd('characterRecognition');
        console.log(`문자 인식 결과: ${sortedResults.length}개 매칭 (임계값: ${threshold})`);
      }

      return sortedResults;
    } catch (error) {
      console.error('문자 인식 오류:', error);
      throw error;
    }
  }

  /**
   * 크롭된 이미지에서 문자 인식 수행
   * @param {Object} croppedResult - cropFromClipboard()의 결과
   * @param {number} threshold - 매칭 임계값 (기본값: 0.7)
   * @returns {Promise<Array<Object>>} 매칭된 문자 결과
   */
  async recognizeCharactersInCroppedImage(croppedResult, threshold = 0.7) {
    try {
      // 이미 ImageElement나 Canvas가 있으면 사용
      const image = croppedResult.canvas || await this.blobToImage(
        await fetch(croppedResult.dataURL).then(r => r.blob())
      );

      return this.findCharactersInImage(image, threshold);
    } catch (error) {
      console.error('크롭된 이미지 문자 인식 오류:', error);
      throw error;
    }
  }






















  /**
   * 주어진 좌표에서 상대적 크롭 영역 계산
   * @param {Object} match - 템플릿 매칭 결과
   * @param {Object} cropConfig - 크롭 영역 설정
   * @param {number} imageWidth - 원본 이미지 너비
   * @param {number} imageHeight - 원본 이미지 높이
   * @returns {Object} 크롭 영역 좌표
   */
  calculateCropRegion(match, cropConfig, imageWidth, imageHeight) {
    // 템플릿 위치 기준 상대적 좌표 계산
    const left = Math.max(0, match.x + cropConfig.offsetX);
    const top = Math.max(0, match.y + cropConfig.offsetY);
    const right = Math.min(imageWidth, left + cropConfig.width);
    const bottom = Math.min(imageHeight, top + cropConfig.height);
    
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }

  /**
   * 이미지에서 특정 영역 크롭
   * @param {HTMLImageElement} image - 원본 이미지
   * @param {Object} region - 크롭 영역 좌표
   * @returns {Object} 크롭된 이미지 정보 (캔버스, 이미지데이터, 데이터URL 포함)
   */
  cropImageRegion(image, region) {
    // 크롭 영역 추출
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = region.width;
    canvas.height = region.height;
    
    ctx.drawImage(
      image, 
      region.x, region.y, region.width, region.height,
      0, 0, region.width, region.height
    );
    
    const imageData = ctx.getImageData(0, 0, region.width, region.height);
    const dataURL = canvas.toDataURL('image/png');
    
    return {
      canvas,
      imageData,
      dataURL,
      region
    };
  }

  /**
   * 클립보드 이미지에서 템플릿 매칭 및 크롭 수행
   * @param {string} templateKey - 사용할 템플릿 키
   * @param {string} [mode] - 사용할 크롭 모드 (생략 시 현재 설정된 모드 사용)
   * @returns {Promise<Object>} 크롭 결과
   */
  async cropFromClipboard(templateKey, mode) {
    try {
      // 모드 설정 (파라미터로 모드가 전달되지 않으면 현재 모드 사용)
      const cropMode = mode || this.currentMode;
      
      if (!this.availableModes.includes(cropMode)) {
        throw new Error(`지원하지 않는 모드입니다: ${cropMode}`);
      }
      
      if (!this.isOpenCVLoaded) {
        throw new Error('OpenCV가 로드되지 않았습니다. 먼저 initialize()를 호출하세요.');
      }
      
      if (!this.templates[templateKey]) {
        throw new Error(`템플릿을 찾을 수 없습니다: ${templateKey}`);
      }
      
      // 모드에 맞는 크롭 설정 가져오기
      const cropConfig = this.cropRegions[templateKey][cropMode];
      if (!cropConfig) {
        throw new Error(`크롭 설정을 찾을 수 없습니다: 템플릿=${templateKey}, 모드=${cropMode}`);
      }
      
      if (this.debugMode) {
        console.log(`크롭 수행: 템플릿=${templateKey}, 모드=${cropMode}`);
        console.log('크롭 설정:', cropConfig);
      }
      
      // 1. 클립보드 이미지 가져오기
      const imageBlob = await this.getImageFromClipboard();
      
      // 2. 이미지 요소로 변환
      const image = await this.blobToImage(imageBlob);
      
      // 3. 템플릿 매칭 (OpenCV 사용)
      const match = this.findTemplateWithOpenCV(image, this.templates[templateKey]);
      if (!match) {
        throw new Error('템플릿과 일치하는 영역을 찾을 수 없습니다.');
      }
      
      // 4. 크롭 영역 계산
      const cropRegion = this.calculateCropRegion(
        match, 
        cropConfig, 
        image.width,
        image.height
      );
      
      // 5. 이미지 크롭
      const croppedResult = this.cropImageRegion(image, cropRegion);
      
      // 6. 결과 반환
      return {
        ...croppedResult,
        original: {
          width: image.width,
          height: image.height
        },
        templateMatch: match,
        mode: cropMode
      };
    } catch (error) {
      console.error('이미지 크롭 오류:', error);
      throw error;
    }
  }

  /**
   * 디버그용 시각화 요소 생성
   * @param {Object} result - cropFromClipboard 결과
   * @returns {HTMLElement} 시각화 요소
   */
  createDebugView(result) {
    const container = document.createElement('div');
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.marginBottom = '20px';
    
    // 원본 이미지 정보
    const originalInfo = document.createElement('div');
    originalInfo.innerHTML = `<strong>원본 이미지:</strong> ${result.original.width}x${result.original.height}px`;
    container.appendChild(originalInfo);
    
    // 모드 정보 (추가됨)
    if (result.mode) {
      const modeInfo = document.createElement('div');
      modeInfo.innerHTML = `<strong>사용 모드:</strong> ${result.mode}`;
      container.appendChild(modeInfo);
    }
    
    // 템플릿 매칭 정보
    const matchInfo = document.createElement('div');
    matchInfo.innerHTML = `<strong>템플릿 매칭 위치:</strong> (${result.templateMatch.x}, ${result.templateMatch.y}), 신뢰도: ${result.templateMatch.confidence.toFixed(4)}`;
    container.appendChild(matchInfo);
    
    // 크롭 영역 정보
    const cropInfo = document.createElement('div');
    cropInfo.innerHTML = `<strong>크롭 영역:</strong> (${result.region.x}, ${result.region.y}) - ${result.region.width}x${result.region.height}px`;
    container.appendChild(cropInfo);
    
    // 크롭된 이미지
    const croppedImage = document.createElement('div');
    croppedImage.style.marginTop = '10px';
    croppedImage.innerHTML = '<strong>크롭된 이미지:</strong><br>';
    
    const img = document.createElement('img');
    img.src = result.dataURL;
    img.style.border = '1px dashed #999';
    img.style.maxWidth = '100%';
    croppedImage.appendChild(img);
    
    container.appendChild(croppedImage);
    
    return container;
  }
}

// 브라우저 환경에서 전역으로 노출
window.OpenCVTemplateImageCropper = new OpenCVTemplateImageCropper();


/**
 * 매핑 데이터의 파일 경로를 일괄 변환하는 유틸리티 함수
 * @param {Object} mappingData - 원본 매핑 데이터
 * @param {string} oldBasePath - 이전 기준 경로 (예: './screenshot/cropped\\')
 * @param {string} newBasePath - 새 기준 경로 (예: './templates/')
 * @returns {Object} 변환된 매핑 데이터
 */
function convertMappingPaths(mappingData, oldBasePath, newBasePath) {
  const result = {};
  
  for (const [key, data] of Object.entries(mappingData)) {
    // 파일명만 추출 (경로에서 파일명 부분만 가져오기)
    const fileName = data.file_path.split('\\').pop().split('/').pop();
    
    // 새 경로 생성
    const newPath = `${newBasePath}${fileName}`;
    
    // 결과 객체에 추가
    result[key] = {
      character: data.character,
      file_path: newPath
    };
  }
  
  return result;
}

// 유틸리티 함수도 내보내기
window.convertMappingPaths = convertMappingPaths;

// ESM 내보내기
export default window.OpenCVTemplateImageCropper;