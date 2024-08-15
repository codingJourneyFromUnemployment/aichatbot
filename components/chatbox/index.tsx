'use client';

import React, { useState, useEffect } from "react";
import Card from "./dialogcard";
import DialogForm from "./inputform";
import DialogTitle from "./dialogtitle";
import useStore from "@/store/store";
import { dataService } from "@/services/dataService";
import { Message } from "@/types/indexedDBSchema";
import {
  persistConversationState,
  loadConversationState,
} from "@/utils/persist-state";

export default function ChatBox() {
  const [title, setTitle] = useState("New Conversation");
  const [messages, setMessages] = useState<Message[]>([]);
  const {
    dolphinKey,
    currentConversationId,
    setcurrentConversationId,
    getCurrentConversationId,
  } = useStore();

  useEffect(() => {
    const initializeConversation = async () => {
      const savedConversationId = await loadConversationState();
      if (savedConversationId) {
        setcurrentConversationId(savedConversationId);
        loadConversation(savedConversationId);
      }
    };

    initializeConversation();
  }, []);

  useEffect(() => {
    
    if (currentConversationId) {
      loadConversation(currentConversationId);
    } else {
      setTitle("New Conversation");
      setMessages([]);
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
    let conversationId = getCurrentConversationId();
    
    if (!currentConversationId) {
      conversationId = await dataService.createConversation(userMessage);
      setcurrentConversationId(conversationId);
      setTitle(userMessage);
      await persistConversationState(conversationId);
      conversationId = getCurrentConversationId();
    }


    console.log("debugging");
    console.log("dolphinKey", dolphinKey);
    console.log("userMessage", userMessage);
    console.log("conversationId", conversationId);

  
    const replyData = await dataService.chatWithAI(
      conversationId,
      dolphinKey,
      userMessage
    );

    console.log("replyData", replyData);

    const updatedMessages = await dataService.getMessages(
      conversationId
    );

    console.log("updatedMessages success", updatedMessages);
  
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
