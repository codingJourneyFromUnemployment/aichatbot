interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  initialPrompt: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export { Conversation, Message };