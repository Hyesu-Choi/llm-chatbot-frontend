// 백엔드 app/schemas.py 의 UserResponse와 같은 모양
export type User = {
  id: number;
  email: string;
  created_at: string;
};

export type Credentials = {
  email: string;
  password: string;
};
