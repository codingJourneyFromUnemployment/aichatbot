'use client'

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ChatListHeader from "@/components/chatlist/header";
import ChatListFooter from "@/components/chatlist/footer";
import ToggleButton from "@/components/chatlist/togglebutton";
import useStore from "@/store/store";

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
  const { bothKeyInCookie } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const sidebarClasses = `z-30 fixed top-0 bottom-0 left-0 w-64 lg:w-80 transition-transform duration-300 ease-in-out ${
    isHovered || isOpen ? "translate-x-0" : "-translate-x-full"
  }`;

  if (!bothKeyInCookie) return null;

  return (
    <>
      <ToggleButton isOpen={isOpen} toggle={toggleSidebar} />

      {/* Hover trigger area - visible only on larger screens when sidebar is closed */}
      <div
        className={`fixed top-0 left-0 w-16 h-full z-20 transition-opacity duration-300 ${
          isHovered || isOpen ? "opacity-0 pointer-events-none" : "opacity-80"
        } hidden lg:block`}
        onMouseEnter={handleMouseEnter}
      />

      {/* Main sidebar content */}
      <div
        className={sidebarClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full overflow-y-auto border-r border-gray-200 bg-white px-6 flex flex-col gap-y-5">
          <ChatListHeader />
          <div className="text-primary/80 pl-8 cursor-pointer text-base hover:text-zinc-950">
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
            </ul>
            <ChatListFooter />
          </nav>
        </div>
      </div>
    </>
  );
}

// const timeoutRef = useRef<NodeJS.Timeout | null>(null);
