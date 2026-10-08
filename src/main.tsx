// 앱의 시작점. index.html의 <div id="root"> 안에 React 앱을 그린다.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/globals.css";
import { App } from "./app/App";

// `!` (non-null 단언): getElementById는 null일 수도 있다고 타입이 잡혀 있지만,
// index.html에 #root가 반드시 있으니 null이 아니라고 TypeScript에 알려준다.
// StrictMode: 개발 모드에서만 컴포넌트를 일부러 두 번 렌더링·이펙트 실행해서
// 정리(cleanup)를 빼먹은 버그를 일찍 드러내 준다. 배포 빌드에는 영향 없음.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
