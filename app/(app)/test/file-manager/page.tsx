'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  useUploadFile,
  useFileMetadata,
  useDownloadFile,
  FileCategory,
  TransformationPreset,
  buildCdnPresetUrl,
  buildCdnUrl,
} from '@/api/file-manager';
import type { UploadStatus } from '@/api/file-manager';
import { Upload, Download, FileText, Image, X, RotateCcw } from 'lucide-react';

const statusLabels: Record<UploadStatus, string> = {
  idle: 'آماده',
  starting: 'شروع آپلود...',
  uploading: 'در حال آپلود...',
  completing: 'تکمیل آپلود...',
  done: 'تکمیل شد',
  error: 'خطا',
};

const statusColors: Record<UploadStatus, string> = {
  idle: 'bg-muted',
  starting: 'bg-blue-500',
  uploading: 'bg-blue-500',
  completing: 'bg-blue-500',
  done: 'bg-green-500',
  error: 'bg-red-500',
};

const categories = [
  { label: 'آواتار', value: FileCategory.Avatar },
  { label: 'آیتم منو', value: FileCategory.MenuItem },
  { label: 'اپلیکیشن', value: FileCategory.LocalApp },
  { label: 'گروه منو', value: FileCategory.MenuItemGroup },
  { label: 'دسته منو', value: FileCategory.MenuItemCategory },
  { label: 'پس‌زمینه کیوسک', value: FileCategory.KioskBackground },
  { label: 'نامشخص', value: FileCategory.Unknown },
];

export default function FileManagerTestPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>(FileCategory.Avatar);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [lookupFileId, setLookupFileId] = useState('');

  // Hooks
  const { upload, cancel, reset, status, progress, error, isUploading, isDone } = useUploadFile();
  const { mutateAsync: downloadFile, isPending: isDownloading } = useDownloadFile();

  const metadataFileId = uploadedFileId || (lookupFileId.length === 36 ? lookupFileId : '');
  const { data: metadata, isLoading: metadataLoading } = useFileMetadata(
    { fileId: metadataFileId },
    { enabled: !!metadataFileId },
  );

  // Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await upload(file, { fileCategory: selectedCategory });
      setUploadedFileId(result.fileId);
    } catch {
      // error already toasted by hook
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async (fileId: string) => {
    try {
      const blob = await downloadFile({ fileId, inline: false });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = metadata?.fileName ?? 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // error already toasted
    }
  };

  const handleReset = () => {
    reset();
    setUploadedFileId(null);
  };

  const progressPercent = Math.round(progress * 100);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <FileText className="size-6" />
        <h1 className="text-2xl font-bold">تست مدیریت فایل</h1>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            آپلود فایل
          </CardTitle>
          <CardDescription>فایل مورد نظر را انتخاب و آپلود کنید (آپلود به صورت قطعه‌ای ۵ مگابایتی)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">دسته‌بندی فایل</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  size="sm"
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.value)}
                  disabled={isUploading}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* File input + actions */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="text-sm file:me-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
            />
            {isUploading && (
              <Button size="sm" variant="destructive" onClick={cancel}>
                <X className="me-1 size-4" />
                لغو
              </Button>
            )}
            {(isDone || status === 'error') && (
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="me-1 size-4" />
                ریست
              </Button>
            )}
          </div>

          {/* Progress bar */}
          {status !== 'idle' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{statusLabels[status]}</span>
                <Badge variant={status === 'error' ? 'destructive' : status === 'done' ? 'default' : 'secondary'}>
                  {progressPercent}%
                </Badge>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${statusColors[status]}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error.message}</p>}
            </div>
          )}

          {/* Upload result */}
          {isDone && uploadedFileId && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <p>
                <span className="font-medium">شناسه فایل: </span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{uploadedFileId}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* File Metadata Lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            اطلاعات فایل
          </CardTitle>
          <CardDescription>شناسه فایل را وارد کنید یا فایل آپلود شده را مشاهده کنید</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={lookupFileId}
              onChange={(e) => setLookupFileId(e.target.value)}
              placeholder="شناسه فایل (GUID)"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          {metadataLoading && <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>}

          {metadata && (
            <div className="space-y-3 rounded-md border p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">نام فایل: </span>
                  <span className="font-medium">{metadata.fileName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">نوع: </span>
                  <span className="font-medium">{metadata.contentType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">حجم: </span>
                  <span className="font-medium">{formatFileSize(metadata.size)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">دسته‌بندی: </span>
                  <Badge variant="outline">{FileCategory[metadata.category]}</Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleDownload(metadata.fileId)} disabled={isDownloading}>
                  <Download className="me-1 size-4" />
                  {isDownloading ? 'در حال دانلود...' : 'دانلود'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* CDN URL Preview */}
      {metadata && metadata.contentType.startsWith('image/') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="size-5" />
              پیش‌نمایش CDN
            </CardTitle>
            <CardDescription>تصویر آپلود شده با پریست‌های مختلف CDN</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {([
                TransformationPreset.Thumbnail,
                TransformationPreset.Small,
                TransformationPreset.Medium,
                TransformationPreset.Large,
              ] as const).map((preset) => {
                const url = buildCdnPresetUrl({
                  category: metadata.category,
                  fileId: metadata.fileId,
                  preset,
                });
                return (
                  <div key={preset} className="space-y-2">
                    <p className="text-sm font-medium">{preset}</p>
                    <img
                      src={url}
                      alt={preset}
                      className="h-32 w-full rounded-md border object-cover"
                    />
                    <p className="truncate text-xs text-muted-foreground" title={url}>{url}</p>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Custom transform */}
            <div className="space-y-2">
              <p className="text-sm font-medium">تبدیل سفارشی (300x300 webp)</p>
              {(() => {
                const slug = metadata.fileName.replace(/\.[^.]+$/, '').replace(/\s+/g, '-').toLowerCase();
                const ext = metadata.fileName.split('.').pop() ?? 'jpg';
                const url = buildCdnUrl({
                  category: metadata.category,
                  fileId: metadata.fileId,
                  slug,
                  extension: ext,
                  options: { width: 300, height: 300, format: 'webp', quality: 85 },
                });
                return (
                  <>
                    <img
                      src={url}
                      alt="custom"
                      className="h-40 w-40 rounded-md border object-cover"
                    />
                    <p className="truncate text-xs text-muted-foreground" title={url}>{url}</p>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
