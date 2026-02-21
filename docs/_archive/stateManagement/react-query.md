# TanStack Query (React Query) — Beginner Guide

TanStack Query is a **server state management** library. It handles fetching, caching, and syncing data from your API — replacing the manual `useEffect` + `useState` pattern.

---

## The Problem It Solves

Every time you fetch data in React, you write this:

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/users')
    .then((res) => res.json())
    .then((data) => setData(data))
    .catch((err) => setError(err))
    .finally(() => setLoading(false));
}, []);
```

**This has problems:**

1. **Duplicated everywhere** — every component that needs data repeats this pattern
2. **No caching** — navigate away and come back = fetch again
3. **No sharing** — two components need the same data = two separate API calls
4. **Stale data** — if another tab updates the data, your component still shows the old version
5. **No automatic refetch** — user comes back to the tab after 10 minutes, data might be outdated

TanStack Query solves all of these.

---

## Installation

```bash
pnpm add @tanstack/react-query
```

---

## Setup — QueryClientProvider

Before using any queries, wrap your app in a provider (once, at the root):

```tsx
// app/providers.tsx (or wherever your providers live)
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create the client inside the component so each user gets their own cache
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Then add it to your layout:

```tsx
// app/layout.tsx
<QueryProvider>
  {children}
</QueryProvider>
```

---

## Core Concepts

### 1. `useQuery` — Fetch and cache data

```tsx
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],                        // unique cache key
    queryFn: () => fetch('/api/users').json(),   // how to fetch
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**What happens behind the scenes:**

```
Component mounts
  → Is ['users'] in the cache?
    → NO  → call queryFn → store result in cache → render data
    → YES → return cached data immediately
             → is it stale? → YES → refetch in background → update if changed
```

### 2. `queryKey` — The cache address

Think of it as a **unique label** for each piece of data:

```tsx
// Different data = different keys
useQuery({ queryKey: ['users'], ... })            // all users
useQuery({ queryKey: ['users', 123], ... })       // user with id 123
useQuery({ queryKey: ['users', { role: 'admin' }], ... })  // filtered users
useQuery({ queryKey: ['posts', userId], ... })    // posts by a specific user
```

**Rules:**
- Same key = same cached data (shared between all components that use it)
- Key changes = new fetch (e.g., `userId` changes → new posts are fetched)
- Keys are compared by deep equality

### 3. `queryFn` — How to fetch the data

This is your API call. It can be anything that returns a promise:

```tsx
// Using fetch
queryFn: () => fetch('/api/users').then(res => res.json())

// Using axios
queryFn: () => axios.get('/api/users').then(res => res.data)

// Using your project's service layer
queryFn: () => profileService.get().then(res => res.data)
```

### 4. `staleTime` — How long data is considered fresh

```tsx
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

| `staleTime` | Behavior |
|-------------|----------|
| `0` (default) | Data is immediately stale → refetch on every mount/focus |
| `5 * 60 * 1000` | Data is fresh for 5 minutes → no refetch during this time |
| `Infinity` | Data never becomes stale → only fetch once |

**"Fresh" data is never refetched. "Stale" data is refetched in the background.**

### 5. Return values — What `useQuery` gives you

```tsx
const {
  data,          // The fetched data (undefined until loaded)
  isLoading,     // true on FIRST load (no cached data yet)
  isFetching,    // true whenever a fetch is happening (including background refetch)
  isError,       // true if the last fetch failed
  error,         // the error object
  isSuccess,     // true if data is available
  refetch,       // function to manually trigger a refetch
} = useQuery({ ... });
```

**`isLoading` vs `isFetching`:**
- `isLoading` = first time, no data yet → show a skeleton
- `isFetching` = any fetch, even background → show a subtle spinner

```tsx
// Show skeleton on first load
if (isLoading) return <Skeleton />;

// Show data + subtle refetch indicator
return (
  <div>
    {isFetching && <Spinner className="small" />}
    <UserList users={data} />
  </div>
);
```

---

## Mutations — Creating, Updating, Deleting

`useQuery` is for **reading**. `useMutation` is for **writing**.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    }),
    onSuccess: () => {
      // After creating a user, refresh the users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: 'Ali', email: 'ali@example.com' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Creating...' : 'Create User'}
    </button>
  );
}
```

**`invalidateQueries`** is the key — it tells React Query: "The `['users']` data is stale now, refetch it." Every component using `useQuery(['users'])` will automatically get the updated list.

---

## How Caching Works (Visual)

```
Component A: useQuery({ queryKey: ['profile'] })
Component B: useQuery({ queryKey: ['profile'] })
Component C: useQuery({ queryKey: ['posts'] })

Cache:
┌─────────────────────────────────────┐
│  ['profile'] → { name: 'Ali', ... } │ ← Shared by A and B (1 fetch)
│  ['posts']   → [{ title: '...' }]   │ ← Used by C only
└─────────────────────────────────────┘

When Component A calls:
  queryClient.invalidateQueries({ queryKey: ['profile'] })

→ Cache marks ['profile'] as stale
→ Both Component A and B get the new data automatically
→ ['posts'] is unaffected
```

---

## Automatic Behaviors

React Query does these **out of the box** (no code needed):

| Behavior | What it does |
|----------|-------------|
| **Refetch on window focus** | User switches tabs and comes back → stale data is refetched |
| **Refetch on reconnect** | User loses internet and reconnects → stale data is refetched |
| **Retry on failure** | API call fails → retries 3 times with exponential backoff |
| **Garbage collection** | Cached data unused for 5 minutes → removed from memory |
| **Deduplication** | 3 components mount at the same time with the same key → 1 API call |

You can configure or disable any of these:

```tsx
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  refetchOnWindowFocus: false,   // disable refetch on tab focus
  retry: 1,                      // retry once instead of 3 times
  gcTime: 10 * 60 * 1000,        // keep unused data for 10 minutes
});
```

---

## Real-World Example — Profile Page

This is how your `account-sheet.tsx` would look with React Query:

```tsx
// hooks/use-profile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/api/services/access/profile';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { ok, data, messages } = await profileService.get();
      if (!ok || !data) throw new Error(messages);
      return data;
    },
    staleTime: 2 * 60 * 1000, // fresh for 2 minutes
  });
}

export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateFullName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
```

```tsx
// In the component
function PersonalTab() {
  const { data: profile, isLoading } = useProfile();
  const updateName = useUpdateName();

  if (isLoading) return <Skeleton />;

  async function onSubmit(data: PersonalForm) {
    const { ok, messages } = await updateName.mutateAsync(data);
    if (!ok) toast.error(messages);
    else toast.success('Saved!');
    // No need for setProfile() — invalidateQueries handles it
  }
}
```

**Benefits over the current approach:**
- No `useState` for `profile`, `loading`, or `error`
- No `useEffect` to fetch on mount
- If another component also calls `useProfile()`, they share the same cached data
- After mutation, all profile consumers auto-update

---

## When to Use It vs When NOT to

### Use React Query for:
- Data from APIs (server state)
- Data that multiple components need
- Data that should be cached and refreshed
- Lists, tables, dashboards, profiles

### DON'T use React Query for:
- UI state (modals, toggles, tabs) → use `useState`
- Form input values → use React Hook Form
- Theme, locale, auth session → use Context or dedicated libraries
- Client-only state (shopping cart, draft) → use `useState` / `useReducer` / Redux

---

## Cheat Sheet

| Task | Code |
|------|------|
| Fetch data | `useQuery({ queryKey: ['key'], queryFn: fetchFn })` |
| Check loading | `const { isLoading } = useQuery(...)` |
| Check error | `const { isError, error } = useQuery(...)` |
| Create/update/delete | `useMutation({ mutationFn: saveFn })` |
| Trigger mutation | `mutation.mutate(data)` |
| Refresh after mutation | `queryClient.invalidateQueries({ queryKey: ['key'] })` |
| Set cache freshness | `staleTime: 60_000` (1 minute) |
| Disable auto-refetch | `refetchOnWindowFocus: false` |
| Manual refetch | `const { refetch } = useQuery(...)` then `refetch()` |
| Prefetch data | `queryClient.prefetchQuery({ queryKey, queryFn })` |
