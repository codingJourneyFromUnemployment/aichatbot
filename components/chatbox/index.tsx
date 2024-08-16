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
import { RefreshCw } from "lucide-react";

export default function ChatBox() {
  const [title, setTitle] = useState("New Conversation");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const {
    dolphinKey,
    currentConversationId,
    setcurrentConversationId,
    getCurrentConversationId,
    conversationList,
    setConversationList,
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

    const replyData = await dataService.chatWithAI(
      conversationId,
      dolphinKey,
      userMessage
    );

    console.log("replyData", replyData);

    const updatedMessages = await dataService.getMessages(
      conversationId
    );
  
    setMessages(updatedMessages);

    const conversationList = await dataService.getConversationList();
    setConversationList(conversationList);
  }

  const handleRegenerate = async () => {
    if (messages.length === 0 || !currentConversationId) return;

    setIsRegenerating(true);

    try {
      const lastMessage = messages[messages.length - 1];
      const replyData = await dataService.regenerateReply(
        currentConversationId,
        dolphinKey,
        lastMessage.userPrompt
      );

      const updatedMessages = await dataService.getMessages(currentConversationId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error regenerating reply:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="z-10 flex flex-col justify-between items-center grow">
      <DialogTitle title={title} />
      <Card messages={messages} />
      <button
        onClick={handleRegenerate}
        disabled={isRegenerating || messages.length === 0}
        className="mr-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        <RefreshCw size={20} className={isRegenerating ? "animate-spin" : ""} />
      </button>
      <DialogForm onSendMessage={handleNewMessage} />
    </div>
  );
}
