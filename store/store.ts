import { create } from "zustand";
import { Store , KeyActions } from "../types/store";
import Cookie from "js-cookie"; 

const useStore = create<Store & KeyActions>((set) => ({
  bothKeyInCookie : false,
  claudeKey: "",
  dolphinKey: "",
  lastConversationId: "",

  setBothKeyInCookie: (bothKeyInCookie) => set({ bothKeyInCookie }),
  setClaudeKey: (claudeKey) => set({ claudeKey }),
  setDolphinKey: (dolphinKey) => set({ dolphinKey }),
  setLastConversationId: (lastConversationId) => set({ lastConversationId }),

  getKeysFromCookie: () => {
    if (typeof window !== "undefined") {
      const claudeKey = Cookie.get("claudeKey") || "";
      const dolphinKey = Cookie.get("dolphinKey") || "";
      const lastConversationId = Cookie.get("lastConversationId") || "";
      set({
        claudeKey,
        dolphinKey,
        lastConversationId,
        bothKeyInCookie: !!(claudeKey && dolphinKey),
      });
    }},
  clearCookie: () => {
    Cookie.remove("claudeKey");
    Cookie.remove("dolphinKey");
    Cookie.remove("lastConversationId");
    set({ 
      claudeKey: "", 
      dolphinKey: "", 
      lastConversationId: "",
      bothKeyInCookie: false 
    });}
}));

export default useStore;