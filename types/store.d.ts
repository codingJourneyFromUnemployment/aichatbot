export interface Store {
  bothKeyInCookie: boolean;
  claudeKey: string;
  dolphinKey: string;
}

export interface KeyActions {
  setBothKeyInCookie: (bothKeyInCookie: Store["bothKeyInCookie"]) => void;
  setClaudeKey: (claudeKey: Store["claudeKey"]) => void;
  setDolphinKey: (dolphinKey: Store["dolphinKey"]) => void;
  getKeysFromCookie: () => void;
  clearCookie: () => void;
}
