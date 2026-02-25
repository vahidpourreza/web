# File Manager API Layer - Design Notes

How the FileManager service integration was designed and why decisions were made.

---

## Architecture Overview

The FileManager is a .NET 9 microservice with its own database. It is accessed through the gateway, not directly.

```
Browser  -->  Gateway  -->  FileManager Service
                |                  |
         api/file/*          /api/v1/files/*
         cdn/*               /cdn/*
```

### Gateway Routing

| Client calls              | Gateway forwards to           |
| ------------------------- | ----------------------------- |
| `api/file/v1/files/...`   | FileManager `/api/v1/files/...` |
| `cdn/...`                 | FileManager `/cdn/...`        |

The gateway strips the `file/` prefix for API routes. CDN routes pass through unchanged.

---

## Backend Endpoints

| Method | Endpoint                                  | Purpose               | Body Type  | Response Type |
| ------ | ----------------------------------------- | --------------------- | ---------- | ------------- |
| POST   | `/api/v1/files/sessions`                  | Start upload session  | JSON       | JSON (GUID)   |
| POST   | `/api/v1/files/sessions/{id}/chunks`      | Upload a chunk        | FormData   | JSON          |
| GET    | `/api/v1/files/sessions/{id}`             | Upload progress       | -          | JSON          |
| GET    | `/api/v1/files/{id}`                      | File metadata         | -          | JSON          |
| GET    | `/api/v1/files/{id}/download`             | Download file         | -          | Binary        |
| POST   | `/api/v1/files/download/archive`          | Download as ZIP       | JSON       | Binary        |
| GET    | `/cdn/{category}/{fileId}_{slug}.{ext}`   | CDN with transforms   | -          | Binary        |
| GET    | `/cdn/{category}/{fileId}/{preset}.{ext}` | CDN with preset       | -          | Binary        |

---

## Chunked Upload Flow

Files are split into 5 MB chunks and uploaded sequentially:

```
1. POST /sessions        -->  get sessionId
2. POST /sessions/{id}/chunks  (chunk 0)
3. POST /sessions/{id}/chunks  (chunk 1)
   ...
4. POST /sessions/{id}/chunks  (chunk N)
   --> server auto-assembles when all chunks arrive
5. GET  /sessions/{id}   -->  get fileId
```

### Why chunked?

- Supports files up to 500 MB
- Resumable: if a chunk fails, only that chunk needs retry
- Progress tracking: report after each chunk
- Memory efficient: `File.slice()` creates a Blob reference without copying

### Why sequential (not parallel)?

- Simpler error handling
- Server expects sequential assembly
- Progress tracking is straightforward
- The bottleneck is network bandwidth, not concurrency

---

## Frontend File Structure

Follows the project's domain-based API pattern (same as `api/access/profile/`, `api/access/workspace/`, etc.):

```
api/file-manager/
  service.ts    -- Enums, types, API call functions
  hooks.ts      -- React Query hooks + useUploadFile
  keys.ts       -- Query key factory
  cdn.ts        -- CDN URL builder utilities
  index.ts      -- Barrel exports
```

### Why a separate `cdn.ts`?

CDN URLs are pure string builders with no API calls and no React dependencies. Keeping them separate from `hooks.ts` allows importing in server components or utility functions without pulling in `'use client'` dependencies.

---

## Key Design Decisions

### 1. String Enums for FileCategory

```ts
enum FileCategory {
  Avatar = 'Avatar',    // not Avatar = 10
}
```

The server's `StartSessionCommand.FileCategory` is a `string` parsed with `Enum.TryParse`. The CDN routes also use the category as a lowercase path segment. A string enum serves both needs:
- API body: use the value directly (`"Avatar"`)
- CDN path: `.toLowerCase()` (`"avatar"`)

This eliminates the need for separate mapping objects.

### 2. Three New Client Helpers

Standard `apiPost`/`apiGet` only handle JSON. FileManager needs:

| Helper            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `apiPostFormData` | Chunk upload (multipart/form-data body)  |
| `apiGetBlob`      | File download (binary response)          |
| `apiPostBlob`     | Archive download (JSON body, binary response) |

These are in `api/client.ts` alongside the existing helpers, following the same `ApiResponse<T>` pattern with `extractMessages` error handling.

### 3. `useUploadFile` is Not a `useMutation`

The upload orchestrates multiple sequential API calls (start session + N chunks + get progress). A `useMutation` wraps a single async function. Using raw `useState` gives:
- Granular `status` states (idle/starting/uploading/completing/done/error)
- Real-time `progress` (0-1) updated after each chunk
- `cancel()` support mid-upload
- `reset()` to reuse the hook

### 4. Client-Side Progress Tracking

Progress is tracked by counting completed chunks (`(i + 1) / totalChunks`) rather than polling the server's progress endpoint. This is more responsive and avoids unnecessary requests.

The `useUploadProgress` hook exists for monitoring sessions started elsewhere (e.g., another tab or background process).

### 5. CDN URLs Use `NEXT_PUBLIC_GATEWAY_URL`

CDN URLs include the full gateway base URL so they work as absolute URLs in `<img src>`. The `NEXT_PUBLIC_` prefix ensures the env var is available in both server and client contexts.

---

## Backend Service Architecture (Reference)

The FileManager microservice uses Clean Architecture:

```
1.Core/
  Domain/          -- Entities (File, Session, Variant), ValueObjects, Enums
  Contracts/       -- Repository interfaces
  RequestResponse/ -- Commands & Queries (CQRS)
  DomainServices/  -- Business logic (StoragePathFactory)

2.Infra/
  Data/Sql.Commands/  -- EF Core (write side)
  Data/Sql.Queries/   -- Dapper (read side)
  Storage/            -- File system storage
  ProcessEngine/      -- Image transformation (ImageSharp)

3.Endpoints/
  API/Storage/Base/   -- FilesController (upload, download, metadata)
  API/Storage/CDN/    -- CDNController (image transformations)
```

### Storage Paths

| Type           | Path Pattern                                          |
| -------------- | ----------------------------------------------------- |
| Global file    | `storage/global/{category}/{fileId}/{filename}`       |
| Tenant file    | `storage/tenants/{tenantId}/{category}/{fileId}/{filename}` |
| Temp chunks    | `storage/temp/{sessionId}/chunk_{index}`              |
| Image variant  | `storage/.../variants/{transformation_hash}/{filename}` |

### Image Variants

CDN endpoints create transformed image variants on-demand and cache them. Subsequent requests for the same transformation return the cached variant. CDN responses include `Cache-Control: public, max-age=31536000, immutable` (1 year).

---

## Adding a New FileCategory

If the backend adds a new `FileCategory` enum value:

1. Add to `FileCategory` in `api/file-manager/service.ts`
2. That's it. No maps or lookups to update.

---

## Related Files

| File                          | Purpose                           |
| ----------------------------- | --------------------------------- |
| `api/client.ts`               | Axios helpers (apiPostFormData, apiGetBlob, apiPostBlob) |
| `api/file-manager/service.ts` | Enums, types, service functions   |
| `api/file-manager/hooks.ts`   | React Query hooks, useUploadFile  |
| `api/file-manager/keys.ts`    | Query key factory                 |
| `api/file-manager/cdn.ts`     | CDN URL builders                  |
| `api/file-manager/index.ts`   | Barrel exports                    |
| `app/(app)/test/file-manager/page.tsx` | Test page               |
