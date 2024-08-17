"use client";

import useStore from "@/store/store";
import { Users, Speech } from "lucide-react";

export default function ModeToggle() {
  const { 
    currentConversationId,
    conversationMode, 
    setConversationMode } =
    useStore();

  if(currentConversationId){
    return null
  }

  return (
    <div className="absolute top-16 right-4 z-40">
      <button
        onClick={() => {
          setConversationMode(conversationMode === "chat" ? "rolePlay" : "chat")
        }}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-500 dark:bg-zinc-300"
        type="button"
      >
        {conversationMode === "chat" ? <Speech /> : <Users />}
      </button>
    </div>
  );
}
