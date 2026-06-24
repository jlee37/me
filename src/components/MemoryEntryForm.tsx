"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor } from "./BlockEditor";
import { EditorState, PhotoBlockContent } from "../../types/journal";
import { makeClientId } from "../utils/journalUtils";

type MemoryEntryFormProps = {
  initialState?: Partial<EditorState>;
  slug?: string; // if set, we're editing an existing entry (PUT); if not, POST
};

const defaultState: EditorState = {
  title: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  opener: "",
  locationLat: "",
  locationLon: "",
  requireKeyForText: false,
  previewPhotoUrl: "",
  blocks: [],
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function MemoryEntryForm({
  initialState,
  slug,
}: MemoryEntryFormProps) {
  const router = useRouter();
  const [state, setState] = useState<EditorState>({
    ...defaultState,
    ...initialState,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!slug;

  function set<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    setState((prev) => ({
      ...prev,
      title,
      // Auto-generate slug only for new entries and only if user hasn't touched it
      slug: isEditing ? prev.slug : slugify(title),
    }));
  }

  async function handleSave() {
    if (!state.title || !state.slug || !state.date) {
      setError("Title, slug, and date are required.");
      return;
    }

    setSaving(true);
    setError("");

    // Auto-pick previewPhotoUrl from first photo block if not set
    let previewPhotoUrl = state.previewPhotoUrl;
    if (!previewPhotoUrl) {
      const firstPhoto = state.blocks.find((b) => b.type === "photo");
      if (firstPhoto) {
        previewPhotoUrl = (firstPhoto.content as PhotoBlockContent).url;
      }
    }

    const payload = {
      title: state.title,
      slug: state.slug,
      date: state.date,
      opener: state.opener || null,
      locationLat: state.locationLat ? parseFloat(state.locationLat) : null,
      locationLon: state.locationLon ? parseFloat(state.locationLon) : null,
      requireKeyForText: state.requireKeyForText,
      previewPhotoUrl: previewPhotoUrl || null,
      blocks: state.blocks.map((b) => ({
        type: b.type,
        content: b.content,
      })),
    };

    const url = isEditing ? `/api/memories/${slug}` : "/api/memories";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/photojournal");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Metadata fields */}
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
              className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Opener (intro paragraph)
          </label>
          <textarea
            value={state.opener}
            onChange={(e) => set("opener", e.target.value)}
            placeholder="Optional intro text shown above the blocks..."
            rows={3}
            className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors resize-y text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Latitude (for Atlas)
            </label>
            <input
              type="number"
              step="any"
              value={state.locationLat}
              onChange={(e) => set("locationLat", e.target.value)}
              placeholder="e.g. 40.7128"
              className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Longitude (for Atlas)
            </label>
            <input
              type="number"
              step="any"
              value={state.locationLon}
              onChange={(e) => set("locationLon", e.target.value)}
              placeholder="e.g. -74.0060"
              className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Preview photo URL
          </label>
          <input
            type="text"
            value={state.previewPhotoUrl}
            onChange={(e) => set("previewPhotoUrl", e.target.value)}
            placeholder="Leave blank to auto-use first photo"
            className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors text-sm"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={state.requireKeyForText}
            onChange={(e) => set("requireKeyForText", e.target.checked)}
            className="w-4 h-4 accent-indigo-400"
          />
          <span className="text-sm">Require key to show text (?key=xyz)</span>
        </label>
      </div>

      {/* Block editor */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          Content blocks
        </p>
        <BlockEditor
          blocks={state.blocks}
          onChange={(blocks) => set("blocks", blocks)}
        />
      </div>

      {/* Save */}
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
          onClick={() => router.push("/admin/photojournal")}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
