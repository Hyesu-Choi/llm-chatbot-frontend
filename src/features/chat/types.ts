// 백엔드 app/schemas.py 의 ChatMessage와 같은 모양. 둘 중 하나를 바꾸면 다른 쪽도 맞춰야 한다.
export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};
