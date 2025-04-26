"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-fit flex-col shadow-sm shadow-blue-400">
      <div className="my-2 text-center">Dashboard</div>
      <ul>
        {[
          { text: "Coworking-Space", href: "/dashboard/coworking-space" },
          { text: "Ban Appeal", href: "/dashboard/banAppeal" },
        ].map(({ text, href }) => (
          <li key={text}>
            <Link
              className={clsx(
                "inline-block w-full px-4 py-2 whitespace-nowrap transition",
                pathname.startsWith(href) ? "bg-gray-100" : "hover:bg-gray-50"
              )}
              href={href}
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
