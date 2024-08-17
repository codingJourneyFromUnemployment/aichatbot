import React from "react";
import { Message } from "@/types/indexedDBSchema";

interface CardProps {
  messages: Message[];
}

export default function Card({ messages }: CardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[80vh] p-4">
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-start mb-2">
            <div className="bg-gray-50 dark:bg-gray-400 rounded-lg p-3 max-w-[80%]">
              {/* <p className="text-sm font-semibold mb-1">User</p> */}
              <p className="text-sm">{message.userPrompt}</p>
            </div>
          </div>
          <div className="flex justify-end mb-2">
            <div className="bg-gray-100 dark:bg-gray-300 rounded-lg p-3 max-w-[80%]">
              {/* <p className="text-sm font-semibold mb-1">Assistant</p> */}
              <p className="text-sm">{message.assistantReply}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}