import Link from "next/link";
import db from "../../../../lib/db";
import {
  photojournalEntries,
  writingEntries,
  menagerieEntries,
} from "../../../../lib/schema";
import { count } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getCounts() {
  const [[pj], [wr], [mn]] = await Promise.all([
    db.select({ count: count() }).from(photojournalEntries),
    db.select({ count: count() }).from(writingEntries),
    db.select({ count: count() }).from(menagerieEntries),
  ]);
  return { photojournal: pj.count, writing: wr.count, menagerie: mn.count };
}

const sections = [
  {
    key: "photojournal",
    label: "Photojournal",
    href: "/admin/photojournal",
    description: "Photo essays with location, blocks, and map integration",
  },
  {
    key: "writing",
    label: "Writing",
    href: "/admin/writing",
    description: "Long-form pieces with a hero image and text content",
  },
  {
    key: "menagerie",
    label: "Menagerie",
    href: "/admin/menagerie",
    description: "Photo essays without map integration",
  },
];

export default async function AdminIndexPage() {
  const counts = await getCounts();

  return (
    <div>
      <h1 className="text-2xl mb-8">Admin</h1>
      <div className="flex flex-col gap-3">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="flex items-center justify-between border border-gray-700 rounded-lg px-5 py-4 hover:border-indigo-400 hover:text-indigo-400 transition-colors group"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{s.label}</span>
              <span className="text-xs text-gray-500 group-hover:text-indigo-400/70 transition-colors">
                {s.description}
              </span>
            </div>
            <span className="text-sm text-gray-500 tabular-nums">
              {counts[s.key as keyof typeof counts]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
