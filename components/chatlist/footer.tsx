import Link from "next/link";

export default function ChatListFooter() {
  return (
    <div className="-mx-6 mt-auto">
      <Link
        href="#"
        className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
      >
        <img
          alt=""
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="h-12 w-auto rounded-full bg-gray-50"
        />
      </Link>
    </div>
  );
}
