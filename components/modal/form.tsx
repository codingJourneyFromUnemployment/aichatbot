import React from "react";

interface ModalFormProps {
  claudeKey: string;
  dolphinKey: string;
  localClaudeKey: string;
  setLocalClaudeKey: React.Dispatch<React.SetStateAction<string>>;
  localDolphinKey: string;
  setLocalDolphinKey: React.Dispatch<React.SetStateAction<string>>;
}

export default function ModalForm({
  claudeKey,
  dolphinKey,
  localClaudeKey,
  setLocalClaudeKey,
  localDolphinKey,
  setLocalDolphinKey,
} : ModalFormProps) {
  return (
    <div className="space-y-6 my-6">
      {!claudeKey && (
        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-primary/70">
          <label className="block text-xs font-medium text-gray-900">
            Claude Key
          </label>
          <input
            id="claudeKey"
            name="claudeKey"
            type="text"
            value={localClaudeKey}
            onChange={(e) => setLocalClaudeKey(e.target.value)}
            placeholder="Please enter your Claude API Key."
            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
      )}
      {!dolphinKey && (
        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-primary/70">
          <label
            htmlFor="dolphinKey"
            className="block text-xs font-medium text-gray-900"
          >
            Dolphin Key
          </label>
          <input
            id="dolphinKey"
            name="dolphinKey"
            type="text"
            value={localDolphinKey}
            onChange={(e) => setLocalDolphinKey(e.target.value)}
            placeholder="Please enter your Dolphin API Key."
            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
        </div>
      )}
    </div>
  );
}
