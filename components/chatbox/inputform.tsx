import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function DialogForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea?.addEventListener("input", adjustHeight);
    return () => textarea?.removeEventListener("input", adjustHeight);
  }, [message]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // 防止换行

      if (message.trim()) {
        setIsLoading(true);
        try {
          const response = await axios.post("/api/test", {
            userMessage: message,
          });

          console.log("Message sent successfully:", response.data);
          setMessage(""); // 清空输入框
          // 在下一个渲染周期调整高度
          setTimeout(adjustHeight, 0);
        } catch (error) {
          console.error("Error sending message:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-3/4 md:w-7/12 xl:w-4/12">
        <label htmlFor="dialog" className="sr-only">
          Your reply
        </label>
        <textarea
          ref={textareaRef}
          id="dialog"
          name="dialog"
          placeholder="your reply:"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`block w-full pr-10 mb-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary/80 sm:text-sm sm:leading-6 resize-none overflow-hidden min-h-[40px] ${
            isLoading ? "opacity-50" : ""
          }`}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Image
              src="/loading.svg"
              alt="Loading"
              width={24}
              height={24}
              className="animate-spin"
            />
          </div>
        )}
      </div>
    </div>
  );
}
