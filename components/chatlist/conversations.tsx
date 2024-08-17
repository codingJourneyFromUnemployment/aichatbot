import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Conversation } from "@/types/indexedDBSchema";
import { dataService } from "@/services/dataService";
import useStore from "@/store/store";
import { persistConversationState } from "@/utils/persist-state";

export default function Conversations() {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const {
    conversationList,
    currentConversationId,
    setConversationList,
    setcurrentConversationId,
  } = useStore();

  const handleConversationClick = async (id: string) => {
    setcurrentConversationId(id);
    await persistConversationState(id);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dataService.deleteConversation(id);
    const updatedList = await dataService.getAllConversations();
    setConversationList(updatedList);
    if (id === currentConversationId) {
      setcurrentConversationId("");
    }
    setDeleteConfirmId(null);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {conversationList.map((item) => (
              <li key={item.id}>
                <div
                  onClick={() => handleConversationClick(item.id)}
                  className={`flex justify-between items-center rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6 cursor-pointer ${
                    currentConversationId === item.id
                      ? "bg-gray-100 text-zinc-950"
                      : "text-primary/80 hover:bg-gray-50 hover:text-zinc-950"
                  }`}
                >
                  <div className="w-5/6">
                    {item.title}
                  </div>
                  {deleteConfirmId === item.id ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center"
                    >
                      <button
                        onClick={(e) => handleDeleteConfirm(item.id, e)}
                        className="text-red-500 hover:text-red-700 mr-2"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleDeleteCancel}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <Trash2
                      size={18}
                      onClick={(e) => handleDeleteClick(item.id, e)}
                      className="text-gray-400 hover:text-red-500"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
