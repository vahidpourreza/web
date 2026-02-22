import type { FileCategory } from './service';
import type { TransformationPreset, ResizeMode, CropMode } from './service';

// --- Types ---

export interface CdnTransformOptions {
  width?: number;
  height?: number;
  format?: string;
  quality?: number;
  mode?: ResizeMode;
  crop?: CropMode;
}

export interface CdnUrlParams {
  category: FileCategory;
  fileId: string;
  slug: string;
  extension: string;
  options?: CdnTransformOptions;
}

export interface CdnPresetUrlParams {
  category: FileCategory;
  fileId: string;
  preset: TransformationPreset;
  extension?: string;
}

// --- Helpers ---

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? '';

// --- Builders ---

export function buildCdnUrl({ category, fileId, slug, extension, options }: CdnUrlParams): string {
  const base = `${GATEWAY_URL}/cdn/${category.toLowerCase()}/${fileId}_${slug}.${extension}`;

  if (!options) return base;

  const params = new URLSearchParams();
  if (options.width != null) params.set('w', String(options.width));
  if (options.height != null) params.set('h', String(options.height));
  if (options.format) params.set('format', options.format);
  if (options.quality != null) params.set('q', String(options.quality));
  if (options.mode) params.set('mode', options.mode);
  if (options.crop) params.set('crop', options.crop);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function buildCdnPresetUrl({ category, fileId, preset, extension = 'webp' }: CdnPresetUrlParams): string {
  return `${GATEWAY_URL}/cdn/${category.toLowerCase()}/${fileId}/${preset}.${extension}`;
}
