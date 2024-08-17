interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  roleSetup?: string
}

interface Message {
  id: string;
  conversationId: string;
  assistantReply: string;
  userPrompt: string;
  timestamp: Date;
}

export { Conversation, Message };