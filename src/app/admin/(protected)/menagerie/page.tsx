import Link from "next/link";
import db from "../../../../../lib/db";
import { menagerieEntries } from "../../../../../lib/schema";
import { desc } from "drizzle-orm";
import DeleteEntryButton from "@/components/DeleteEntryButton";

export const dynamic = "force-dynamic";

export default async function AdminMenageriePage() {
  const entries = await db
    .select()
    .from(menagerieEntries)
    .orderBy(desc(menagerieEntries.date));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Menagerie</h1>
        <Link
          href="/admin/menagerie/new"
          className="border border-foreground rounded px-4 py-2 text-sm hover:border-indigo-400 hover:text-indigo-400 transition-colors"
        >
          + New entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm">No entries yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between border border-gray-700 rounded-lg px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{entry.title}</span>
                <span className="text-xs text-gray-500 font-mono">
                  {entry.slug} · {entry.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/menagerie/${entry.slug}`}
                  target="_blank"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  View
                </Link>
                <Link
                  href={`/admin/menagerie/${entry.slug}`}
                  className="text-xs border border-gray-700 rounded px-3 py-1 hover:border-indigo-400 hover:text-indigo-400 transition-colors"
                >
                  Edit
                </Link>
                <DeleteEntryButton apiUrl={`/api/menagerie/${entry.slug}`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
