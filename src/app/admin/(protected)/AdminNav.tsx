"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin/photojournal", label: "Photojournal" },
  { href: "/admin/writing", label: "Writing" },
  { href: "/admin/menagerie", label: "Menagerie" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 px-4">
      <div className="max-w-4xl mx-auto flex items-center gap-1 h-12">
        <Link
          href="/admin"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors pr-4 mr-2 border-r border-gray-800"
        >
          Admin
        </Link>
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                active
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-indigo-400"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
