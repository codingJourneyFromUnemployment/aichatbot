'use client';

import ChatBox from "@/components/chatbox";
import ChatList from "@/components/chatlist";
import useStore from "@/store/store";
import Modal from "@/components/modal";
import { useEffect } from "react";


export default function Home() {
  const { bothKeyInCookie, claudeKey , dolphinKey } = useStore();
  const getKeys = useStore((state) => state.getKeysFromCookie);

  useEffect(() => {
    getKeys();
    console.log("claudeKey", claudeKey);
    console.log("dolphinKey", dolphinKey);
    console.log("bothKeyInCookie", bothKeyInCookie);
  }, []);

  return (
    <div className="flex h-full w-full justify-between">
      <ChatList />
      {!bothKeyInCookie && <Modal />}
      <ChatBox />
    </div>
  );
}
