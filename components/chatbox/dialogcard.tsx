import React from "react";
import { Message } from "@/types/indexedDBSchema";

interface CardProps {
  messages: Message[];
}

export default function Card({ messages }: CardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow w-3/4 md:w-7/12 xl:w-4/12 max-h-[60vh] overflow-y-auto">
      <div className="px-4 py-5 sm:p-6">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <p className="font-bold">User:</p>
            <p>{message.userPrompt}</p>
            <p className="font-bold mt-2">Assistant:</p>
            <p>{message.assistantReply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
