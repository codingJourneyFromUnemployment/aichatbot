export interface Store {
  bothKeyInCookie: boolean;
  claudeKey: string;
  dolphinKey: string;
  currentConversationId: string;
}

export interface KeyActions {
  setBothKeyInCookie: (bothKeyInCookie: Store["bothKeyInCookie"]) => void;
  setClaudeKey: (claudeKey: Store["claudeKey"]) => void;
  setDolphinKey: (dolphinKey: Store["dolphinKey"]) => void;
  setcurrentConversationId: (
    lastConversationId: Store["lastConversationId"]
  ) => void;
  getKeysFromCookie: () => void;
  clearCookie: () => void;
}
