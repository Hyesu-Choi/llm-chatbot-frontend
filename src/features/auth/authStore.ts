import { create } from "zustand";
import { logout } from "./authApi";
import type { User } from "./types";

// checking: 앱을 막 열어서 로그인 여부를 서버에 묻는 중 (이때 로그인 화면을 보여주면 깜빡여서 따로 둔다)
type AuthStatus = "checking" | "loggedIn" | "loggedOut";

type AuthState = {
  status: AuthStatus;
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  signOut: () => Promise<void>;
};

// zustand: 컴포넌트 밖에 두는 전역 상태. Provider로 감쌀 필요 없이 어디서든 useAuthStore로 읽는다.
// 컴포넌트에서는 useAuthStore((s) => s.user) 처럼 필요한 값만 골라 읽어야, 다른 값이 바뀔 때 다시 그려지지 않는다.
export const useAuthStore = create<AuthState>((set) => ({
  status: "checking",
  user: null,
  setUser: (user) => set({ status: "loggedIn", user }),
  clearUser: () => set({ status: "loggedOut", user: null }),
  signOut: async () => {
    try {
      // 쿠키가 httpOnly라 브라우저 코드로는 못 지운다. 서버가 지우라고 응답해야 지워진다.
      await logout();
    } finally {
      // 요청이 실패해도 화면은 로그아웃 상태로 돌린다
      set({ status: "loggedOut", user: null });
    }
  },
}));
