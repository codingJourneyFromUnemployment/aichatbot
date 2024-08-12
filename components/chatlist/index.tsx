"use client";

import ChatListHeader from "@/components/chatlist/header";
import ChatListFooter from "@/components/chatlist/footer";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150); // 300ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Hover trigger area - visible only when sidebar is closed */}
      <div
        className={`fixed top-0 left-0 w-16 h-full z-20 transition-opacity duration-300 ${
          isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onMouseEnter={handleMouseEnter}
      />

      {/* Main sidebar content */}
      <div
        className={`z-30 fixed top-0 bottom-0 left-0 w-64 lg:w-80 transition-transform duration-300 ease-in-out ${
          isHovered ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full overflow-y-auto border-r border-gray-200 bg-white px-6 flex flex-col gap-y-5">
          <ChatListHeader />
          <div className="text-primary/90 pl-8 cursor-pointer text-base hover:text-zinc-950">
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
                        className="block rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6 text-primary/80 hover:bg-gray-50 hover:text-zinc-950 cursor-pointer"
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
      </div>
    </>
  );
}
