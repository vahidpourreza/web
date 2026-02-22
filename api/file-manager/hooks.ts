'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { fileManagerService, FileCategory } from './service';
import { fileManagerKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  GetUploadProgressRequest,
  GetFileMetadataRequest,
  DownloadFileRequest,
  DownloadArchiveRequest,
} from './service';

// --- Query Hooks ---

export function useUploadProgress(
  data: GetUploadProgressRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: fileManagerKeys.session(data.sessionId),
    queryFn: () => unwrapApiResponse(fileManagerService.getUploadProgress(data)),
    staleTime: 0,
    refetchInterval: enabled ? 3000 : false,
    enabled,
  });
}

export function useFileMetadata(
  data: GetFileMetadataRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: fileManagerKeys.file(data.fileId),
    queryFn: () => unwrapApiResponse(fileManagerService.getFileMetadata(data)),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

// --- Mutation Hooks ---

export function useDownloadFile() {
  return useMutation({
    mutationFn: (data: DownloadFileRequest) =>
      unwrapApiResponse(fileManagerService.downloadFile(data)),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDownloadArchive() {
  return useMutation({
    mutationFn: (data: DownloadArchiveRequest) =>
      unwrapApiResponse(fileManagerService.downloadArchive(data)),
    onError: (e: Error) => toast.error(e.message),
  });
}

// --- High-Level Upload Hook ---

export interface UploadFileOptions {
  fileCategory: FileCategory;
  isGlobal?: boolean;
  onProgress?: (progress: number) => void;
}

export interface UploadFileResult {
  fileId: string;
  sessionId: string;
}

export type UploadStatus = 'idle' | 'starting' | 'uploading' | 'completing' | 'done' | 'error';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

export function useUploadFile() {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef(false);
  const qc = useQueryClient();

  const upload = useCallback(
    async (file: File, options: UploadFileOptions): Promise<UploadFileResult> => {
      abortRef.current = false;
      setStatus('starting');
      setProgress(0);
      setError(null);

      try {
        // 1. Start session
        const sessionId = await unwrapApiResponse(
          fileManagerService.startSession({
            fileName: file.name,
            fileByteSize: file.size,
            fileCategory: options.fileCategory,
            contentType: file.type || 'application/octet-stream',
            isGlobal: options.isGlobal ?? false,
          }),
        );

        // 2. Upload chunks sequentially
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        setStatus('uploading');

        for (let i = 0; i < totalChunks; i++) {
          if (abortRef.current) throw new Error('آپلود لغو شد');

          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          await unwrapVoidResponse(
            fileManagerService.uploadChunk({
              sessionId,
              chunkIndex: i,
              file: chunk,
            }),
          );

          const currentProgress = (i + 1) / totalChunks;
          setProgress(currentProgress);
          options.onProgress?.(currentProgress);
        }

        // 3. Get final result to obtain fileId
        setStatus('completing');
        const result = await unwrapApiResponse(
          fileManagerService.getUploadProgress({ sessionId }),
        );

        if (!result.completed || !result.fileId) {
          throw new Error('آپلود با موفقیت تکمیل نشد');
        }

        qc.invalidateQueries({ queryKey: fileManagerKeys.all });
        setStatus('done');
        toast.success('فایل با موفقیت آپلود شد');

        return { fileId: result.fileId, sessionId };
      } catch (err) {
        const uploadError = err instanceof Error ? err : new Error('خطای ناشناخته');
        setError(uploadError);
        setStatus('error');
        toast.error(uploadError.message);
        throw uploadError;
      }
    },
    [qc],
  );

  const cancel = useCallback(() => {
    abortRef.current = true;
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    abortRef.current = false;
  }, []);

  return {
    upload,
    cancel,
    reset,
    status,
    progress,
    error,
    isUploading: status === 'starting' || status === 'uploading' || status === 'completing',
    isIdle: status === 'idle',
    isDone: status === 'done',
    isError: status === 'error',
  };
}
