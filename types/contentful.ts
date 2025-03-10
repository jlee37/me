// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset } from "contentful";

export interface IPhotoEssayFields {
  /** Title */
  title?: string | undefined;

  /** Date */
  date?: string | undefined;

  /** Location */
  location?: { lat: number; lon: number } | undefined;

  /** Slug */
  slug?: string;

  /** Photos */
  photos?: Asset[] | undefined;
}

export type PhotoEssay = {
  fields: IPhotoEssayFields;
}