'use client';

import ChatBox from "@/components/chatbox";
import ChatList from "@/components/chatlist";
import useStore from "@/store/store";
import Modal from "@/components/modal";
import { useEffect } from "react";
import ThemeToggle from "@/components/themetoggle/themetoggle";


export default function Home() {
  const { bothKeyInCookie, claudeKey , dolphinKey } = useStore();
  const getKeys = useStore((state) => state.getKeysFromCookie);

  useEffect(() => {
    getKeys();
  }, []);

  return (
    <div className="relative h-full w-full dark:text-zinc-900 dark:bg-gray-900">
      <ThemeToggle />
      <div className="flex h-full w-full justify-between">
        <ChatList />
        {!bothKeyInCookie && <Modal />}
        <ChatBox />
      </div>
    </div>
  );
}
