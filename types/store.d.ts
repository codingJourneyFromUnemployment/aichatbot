import { Conversation } from "./indexedDBSchema";

export interface Store {
  bothKeyInCookie: boolean;
  claudeKey: string;
  dolphinKey: string;
  currentConversationId: string
  conversationMode: "chat" | "rolePlay";
  currentRoleSetup: string;
  conversationList: Conversation[];
}

export interface KeyActions {
  setBothKeyInCookie: (bothKeyInCookie: Store["bothKeyInCookie"]) => void;
  setClaudeKey: (claudeKey: Store["claudeKey"]) => void;
  setDolphinKey: (dolphinKey: Store["dolphinKey"]) => void;
  setcurrentConversationId: (
    currentConversationId: Store["currentConversationId"]
  ) => void;
  setCurrentRoleSetup: (currentRoleSetup: Store["currentRoleSetup"]) => void;

  getCurrentConversationId: () => string;

  setConversationMode: (conversationMode: Store["conversationMode"]) => void;
  setConversationList: (conversationList: Store["conversationList"]) => void;

  getKeysFromCookie: () => void;
  clearCookie: () => void;
}
