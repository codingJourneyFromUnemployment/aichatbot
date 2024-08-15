'use client';

import React, { useState, useEffect } from "react";
import Card from "./dialogcard";
import DialogForm from "./inputform";
import DialogTitle from "./dialogtitle";
import useStore from "@/store/store";
import { dataService } from "@/services/dataService";
import { Message } from "@/types/indexedDBSchema";

export default function ChatBox() {
  const [title, setTitle] = useState("New Conversation");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { dolphinKey, currentConversationId, setcurrentConversationId } =
    useStore();

  useEffect(() => {
    if (currentConversationId) {
      setConversationId(currentConversationId);
      loadConversation(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversation = async (id: string) => {
    const conversation = await dataService.getConversation(id);
    if (conversation) {
      setTitle(conversation.title);
      const msgs = await dataService.getMessages(id);
      setMessages(msgs);
    }
  };

  const handleNewMessage = async (userMessage: string) => {
    let currentConvId = conversationId;
    if (!currentConvId) {
      currentConvId = await dataService.createConversation(userMessage);
      setConversationId(currentConvId);
      setcurrentConversationId(currentConvId);
      setTitle(userMessage);
    }
  
    const replyData = await dataService.chatWithAI(currentConvId, dolphinKey, userMessage);
    const updatedMessages = await dataService.getMessages(currentConvId);
  
    setMessages(updatedMessages);
  }

  return (
    <div className="z-10 flex flex-col justify-between items-center grow">
      <DialogTitle title={title} />
      <Card messages={messages} />
      <DialogForm onSendMessage={handleNewMessage} />
    </div>
  );
}
