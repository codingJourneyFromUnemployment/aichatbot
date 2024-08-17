import React from "react";
import { Message } from "@/types/indexedDBSchema";
import useStore from "@/store/store";

interface CardProps {
  messages: Message[];
}

export default function Card({ messages }: CardProps) {
  const { conversationMode } = useStore();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[80vh] p-4">
      {conversationMode === "rolePlay" && (
        <div className="flex justify-end mb-2">
          <div className="bg-gray-100 dark:bg-gray-300 rounded-lg p-3 max-w-[80%]">
            {/* <p className="text-sm font-semibold mb-1">Assistant</p> */}
            <p className="text-sm">
              Hi~ you're in role-play mode. Please provide more information for
              me. The more detailed, the better I can play the role. What
              character do you want me to play? My appearance, clothing,
              profession, personality, and even quirks? In what kind of scenario
              are we communicating?
            </p>
          </div>
        </div>
      )}
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