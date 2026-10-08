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
`streamChatReply.ts`, `authApi.ts`의 요청 주소를 절대 URL로 바꿔야 합니다.
같은 출처로 두는 쪽(프록시)을 추천합니다. 로그인 쿠키가 `SameSite=Lax`라서 다른 도메인이면 쿠키가 안 붙을 수 있습니다.

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
  app/App.tsx                   TooltipProvider + AuthGate + ChatApp
  app/globals.css               Tailwind, shadcn 테마 변수(토스 컬러), Pretendard 폰트
  components/AssistantMark.tsx  로고 아이콘 (로그인 · 채팅 화면 공용)
  features/auth/                ← 로그인 · 가입 (토스 스타일)
    AuthGate.tsx                앱 열 때 /api/auth/me 확인 → 로그인 화면 또는 children(채팅)
    AuthScreen.tsx              로그인 ↔ 가입 전환, 폰 너비 레이아웃
    LoginForm.tsx / SignupForm.tsx   각 폼 (가입은 필드별 검사, blur 후 오류 표시)
    TextField.tsx               라벨 + 큰 글자 + 밑줄 입력 필드
    SubmitButton.tsx            하단 큰 파란 버튼 (비활성 · 로딩 상태)
    AuthHeader.tsx              로고 + 두 줄 제목 + 안내 문구
    UserMenu.tsx                사이드바 사용자 정보 + 로그아웃, 모바일 로그아웃 아이콘
    authStore.ts                zustand: checking / loggedIn / loggedOut, 사용자 정보, signOut
    authApi.ts                  signup · login · logout · fetchMe, UnauthorizedError
    validation.ts               이메일 · 비밀번호 규칙 (백엔드와 같은 길이)
    types.ts                    User, Credentials
  features/documents/           ← 내 문서 (RAG)
    DocumentsDialog.tsx         올리기 · 목록 · 삭제 다이얼로그 (토스 스타일)
    DocumentRow.tsx             문서 한 줄 (이름 · 글자 수 · 조각 수 · 날짜 · 삭제)
    DocumentsButtons.tsx        사이드바 "내 문서" 버튼, 모바일 헤더 아이콘
    documentApi.ts              GET · POST(multipart) · DELETE /api/documents
  features/chat/                ← 채팅
    ChatApp.tsx                 사이드바(ThreadList + UserMenu) + 헤더(역할 · 모델 선택) + Thread 레이아웃
    PersonaSelect.tsx           역할 드롭다운 (GET /api/personas)
    personaStore.ts             zustand + persist: 고른 역할을 localStorage에 기억
    personaApi.ts               GET /api/personas
    ModelSelect.tsx             모델 드롭다운 (GET /api/models, 미설치 모델은 비활성)
    modelStore.ts               zustand + persist: 고른 모델을 localStorage에 기억
    modelApi.ts                 GET /api/models
    ChatRuntimeProvider.tsx     useRemoteThreadListRuntime(대화 목록 서버 저장) + 대화별 useLocalRuntime
    conversationListAdapter.ts  대화 목록 ↔ /api/conversations (목록 · 생성 · 제목 · 보관 · 삭제)
    ConversationHistoryProvider.tsx  대화별 메시지 불러오기(load) · 저장(append/update)
    conversationApi.ts          /api/conversations 호출 함수
    messageText.ts              assistant-ui 메시지에서 텍스트만 추출
    ragSources.ts               X-RAG-Sources 헤더 읽기 → 답변 끝 "📎 참고한 문서" 문구
    chatModelAdapter.ts         assistant-ui 메시지 → 백엔드 요청, 누적 텍스트 yield
    streamChatReply.ts          POST /api/chat 스트림 읽기, 오류 JSON → Error (401은 UnauthorizedError)
    ThreadWelcome.tsx           빈 스레드 환영 화면 + 추천 질문 4개
    types.ts                    ChatMessage 타입
  components/assistant-ui/      assistant-ui 프리셋 (shadcn CLI 생성, 직접 수정 최소화)
  components/ui/                shadcn/ui 컴포넌트
  lib/apiClient.ts              fetch 래퍼: JSON 요청, {"error"} → Error / UnauthorizedError
  lib/utils.ts                  cn()
```

### 로그인 흐름

1. 앱을 열면 `AuthGate`가 `GET /api/auth/me` 호출 → 200이면 채팅, 401이면 로그인 화면
2. 로그인 · 가입 성공 → 백엔드가 `access_token` 쿠키(httpOnly)를 내려주고 `authStore`가 loggedIn
3. 이후 `/api/*` 요청에는 브라우저가 쿠키를 자동으로 붙임 (프론트 코드에서 토큰을 다루지 않음)
4. 대화 중 401(쿠키 만료) → `chatModelAdapter`가 `clearUser()` → 로그인 화면
5. 로그아웃하면 채팅 화면이 언마운트됨 → 다른 계정으로 로그인하면 그 계정의 대화 목록을 새로 불러옴

### 데이터 흐름 (채팅)

1. 사용자가 입력 → assistant-ui가 `chatModelAdapter.run()` 호출
2. 어댑터가 스레드 메시지를 `{role, content}[]`로 바꾸고, 선택한 모델 · 역할과 함께 `streamChatReply()`에 전달
3. `fetch("/api/chat")` 스트림을 읽으며 조각을 누적해 매번 전체 텍스트를 yield
   - 응답 헤더 `X-RAG-Sources`가 있으면 스트림이 끝난 뒤 "📎 참고한 문서" 줄을 덧붙임 (저장되는 답변에도 포함)
4. assistant-ui가 마크다운으로 렌더링

> assistant-ui의 `ChatModelAdapter.run`은 델타가 아니라 **지금까지의 전체 텍스트**를
> 매번 yield해야 합니다.

### 대화 저장 흐름

1. 앱을 열면 `conversationListAdapter.list()` → 사이드바 목록
2. 대화를 클릭하면 `ConversationHistoryProvider`의 `load()` → 그 대화의 메시지 불러오기
3. 새 대화에서 첫 질문 → `initialize()`로 서버에 대화 생성 → 질문 · 답변마다 `append()`로 PUT 저장
4. 첫 답변이 끝나면 `generateTitle()`이 `POST /api/conversations/{id}/title` 호출 → 백엔드 LLM이 15자 이내로 요약해 저장
5. 사이드바 `...` 메뉴의 이름 바꾸기 · 보관 · 삭제도 각각 PATCH / DELETE
6. 다시 생성 · 질문 수정은 같은 부모 아래 새 메시지(가지)가 생기는 것. 메시지마다 `parent_message_id`를 저장해서 새로고침해도 `< 1 / 2 >`로 넘겨볼 수 있음

## 6. 커스터마이징

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 추천 질문 | `features/chat/ThreadWelcome.tsx`의 `SUGGESTIONS` |
| 앱 이름 / 로고 | `features/chat/ChatApp.tsx`, `components/AssistantMark.tsx`, `index.html` |
| 로그인 · 가입 문구 | `features/auth/LoginForm.tsx`, `SignupForm.tsx`의 `AuthHeader` title · description |
| 색상 테마 | `app/globals.css`의 CSS 변수 |
| 드롭다운에 나올 모델 | 백엔드 `.env`의 `LLM_MODELS` (+ `ollama pull`) |
| 기본 모델 | 백엔드 `.env`의 `LLM_MODEL` |
| 역할 (시스템 프롬프트) | 백엔드 `app/personas.py` |
| shadcn 컴포넌트 추가 | `npx shadcn add <컴포넌트>` |

## 7. 문제 해결

| 증상 | 원인 / 조치 |
| --- | --- |
| "LLM 서버(...)에 연결할 수 없습니다" | Ollama가 꺼져 있음. `brew services run ollama` 또는 `ollama serve` |
| "모델 ...을 찾을 수 없습니다" | `ollama pull <모델>` 또는 백엔드 `.env`의 `LLM_MODEL` 오타 확인 |
| 답변 끝에 `(LLM 오류: ...)` 문구 | 스트리밍 도중 Ollama가 보낸 오류. 다시 시도 |
| "요청 실패 (504)" 또는 프록시 오류 | 백엔드 미실행. 8000 포트 확인 |
| 로그인 화면에서 "요청에 실패했어요 (500)" 등 | 백엔드 · DB 확인. `docker compose up -d`, `uv run alembic upgrade head` |
| 새로고침하면 로그아웃됨 | 쿠키 만료(기본 7일) 또는 백엔드 `JWT_SECRET`이 바뀜 |
| 빌드 시 500kB 청크 경고 | assistant-ui 번들 크기 경고일 뿐 동작엔 문제 없음 |
| `components/assistant-ui/*` lint 경고 | 생성 코드. 무시해도 됨 |
