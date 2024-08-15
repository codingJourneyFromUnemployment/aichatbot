import { create } from "zustand";
import { Store , KeyActions } from "../types/store";
import Cookie from "js-cookie"; 

const useStore = create<Store & KeyActions>((set, get) => ({
  bothKeyInCookie: false,
  claudeKey: "",
  dolphinKey: "",
  currentConversationId: "",

  setBothKeyInCookie: (bothKeyInCookie) => set({ bothKeyInCookie }),
  setClaudeKey: (claudeKey) => set({ claudeKey }),
  setDolphinKey: (dolphinKey) => set({ dolphinKey }),
  setcurrentConversationId: (currentConversationId) => {
    set({ currentConversationId });
  },

  getCurrentConversationId: () => get().currentConversationId,

  getKeysFromCookie: () => {
    if (typeof window !== "undefined") {
      const claudeKey = Cookie.get("claudeKey") || "";
      const dolphinKey = Cookie.get("dolphinKey") || "";
      const currentConversationId = Cookie.get("currentConversationId") || "";
      set({
        claudeKey,
        dolphinKey,
        currentConversationId,
        bothKeyInCookie: !!(claudeKey && dolphinKey),
      });
    }
  },
  clearCookie: () => {
    Cookie.remove("claudeKey");
    Cookie.remove("dolphinKey");
    Cookie.remove("currentConversationId");
    set({
      claudeKey: "",
      dolphinKey: "",
      currentConversationId: "",
      bothKeyInCookie: false,
    });
  },
}));

export default useStore;