import Link from "next/link";
import useStore from "@/store/store";

export default function ChatListFooter() {
  const { clearCookie } = useStore();

  return (
    <div className="flex mb-8">
      <button
        type="button"
        onClick={clearCookie}
        className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-white hover:text-red-500 active:bg-red-500 active:text-white"
      >
        Clear Cookies
      </button>
    </div>
  );
}
