import { create } from "zustand";
import { Store , KeyActions } from "../types/store";
import Cookie from "js-cookie"; 

const useStore = create<Store & KeyActions>((set) => ({
  bothKeyInCookie : false,
  claudeKey: "",
  dolphinKey: "",
  setBothKeyInCookie: (bothKeyInCookie) => set({ bothKeyInCookie }),
  setClaudeKey: (claudeKey) => set({ claudeKey }),
  setDolphinKey: (dolphinKey) => set({ dolphinKey }),
  getKeysFromCookie: () => {
    if (typeof window !== "undefined") {
      const claudeKey = Cookie.get("claudeKey") || "";
      const dolphinKey = Cookie.get("dolphinKey") || "";
      if (claudeKey && dolphinKey) {
        set({ claudeKey, dolphinKey, bothKeyInCookie: true });
      } else {
        set({ bothKeyInCookie: false });
      }
    }
    }
}));

export default useStore;