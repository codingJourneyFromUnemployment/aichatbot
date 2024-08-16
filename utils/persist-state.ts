import Cookie from "js-cookie";
import db from "@/indexedDB/db";
import useStore from "@/store/store";

export async function persistConversationState(conversationId: string) {
  // Save the current conversation ID to a cookie
  Cookie.set("currentConversationId", conversationId, { expires: 7 }); // Expires in 7 days

  // Update the conversation's 'updatedAt' field in IndexedDB
  await db.conversations.update(conversationId, { updatedAt: new Date() });
  
  console.log("updated conversationId", conversationId);

  // Optionally, you can also update your Zustand store
  useStore.getState().setcurrentConversationId(conversationId);
}

export async function loadConversationState(): Promise<string | null> {
  const conversationId = Cookie.get("currentConversationId");

  if (conversationId) {
    // Verify that the conversation still exists in IndexedDB
    const conversation = await db.conversations.get(conversationId);
    if (conversation) {
      useStore.getState().setcurrentConversationId(conversationId);
      return conversationId;
    } else {
      // If the conversation doesn't exist, clear the cookie
      Cookie.remove("currentConversationId");
    }
  }

  return null;
}

export async function clearConversationState() {
  Cookie.remove("currentConversationId");
  useStore.getState().setcurrentConversationId("");
}
