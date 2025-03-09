#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>
#include <vector>
#include <algorithm>

using namespace emscripten;

class TemplateMatcher {
public:
    TemplateMatcher() = default;

    // 테스트용 함수
    int add(int a, int b) {
        return a + b;
    }

    // 대량 매칭 처리를 위한 배치 처리 함수 - 기존 정확도를 유지하며 성능만 최적화
    val matchTemplateBatch(val sourceImageData, val templateBatch, float threshold) {
        val window = val::global("window");
        
        // 결과 배열 생성
        val results = val::array();
        
        // 각 템플릿에 대해 매칭 수행
        int batchSize = templateBatch["length"].as<int>();
        for (int i = 0; i < batchSize; i++) {
            val template = templateBatch[i];
            val match = window.call<val>("findTemplateFromWasm", 
                                       sourceImageData, 
                                       template["image"], 
                                       threshold);
            
            if (!match.isNull() && match.as<bool>()) {
                val result = val::object();
                result.set("templateId", template["id"]);
                result.set("character", template["character"]);
                result.set("match", match);
                results.call<void>("push", result);
            }
        }
        
        return results;
    }

    // 템플릿 매칭 (OpenCV.js 사용) - 기존 함수 유지
    val matchTemplate(val sourceImageData, val templateImageData, float threshold) {
        // OpenCV.js의 findTemplateFromWasm 함수 호출
        val window = val::global("window");
        val result = window.call<val>("findTemplateFromWasm", 
                                    sourceImageData, 
                                    templateImageData, 
                                    threshold);
        return result;
    }

    // 이미지 크롭 - 기존 함수 유지
    val cropImage(val imageData, int x, int y, int width, int height) {
        val window = val::global("window");
        val result = window.call<val>("cropImageFromWasm", 
                                    imageData, 
                                    x, y, width, height);
        return result;
    }
};

// JavaScript 바인딩
EMSCRIPTEN_BINDINGS(template_matcher_module) {
    class_<TemplateMatcher>("TemplateMatcher")
        .constructor<>()
        .function("add", &TemplateMatcher::add)
        .function("matchTemplate", &TemplateMatcher::matchTemplate)
        .function("matchTemplateBatch", &TemplateMatcher::matchTemplateBatch)
        .function("cropImage", &TemplateMatcher::cropImage);
}