
import { Asset } from "contentful";

// Annoying to have to make these all optional.
export interface IWritingFields {
  title?: string;
  heroUrl?: string;
  content?: string;
  date?: string;
  slug?: string
}

export type Writing = {
  fields: IWritingFields;
}

export interface IPhotoEssayFields {
  /** Title */
  title?: string | undefined;

  /** Date */
  date?: string | undefined;

  opener?: string

  /** Location */
  location?: { lat: number; lon: number } | undefined;

  /** Slug */
  slug?: string;

  /** Photos */
  photos?: Asset[] | undefined;

  previewPhoto?: Asset
}

export type PhotoEssay = {
  fields: IPhotoEssayFields;
}

export interface IMemoryFields {
  /** Title */
  title?: string | undefined;

  /** Date */
  date?: string | undefined;

  opener?: string

  /** Location */
  location?: { lat: number; lon: number } | undefined;

  /** Slug */
  slug?: string;

  /** Photos */
  photos?: Asset[] | undefined;

  previewPhoto?: Asset

  requireKeyForText?: boolean
}

export type Memory = {
  fields: IMemoryFields;
}
