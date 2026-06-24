export type PhotoBlockContent = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type TextBlockContent = {
  html: string;
};

export type BlockType = "photo" | "text";

export type MemoryBlock = {
  id: number;
  entryId: number;
  position: number;
  type: BlockType;
  content: PhotoBlockContent | TextBlockContent;
};

export type LocalMemory = {
  id: number;
  title: string;
  slug: string;
  date: string;
  opener: string | null;
  locationLat: number | null;
  locationLon: number | null;
  requireKeyForText: boolean;
  previewPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  blocks: MemoryBlock[];
};

export type LocalMemorySummary = Omit<LocalMemory, "blocks">;

// Shape used by the block editor before saving
export type EditorBlock = {
  // Temporary client-side id for React keys before DB save
  clientId: string;
  type: BlockType;
  content: PhotoBlockContent | TextBlockContent;
};

export type EditorState = {
  title: string;
  slug: string;
  date: string;
  opener: string;
  locationLat: string;
  locationLon: string;
  requireKeyForText: boolean;
  previewPhotoUrl: string;
  blocks: EditorBlock[];
};
