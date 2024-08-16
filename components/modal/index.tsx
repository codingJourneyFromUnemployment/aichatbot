"use client";

import ModalForm from "./form";
import useStore from "@/store/store";
import Cookie from "js-cookie";
import { useState } from "react";

export default function Modal() {
  const {
    claudeKey,
    dolphinKey,
    setBothKeyInCookie,
    setClaudeKey,
    setDolphinKey,
  } = useStore();

  const [localClaudeKey, setLocalClaudeKey] = useState("");
  const [localDolphinKey, setLocalDolphinKey] = useState("");

  const handleSave = () => {
    const expirationDays = 7;
    if (localClaudeKey) {
      Cookie.set("claudeKey", localClaudeKey, { expires: expirationDays });
      setClaudeKey(localClaudeKey);
    }
    if (localDolphinKey) {
      Cookie.set("dolphinKey", localDolphinKey, { expires: expirationDays });
      setDolphinKey(localDolphinKey);
    }
    if (localClaudeKey && localDolphinKey) {
      setBothKeyInCookie(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400 opacity-95 flex justify-center items-start z-40">
      <div className="bg-white p-4 rounded-lg w-3/4 md:max-w-lg shadow-lg shadow-black flax flax-col justify-center items-center mt-20 md:mt-48">
        <div className="text-xl text-center font-bold my-4">
          You must input {!claudeKey && !dolphinKey ? "2" : "1"} API key
          {!claudeKey && !dolphinKey ? "s" : ""} first
        </div>
        <ModalForm
          claudeKey={claudeKey}
          dolphinKey={dolphinKey}
          localClaudeKey={localClaudeKey}
          setLocalClaudeKey={setLocalClaudeKey}
          localDolphinKey={localDolphinKey}
          setLocalDolphinKey={setLocalDolphinKey}
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-white hover:text-primary active:bg-primary active:text-white"
          >
            Save In Cookie
          </button>
        </div>
      </div>
    </div>
  );
}
