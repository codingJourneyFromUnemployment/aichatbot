import db from "@/indexedDB/db";
import { chatWithDolphin } from "@/utils/chatwith-dolphin";
import { Conversation, Message } from "@/types/indexedDBSchema";
// import { contextManager } from "./contextManager"; 

export const dataService = {
  async createConversation(title: string): Promise<string> {
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.conversations.add(conversation);
    // contextManager.setInitialUserPrompt(title);
    return conversation.id;
  },

  // async getConversationContext(conversationId: string): Promise<string> {
  //   return contextManager.getConversationContext(conversationId);
  // },

  async getConversation(id: string): Promise<Conversation | undefined> {
    return db.conversations.get(id);
  },

  async addMessage(
    conversationId: string,
    assistantReply: string,
    userPrompt: string
  ): Promise<void> {
    const message: Message = {
      id: Date.now().toString(),
      conversationId,
      assistantReply,
      userPrompt,
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
  },
};