import { Conversation, Message } from "@/types/indexedDBSchema";
import Dexie from "dexie";

class AIAssistantDB extends Dexie {
  conversations: Dexie.Table<Conversation, string>;
  messages: Dexie.Table<Message, string>;

  constructor() {
    super("AIAssistantDB");
    this.version(1).stores({
      conversations: "id, title, createdAt, updatedAt",
      messages:
        "id, conversationId, assistantReply, userPrompt, timestamp",
    });
    this.conversations = this.table("conversations");
    this.messages = this.table("messages");
  }
}

const db = new AIAssistantDB();

export default db;