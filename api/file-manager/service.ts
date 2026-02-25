import { apiGet, apiPost, apiPostFormData, apiGetBlob, apiPostBlob } from '@/api/client';

// --- Enums ---

export enum FileCategory {
  Unknown = 'Unknown',
  Avatar = 'Avatar',
  MenuItem = 'MenuItem',
  LocalApp = 'LocalApp',
  MenuItemGroup = 'MenuItemGroup',
  MenuItemCategory = 'MenuItemCategory',
  KioskBackground = 'KioskBackground',
}

export enum TransformationPreset {
  Thumbnail = 'thumbnail',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Original = 'original',
}

export enum ResizeMode {
  Max = 'max',
  Crop = 'crop',
  Stretch = 'stretch',
  Pad = 'pad',
}

export enum CropMode {
  None = 'none',
  Center = 'center',
  Smart = 'smart',
  Custom = 'custom',
}

// --- Requests ---

export interface StartUploadSessionRequest {
  fileName: string;
  fileByteSize: number;
  fileCategory: FileCategory;
  contentType: string;
  isGlobal: boolean;
}

export interface UploadChunkRequest {
  sessionId: string;
  chunkIndex: number;
  file: Blob;
}

export interface GetUploadProgressRequest {
  sessionId: string;
}

export interface GetFileMetadataRequest {
  fileId: string;
}

export interface DownloadFileRequest {
  fileId: string;
  inline?: boolean;
}

export interface DownloadArchiveRequest {
  fileIds: string[];
  archiveName?: string;
}

// --- Responses ---

export interface UploadProgressResponse {
  fileId: string;
  sessionId: string;
  uploadedChunks: number[];
  chunksize: number;
  totalChunks: number;
  ttl: string;
  completed: boolean;
}

export interface FileMetadataResponse {
  fileId: string;
  fileName: string;
  contentType: string;
  category: FileCategory;
  size: number;
  storageKey: string;
}

// --- Service ---

const BASE = '/api/file/v1/files';

export const fileManagerService = {
  startSession: (data: StartUploadSessionRequest) =>
    apiPost<string>(`${BASE}/sessions`, data),

  uploadChunk: (data: UploadChunkRequest) => {
    const formData = new FormData();
    formData.append('chunkIndex', data.chunkIndex.toString());
    formData.append('file', data.file);
    return apiPostFormData<void>(`${BASE}/sessions/${data.sessionId}/chunks`, formData);
  },

  getUploadProgress: (data: GetUploadProgressRequest) =>
    apiGet<UploadProgressResponse>(`${BASE}/sessions/${data.sessionId}`),

  getFileMetadata: (data: GetFileMetadataRequest) =>
    apiGet<FileMetadataResponse>(`${BASE}/${data.fileId}`),

  downloadFile: (data: DownloadFileRequest) =>
    apiGetBlob(`${BASE}/${data.fileId}/download`, { inline: data.inline }),

  downloadArchive: (data: DownloadArchiveRequest) =>
    apiPostBlob(`${BASE}/download/archive`, data),
};
