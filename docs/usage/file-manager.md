# File Manager

Client-side integration for the FileManager microservice. Supports chunked upload, download, metadata, and CDN image transformations.

## Import

Always import from the barrel:

```tsx
import {
  // Hooks
  useUploadFile,
  useFileMetadata,
  useDownloadFile,
  useDownloadArchive,
  useUploadProgress,
  // CDN
  buildCdnUrl,
  buildCdnPresetUrl,
  // Enums
  FileCategory,
  TransformationPreset,
  ResizeMode,
  CropMode,
  // Service (for direct calls)
  fileManagerService,
} from '@/api/file-manager';
```

---

## 1. Upload a File

The `useUploadFile` hook handles the full chunked upload flow automatically (start session, upload 5 MB chunks, get file ID).

```tsx
const { upload, progress, status, isUploading, cancel, reset, error } = useUploadFile();

async function handleFile(file: File) {
  try {
    const { fileId } = await upload(file, {
      fileCategory: FileCategory.Avatar,
    });
    console.log('Uploaded:', fileId);
  } catch {
    // error is already toasted
  }
}
```

With progress callback:

```tsx
const { fileId } = await upload(file, {
  fileCategory: FileCategory.MenuItem,
  isGlobal: true,
  onProgress: (p) => console.log(`${Math.round(p * 100)}%`),
});
```

### Upload State

| Property      | Type           | Description                        |
| ------------- | -------------- | ---------------------------------- |
| `status`      | `UploadStatus` | `idle` \| `starting` \| `uploading` \| `completing` \| `done` \| `error` |
| `progress`    | `number`       | 0 to 1                            |
| `error`       | `Error \| null`| Error if upload failed             |
| `isUploading` | `boolean`      | `true` during start/upload/complete |
| `isIdle`      | `boolean`      | `true` before any upload           |
| `isDone`      | `boolean`      | `true` after successful upload     |
| `isError`     | `boolean`      | `true` after failed upload         |

### Upload Actions

| Method    | Description                                |
| --------- | ------------------------------------------ |
| `upload`  | `(file: File, options) => Promise<{ fileId, sessionId }>` |
| `cancel`  | Cancels the upload before the next chunk   |
| `reset`   | Resets state back to `idle`                |

---

## 2. File Metadata

```tsx
const { data: metadata, isLoading } = useFileMetadata(
  { fileId: 'some-guid' },
  { enabled: !!fileId },
);

// metadata.fileName, metadata.contentType, metadata.size, metadata.category
```

Response shape:

| Field         | Type           |
| ------------- | -------------- |
| `fileId`      | `string`       |
| `fileName`    | `string`       |
| `contentType` | `string`       |
| `category`    | `FileCategory` |
| `size`        | `number` (bytes) |
| `storageKey`  | `string`       |

---

## 3. Download a File

```tsx
const { mutateAsync: download, isPending } = useDownloadFile();

async function handleDownload(fileId: string) {
  const blob = await download({ fileId, inline: false });

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-file.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
```

Set `inline: true` to display in browser instead of downloading.

---

## 4. Download Multiple Files as ZIP

```tsx
const { mutateAsync: downloadArchive } = useDownloadArchive();

const blob = await downloadArchive({
  fileIds: ['guid-1', 'guid-2', 'guid-3'],
  archiveName: 'my-files',          // optional, defaults to timestamp
});
```

---

## 5. CDN Image URLs

For displaying images with server-side transformations. These are pure URL builders, not API calls. Use directly in `<img src={...}>`.

### Preset URL

```tsx
import { buildCdnPresetUrl, FileCategory, TransformationPreset } from '@/api/file-manager';

<img src={buildCdnPresetUrl({
  category: FileCategory.Avatar,
  fileId: 'some-guid',
  preset: TransformationPreset.Thumbnail,
})} />
```

Available presets:

| Preset      | Size       | Format | Quality |
| ----------- | ---------- | ------ | ------- |
| `Thumbnail` | 150x150    | webp   | 80      |
| `Small`     | 300x300    | webp   | 85      |
| `Medium`    | 800x800    | webp   | 90      |
| `Large`     | 1200x1200  | webp   | 95      |
| `Original`  | No change  | -      | 100     |

### Custom Transformation URL

```tsx
import { buildCdnUrl, FileCategory, ResizeMode, CropMode } from '@/api/file-manager';

<img src={buildCdnUrl({
  category: FileCategory.Avatar,
  fileId: 'some-guid',
  slug: 'profile-photo',
  extension: 'jpg',
  options: {
    width: 300,
    height: 300,
    format: 'webp',
    quality: 85,
    mode: ResizeMode.Crop,
    crop: CropMode.Center,
  },
})} />
```

All options are optional:

| Option    | Type         | Description                              |
| --------- | ------------ | ---------------------------------------- |
| `width`   | `number`     | Target width in pixels                   |
| `height`  | `number`     | Target height in pixels                  |
| `format`  | `string`     | Output format: `webp`, `jpg`, `png`      |
| `quality` | `number`     | Compression quality 1-100                |
| `mode`    | `ResizeMode` | `Max` \| `Crop` \| `Stretch` \| `Pad`   |
| `crop`    | `CropMode`   | `None` \| `Center` \| `Smart` \| `Custom` |

---

## 6. Upload Progress Polling

For tracking an upload session by polling the server (useful for external/background uploads):

```tsx
const { data: progress } = useUploadProgress(
  { sessionId: 'some-session-guid' },
  { enabled: !!sessionId },
);

// progress.uploadedChunks, progress.totalChunks, progress.completed
```

Note: `useUploadFile` already tracks progress client-side. Use `useUploadProgress` only if you need to monitor a session started elsewhere.

---

## Enums

### FileCategory

| Value              | Description         |
| ------------------ | ------------------- |
| `Unknown`          | Unclassified        |
| `Avatar`           | User/profile images |
| `MenuItem`         | Menu item images    |
| `LocalApp`         | Application files   |
| `MenuItemGroup`    | Menu group images   |
| `MenuItemCategory` | Menu category images|
| `KioskBackground`  | Kiosk backgrounds   |

### ResizeMode

| Value     | Description                              |
| --------- | ---------------------------------------- |
| `Max`     | Fit within bounds, keep aspect ratio     |
| `Crop`    | Fill exact dimensions, crop overflow     |
| `Stretch` | Stretch to exact dimensions              |
| `Pad`     | Fit within bounds, pad with background   |

### CropMode

| Value    | Description          |
| -------- | -------------------- |
| `None`   | No cropping          |
| `Center` | Crop from center     |
| `Smart`  | Entropy-based crop   |
| `Custom` | Custom crop region   |

---

## Test Page

All examples are available at `/test/file-manager`.
