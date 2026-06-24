"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WritingState = {
  title: string;
  slug: string;
  date: string;
  heroUrl: string;
  content: string;
};

const defaultState: WritingState = {
  title: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  heroUrl: "",
  content: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type WritingEntryFormProps = {
  initialState?: Partial<WritingState>;
  slug?: string;
};

export default function WritingEntryForm({
  initialState,
  slug,
}: WritingEntryFormProps) {
  const router = useRouter();
  const [state, setState] = useState<WritingState>({
    ...defaultState,
    ...initialState,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!slug;

  function set<K extends keyof WritingState>(key: K, value: WritingState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setState((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }));
  }

  async function handleSave() {
    if (!state.title || !state.slug || !state.date || !state.content) {
      setError("Title, slug, date, and content are required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: state.title,
      slug: state.slug,
      date: state.date,
      heroUrl: state.heroUrl || null,
      content: state.content,
    };

    const url = isEditing ? `/api/writing/${slug}` : "/api/writing";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/writing");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Title *
          </label>
          <input
            type="text"
            value={state.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Entry title"
            className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Slug *
            </label>
            <input
              type="text"
              value={state.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="url-slug"
              className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors font-mono text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Date *
            </label>
            <input
              type="date"
              value={state.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-background text-foreground text-sm outline-none focus:border-indigo-400 transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Hero URL (GIF or image)
          </label>
          <input
            type="text"
            value={state.heroUrl}
            onChange={(e) => set("heroUrl", e.target.value)}
            placeholder="https://media.giphy.com/..."
            className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Content *
          </label>
          <textarea
            value={state.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Write your piece here. Blank lines become visual breaks."
            rows={20}
            className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors resize-y text-sm font-mono"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3 items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="border border-foreground rounded px-6 py-2 hover:border-indigo-400 hover:text-indigo-400 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Publish"}
        </button>
        <button
          onClick={() => router.push("/admin/writing")}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
