'use client'

import React, { useState, useEffect, useRef } from "react";
import ChatListHeader from "@/components/chatlist/header";
import ChatListFooter from "@/components/chatlist/footer";
import ToggleButton from "@/components/chatlist/togglebutton";
import useStore from "@/store/store";
import {dataService} from "@/services/dataService";
import { Conversation } from "@/types/indexedDBSchema";
import { persistConversationState, clearConversationState } from "@/utils/persist-state";


export default function ChatList() {
  const {
    bothKeyInCookie,
    currentConversationId,
    setcurrentConversationId,
    conversationList,
    setConversationList,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchConversationList = async () => {
      const list = await dataService.getConversationList();
      setConversationList(list);
    };

    fetchConversationList();
  }, []);

  const handleNewChat = async () => {
    clearConversationState();
  };

  const handleConversationClick = (conversationId: string) => {
    setcurrentConversationId(conversationId);
    persistConversationState(conversationId);
  };


  const sidebarClasses = `z-30 fixed top-0 bottom-0 left-0 w-64 lg:w-80 transition-transform duration-300 ease-in-out ${
    isHovered || isOpen ? "translate-x-0" : "-translate-x-full"
  }`;


  if (!bothKeyInCookie) return null;

  return (
    <>
      <ToggleButton isOpen={isOpen} toggle={toggleSidebar} />

      {/* Hover trigger area - visible only on larger screens when sidebar is closed */}
      <div
        className={`fixed top-0 left-0 w-28 h-full z-20 transition-opacity duration-300 ${
          isHovered || isOpen ? "opacity-0 pointer-events-none" : "opacity-80"
        } hidden lg:block`}
        onMouseEnter={handleMouseEnter}
      />

      {/* Main sidebar content */}
      <div
        className={sidebarClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full overflow-y-auto border-r border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-500 opacity-80 px-6 flex flex-col gap-y-5 items-center">
          <ChatListHeader />
          <div
            className="text-primary/80 cursor-pointer text-lg text-start font-bold hover:text-stone-950"
            onClick={handleNewChat}
          >
            Start new chat
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {conversationList.map((item) => (
                    <li key={item.id}>
                      <div
                        onClick={() => handleConversationClick(item.id)}
                        className={`block rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6 cursor-pointer ${
                          currentConversationId === item.id
                            ? "bg-gray-100 text-zinc-950"
                            : "text-primary/80 hover:bg-gray-50 hover:text-zinc-950"
                        }`}
                      >
                        {item.title}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <ChatListFooter />
        </div>
      </div>
    </>
  );
}

