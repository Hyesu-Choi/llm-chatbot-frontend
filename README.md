# llm-chatbot-frontend

[assistant-ui](https://www.assistant-ui.com) + shadcn/ui로 만든 챗봇 UI. 백엔드가 로컬 Ollama를 호출합니다.
React 19 · Vite 8 · TypeScript · Tailwind v4 · zustand.
백엔드는 [`llm-chatbot-backend`](../llm-chatbot-backend).

```
브라우저 ──▶ 프론트(Vite :5173) ──/api 프록시──▶ 백엔드(FastAPI :8000) ──▶ Ollama(:11434)
```

## 1. 사전 준비

| 도구 | 버전 | 설치 |
| --- | --- | --- |
| Node.js | 24 (20 이상이면 됨) | `brew install node` 또는 nvm |
| npm | 11 | Node에 포함 |

그리고 **백엔드가 먼저 떠 있어야** 합니다. 순서:

1. Ollama 실행 + 모델 받기: `ollama pull gemma3:4b` (백엔드 README 참고)
2. 백엔드: `cd ../llm-chatbot-backend && uv run uvicorn app.main:app --reload --port 8000`
3. 프론트: 아래 참고

## 2. 서버 실행

```bash
npm install                  # 최초 1회
npm run dev                  # http://localhost:5173
```

- 끄기: `Ctrl+C`
- 포트 고정이 필요하면: `npx vite --port 5173 --strictPort`
- 포트가 이미 쓰이는 경우: `lsof -iTCP:5173 -sTCP:LISTEN` 으로 PID 찾아서 `kill <PID>`

### 백엔드 주소 바꾸기

개발 서버는 `/api/*` 요청을 FastAPI로 프록시합니다 (`vite.config.ts`). 그래서 CORS 설정 없이
같은 origin처럼 동작합니다. 백엔드가 다른 주소에 있으면:

```bash
VITE_API_PROXY_TARGET=http://192.168.0.10:8000 npm run dev
```

## 3. 빌드 / 배포

```bash
npm run build                # tsc -b + vite build → dist/
npm run preview              # dist/ 를 로컬에서 미리보기 (http://localhost:4173)
```

빌드 결과는 정적 파일이라 프록시가 없습니다. 배포할 때는 nginx 같은 웹서버에서
`/api/*`를 백엔드로 넘기거나, 백엔드 `CORS_ORIGINS`에 프론트 주소를 추가하고
`streamChatReply.ts`의 요청 주소를 절대 URL로 바꿔야 합니다.

## 4. 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm run lint` | oxlint |
| `npm run preview` | 빌드 결과 미리보기 |
| `npx tsc -b` | 타입체크만 |

## 5. 코드 구조

```
src/
  main.tsx                      엔트리
  app/App.tsx                   TooltipProvider + ChatApp
  app/globals.css               Tailwind, shadcn 테마 변수, Pretendard 폰트
  features/chat/                ← 직접 작성한 코드는 전부 여기
    ChatApp.tsx                 사이드바(ThreadList) + Thread 레이아웃
    ChatRuntimeProvider.tsx     useLocalRuntime(chatModelAdapter)
    chatModelAdapter.ts         assistant-ui 메시지 → 백엔드 요청, 누적 텍스트 yield
    streamChatReply.ts          POST /api/chat 스트림 읽기, 오류 JSON → Error
    ThreadWelcome.tsx           빈 스레드 환영 화면 + 추천 질문 4개
    AssistantMark.tsx           로고 아이콘
    types.ts                    ChatMessage 타입
  components/assistant-ui/      assistant-ui 프리셋 (shadcn CLI 생성, 직접 수정 최소화)
  components/ui/                shadcn/ui 컴포넌트
  lib/utils.ts                  cn()
```

### 데이터 흐름

1. 사용자가 입력 → assistant-ui가 `chatModelAdapter.run()` 호출
2. 어댑터가 스레드 메시지를 `{role, content}[]`로 바꿔 `streamChatReply()`에 전달
3. `fetch("/api/chat")` 스트림을 읽으며 조각을 누적해 매번 전체 텍스트를 yield
4. assistant-ui가 마크다운으로 렌더링

> assistant-ui의 `ChatModelAdapter.run`은 델타가 아니라 **지금까지의 전체 텍스트**를
> 매번 yield해야 합니다. 대화 기록은 브라우저 메모리에만 있고 새로고침하면 사라집니다.

## 6. 커스터마이징

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 추천 질문 | `features/chat/ThreadWelcome.tsx`의 `SUGGESTIONS` |
| 앱 이름 / 로고 | `features/chat/ChatApp.tsx`, `AssistantMark.tsx`, `index.html` |
| 색상 테마 | `app/globals.css`의 CSS 변수 |
| 모델 / 시스템 프롬프트 | 백엔드 `.env`, `app/config.py` |
| shadcn 컴포넌트 추가 | `npx shadcn add <컴포넌트>` |

## 7. 문제 해결

| 증상 | 원인 / 조치 |
| --- | --- |
| "LLM 서버(...)에 연결할 수 없습니다" | Ollama가 꺼져 있음. `ollama serve` 또는 Ollama 앱 실행 |
| "모델 ...을 찾을 수 없습니다" | `ollama pull <모델>` 또는 백엔드 `.env`의 `LLM_MODEL` 오타 확인 |
| 답변 끝에 `(LLM 오류: ...)` 문구 | 스트리밍 도중 Ollama가 보낸 오류. 다시 시도 |
| "요청 실패 (504)" 또는 프록시 오류 | 백엔드 미실행. 8000 포트 확인 |
| 빌드 시 500kB 청크 경고 | assistant-ui 번들 크기 경고일 뿐 동작엔 문제 없음 |
| `components/assistant-ui/*` lint 경고 | 생성 코드. 무시해도 됨 |
