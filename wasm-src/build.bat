@echo off
setlocal

REM Emscripten 환경 설정
call C:\Users\SUHUN\Desktop\emsdk\emsdk_env.bat

REM 출력 디렉토리 생성
mkdir ..\lib\wasm

REM 빌드 명령 - embind 라이브러리 추가
emcc template-matcher.cpp -o ../lib/wasm/template-matcher.js ^
  -s WASM=1 ^
  -s ALLOW_MEMORY_GROWTH=1 ^
  -s MODULARIZE=1 ^
  -s EXPORT_ES6=1 ^
  -s EXPORTED_RUNTIME_METHODS=['cwrap'] ^
  -s DISABLE_EXCEPTION_CATCHING=0 ^
  -lembind ^
  -O3

echo 빌드 완료!