import db from "@/indexedDB/db";
import { chatWithDolphin } from "@/utils/chatwith-dolphin";
import { Conversation, Message } from "@/types/indexedDBSchema";
import { contextManager } from "./contextManager"; 
import { persistConversationState, loadConversationState } from "@/utils/persist-state";

export const dataService = {
  async createConversation(title: string): Promise<string> {
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.conversations.add(conversation);

    await persistConversationState(conversation.id);

    return conversation.id;
  },

  async getConversationContext(
    conversationId: string,
    latestUserPrompt: string
  ): Promise<string> {
    return contextManager.getConversationContext(
      conversationId,
      latestUserPrompt
    );
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    return db.conversations.get(id);
  },

  async getConversationList(): Promise<Conversation[]> {
    return db.conversations.toArray();
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

    await db.conversations.update(conversationId, { updatedAt: new Date() });
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return db.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("timestamp");
  },

  async chatWithAI(
    conversationId: string,
    dolphinKey: string,
    userMessage: string
  ): Promise<object> {
    const context = await this.getConversationContext(
      conversationId,
      userMessage
    );
    const replyData = await chatWithDolphin(context, dolphinKey);

    await this.addMessage(conversationId, replyData.reply, userMessage);

    await persistConversationState(conversationId);

    console.log(context);
    return replyData;
  },

  async regenerateReply(
    conversationId: string,
    dolphinKey: string,
    userMessage: string
  ): Promise<object> {
    const context = await this.getConversationContextWithoutLastReply(
      conversationId,
      userMessage
    );
    const replyData = await chatWithDolphin(context, dolphinKey);

    console.log(context);

    await this.updateLastMessage(conversationId, replyData.reply);

    await persistConversationState(conversationId);

    return replyData;
  },

  async fetchRoleSetup(
    dolphinKey: string,
    userMessage: string
  ): Promise<object> {
    const context = contextManager.getInitSetupContext(userMessage);

    console.log(context);

    const replyData = await chatWithDolphin(context, dolphinKey);

    return replyData;
  },

  async getConversationContextWithoutLastReply(
    conversationId: string,
    latestUserPrompt: string
  ): Promise<string> {
    const messages = await this.getMessages(conversationId);

    messages.pop();

    const conversationHistory = contextManager.buildConversationHistory(
      messages,
      latestUserPrompt
    );

    return contextManager.assembleContext(conversationHistory);
  },

  async updateLastMessage(
    conversationId: string,
    newReply: string
  ): Promise<void> {
    const messages = await this.getMessages(conversationId);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      lastMessage.assistantReply = newReply;
      await db.messages.update(lastMessage.id, { assistantReply: newReply });
    }
  },

  async getAllConversations(): Promise<Conversation[]> {
    return db.conversations.toArray();
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await db.messages.where("conversationId").equals(conversationId).delete();
    await db.conversations.delete(conversationId);
  },
};