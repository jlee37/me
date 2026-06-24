"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  EditorBlock,
  PhotoBlockContent,
  TextBlockContent,
} from "../../types/journal";
import { GripVertical, Trash2, ImagePlus, Type } from "lucide-react";

// ─── Tiptap text block ────────────────────────────────────────────────────────

function TextBlock({
  block,
  onChange,
}: {
  block: EditorBlock;
  onChange: (content: TextBlockContent) => void;
}) {
  const content = block.content as TextBlockContent;
  const editor = useEditor({
    extensions: [StarterKit],
    content: content.html || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange({ html: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none outline-none min-h-[60px] text-sm md:text-base",
      },
    },
  });

  return (
    <div className="border border-gray-700 rounded-md p-3 bg-background focus-within:border-indigo-400 transition-colors">
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Sortable block wrapper ───────────────────────────────────────────────────

function SortableBlock({
  block,
  onDelete,
  onChangeContent,
  uploading,
}: {
  block: EditorBlock;
  onDelete: () => void;
  onChangeContent: (content: EditorBlock["content"]) => void;
  uploading?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.clientId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 group">
      {/* Drag handle */}
      <button
        {...listeners}
        {...attributes}
        className="flex-shrink-0 mt-1 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 min-w-0">
        {block.type === "photo" ? (
          <PhotoBlock
            block={block}
            uploading={uploading}
            onChangeCaption={(caption) => {
              const c = block.content as PhotoBlockContent;
              onChangeContent({ ...c, caption });
            }}
          />
        ) : (
          <TextBlock
            block={block}
            onChange={(content) => onChangeContent(content)}
          />
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 mt-1 text-gray-600 hover:text-red-400 transition-colors"
        aria-label="Delete block"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function PhotoBlock({
  block,
  onChangeCaption,
  uploading,
}: {
  block: EditorBlock;
  onChangeCaption: (caption: string) => void;
  uploading?: boolean;
}) {
  const content = block.content as PhotoBlockContent;
  if (uploading) {
    return (
      <div className="border border-gray-700 rounded-md p-4 flex items-center gap-2 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        Uploading...
      </div>
    );
  }
  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <div className="relative w-full max-h-[400px] flex items-center justify-center bg-gray-900">
        <Image
          src={content.url}
          alt={content.caption || ""}
          width={content.width || 1200}
          height={content.height || 800}
          className="max-h-[400px] w-auto object-contain"
          unoptimized
        />
      </div>
      <input
        type="text"
        value={content.caption || ""}
        onChange={(e) => onChangeCaption(e.target.value)}
        placeholder="Caption (optional)"
        className="w-full px-3 py-2 text-sm bg-background border-t border-gray-700 outline-none focus:border-indigo-400 transition-colors"
      />
    </div>
  );
}

// ─── Add block affordance ─────────────────────────────────────────────────────

function AddBlockRow({
  onAddText,
  onAddPhoto,
}: {
  onAddText: () => void;
  onAddPhoto: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-gray-800" />
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-gray-600 hover:text-indigo-400 transition-colors text-xs border border-gray-700 rounded px-2 py-0.5 hover:border-indigo-400"
      >
        + add
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 flex flex-col border border-gray-700 rounded-md bg-background shadow-lg overflow-hidden">
          <button
            onClick={() => {
              onAddPhoto();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
          >
            <ImagePlus size={14} /> Photo
          </button>
          <button
            onClick={() => {
              onAddText();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
          >
            <Type size={14} /> Text
          </button>
        </div>
      )}
      <div className="flex-1 h-px bg-gray-800" />
    </div>
  );
}

// ─── Main BlockEditor ─────────────────────────────────────────────────────────

export type BlockEditorProps = {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
};

let clientIdCounter = 0;
function nextClientId() {
  return `block-${++clientIdCounter}-${Math.random().toString(36).slice(2)}`;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertAfterIndex = useRef<number>(-1);
  // Keep a ref to the latest blocks to avoid stale closures in async upload handler
  const blocksRef = useRef<EditorBlock[]>(blocks);
  blocksRef.current = blocks;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.clientId === active.id);
        const newIndex = blocks.findIndex((b) => b.clientId === over.id);
        onChange(arrayMove(blocks, oldIndex, newIndex));
      }
    },
    [blocks, onChange]
  );

  const addTextBlock = useCallback(
    (afterIndex: number) => {
      const newBlock: EditorBlock = {
        clientId: nextClientId(),
        type: "text",
        content: { html: "<p></p>" },
      };
      const next = [...blocks];
      next.splice(afterIndex + 1, 0, newBlock);
      onChange(next);
    },
    [blocks, onChange]
  );

  const openFilePicker = useCallback((afterIndex: number) => {
    insertAfterIndex.current = afterIndex;
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      e.target.value = "";

      const afterIndex = insertAfterIndex.current;

      const placeholders: EditorBlock[] = files.map((f) => ({
        clientId: nextClientId(),
        type: "photo",
        content: { url: URL.createObjectURL(f), caption: "", width: 0, height: 0 },
      }));

      const uploadingSet = new Set(placeholders.map((p) => p.clientId));
      setUploadingIds((prev) => new Set([...prev, ...uploadingSet]));

      const next = [...blocksRef.current];
      next.splice(afterIndex + 1, 0, ...placeholders);
      onChange(next);

      // Upload each file
      const results = await Promise.all(
        files.map(async (file, i) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const { url } = await res.json();

          // Get image dimensions
          const dims = await new Promise<{ w: number; h: number }>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.src = URL.createObjectURL(file);
          });

          return { id: placeholders[i].clientId, url, dims };
        })
      );

      const updated = blocksRef.current.map((b) => {
        const result = results.find((r) => r.id === b.clientId);
        if (!result) return b;
        return {
          ...b,
          content: {
            url: result.url,
            caption: (b.content as PhotoBlockContent).caption || "",
            width: result.dims.w,
            height: result.dims.h,
          } as PhotoBlockContent,
        };
      });
      onChange(updated);

      setUploadingIds((prev) => {
        const next = new Set(prev);
        results.forEach((r) => next.delete(r.id));
        return next;
      });
    },
    [blocks, onChange]
  );

  const deleteBlock = useCallback(
    (clientId: string) => {
      onChange(blocks.filter((b) => b.clientId !== clientId));
    },
    [blocks, onChange]
  );

  const updateBlockContent = useCallback(
    (clientId: string, content: EditorBlock["content"]) => {
      onChange(
        blocks.map((b) => (b.clientId === clientId ? { ...b, content } : b))
      );
    },
    [blocks, onChange]
  );

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <AddBlockRow
        onAddText={() => addTextBlock(-1)}
        onAddPhoto={() => openFilePicker(-1)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.clientId)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, i) => (
            <div key={block.clientId} className="flex flex-col gap-1">
              <SortableBlock
                block={block}
                uploading={uploadingIds.has(block.clientId)}
                onDelete={() => deleteBlock(block.clientId)}
                onChangeContent={(content) =>
                  updateBlockContent(block.clientId, content)
                }
              />
              <AddBlockRow
                onAddText={() => addTextBlock(i)}
                onAddPhoto={() => openFilePicker(i)}
              />
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
