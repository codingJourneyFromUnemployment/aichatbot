import db from "@/indexedDB/db";
import { chatWithDolphin } from "@/utils/chatwith-dolphin";
import { Conversation, Message } from "@/types/indexedDBSchema";

export const dataService = {
  async createConversation(title: string): Promise<string> {
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.conversations.add(conversation);
    return conversation.id;
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    return db.conversations.get(id);
  },

  async addMessage(
    conversationId: string,
    content: string,
    role: "user" | "assistant",
    initialPrompt: string
  ): Promise<void> {
    const message: Message = {
      id: Date.now().toString(),
      conversationId,
      content,
      role,
      initialPrompt,
      timestamp: new Date(),
    };
    await db.messages.add(message);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return db.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("timestamp");
  },

  async chatWithAI(message: string, dolphinKey: string): Promise<object> {
    const replyData = await chatWithDolphin(message, dolphinKey);
    return replyData;
  }

};