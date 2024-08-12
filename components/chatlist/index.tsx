import ChatListHeader from "@/components/chatlist/header";
import ChatListFooter from "@/components/chatlist/footer";
import Link from "next/link";

const navigation = [
  { name: "Dialog1", href: "#" },
  { name: "Dialog2", href: "#" },
  { name: "Dialog3", href: "#" },
  { name: "Dialog4", href: "#" },
  { name: "Dialog5", href: "#" },
  { name: "Dialog6", href: "#" },
  { name: "Dialog7", href: "#" },
  { name: "Dialog8", href: "#" },
  { name: "Dialog9", href: "#" },
  { name: "Dialog10", href: "#" },
];

export default function ChatList() {

  return (
    <div className="flex w-5/6 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:w-2/4 md:max-w-xl">
      <ChatListHeader />
      <div className="text-primary/90 pl-8 cursor-pointer text-base hover:text-zinc-950 ">
        Start new chat
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6 text-primary/80 hover:bg-gray-50 "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <ChatListFooter />
        </ul>
      </nav>
    </div>
  );
}
