import ChatBox from "@/components/chatbox";
import ChatList from "@/components/chatlist";


export default function Home() {
  return (
    <div className="flex h-full w-full justify-between">
      <ChatList />
      <ChatBox />
    </div>
  );
}
