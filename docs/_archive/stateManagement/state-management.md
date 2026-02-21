# State Management Guide

This document describes the state management strategy for the project, based on an audit of all components and pages.

---

## Current Stack

| Tool              | Purpose                  | Status    |
| ----------------- | ------------------------ | --------- |
| `useState`        | Simple local state       | In use    |
| React Context     | Shared UI state          | In use    |
| next-auth         | Auth / session           | In use    |
| next-themes       | Theme (dark/light)       | In use    |
| React Hook Form   | Form state & validation  | To install |
| `useReducer`      | Complex non-form state   | Not needed yet |
| Redux             | Global client state      | Not needed yet |
| TanStack Query    | Server state cache       | Not needed yet |

---

## 1. `useState` — Simple Local State

**When to use:** A component needs 1-3 independent state values (toggles, selections, simple inputs).

**Currently used in:**

| File                                   | State                        | Why `useState` is enough                         |
| -------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `components/sidebar/nav-user.tsx`      | `accountOpen` (boolean)      | Single toggle to open/close a sheet              |
| `components/sidebar/team-switcher.tsx` | `activeTeam` (object)        | Single selection from a list                     |
| `hooks/use-mobile.ts`                  | `isMobile` (boolean)         | One value derived from a media query listener    |
| `components/ui/persian-calendar.tsx`   | `navView`, `displayYears`    | Two independent UI navigation values             |

**Rule of thumb:** If you have 1-3 `useState` calls and the values don't depend on each other, `useState` is the right choice. Don't overcomplicate it.

```tsx
// Good — simple, independent values
const [open, setOpen] = useState(false);
const [selected, setSelected] = useState<Item | null>(null);
```

---

## 2. React Context — Shared UI State

**When to use:** Multiple components in a subtree need to read/write the same UI state (sidebar open/closed, drawer visibility, locale direction).

**Currently used in:**

| Context            | File                          | What it shares                                          | Consumers                                      |
| ------------------ | ----------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| `SidebarContext`   | `components/ui/sidebar.tsx`   | `open`, `openMobile`, `state`, `toggleSidebar`, `isMobile` | `NavUser`, `TeamSwitcher`, `SidebarTrigger`, etc. |
| `DirectionProvider`| `components/ui/direction.tsx` | RTL direction for Radix components                      | Entire app (via root layout)                   |

**When NOT to use Context:**

- For server data (API responses) — Context doesn't handle caching, refetching, or stale data. Use TanStack Query instead (see section 7).
- For high-frequency updates — Context re-renders all consumers on every change. For things like mouse position or animation frames, use refs or external stores.

```tsx
// Good — shared UI state that multiple components read
const SidebarContext = React.createContext<SidebarContextProps>({...});

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return React.useContext(SidebarContext);
}
```

---

## 3. next-auth — Auth & Session

**When to use:** Anything related to the logged-in user's identity, tokens, or auth flow.

**Currently used in:**

| File                            | Usage                                                     |
| ------------------------------- | --------------------------------------------------------- |
| `providers/auth-provider.tsx`   | Wraps the app in `<SessionProvider>` with auto-refresh    |
| `hooks/use-current-user.ts`    | Typed wrapper around `useSession()` — returns `user`, `isLoading`, `isAuthenticated`, `accessToken` |
| `components/sidebar/nav-user.tsx` | Reads `session.idToken` for logout URL                 |
| `app/(auth)/login/page.tsx`    | Orchestrates sign-in/sign-out based on session status     |

**Convention:** Always use the `useCurrentUser()` hook instead of calling `useSession()` directly. It provides typed claims and a cleaner API.

```tsx
// Good
const { user, isLoading, isAuthenticated } = useCurrentUser();

// Avoid — untyped, raw session
const { data: session } = useSession();
```

---

## 4. next-themes — Theme

**When to use:** Reading or changing the current theme (dark/light/system).

**Currently used in:**

| File                                  | Usage                                      |
| ------------------------------------- | ------------------------------------------ |
| `components/theme/theme-provider.tsx` | Wraps app with `<ThemeProvider>`           |
| `components/theme/mode-toggle.tsx`    | Toggle button using `useTheme()`           |

This is a solved problem. No custom state needed — `next-themes` handles persistence (localStorage), SSR hydration, and the `class` attribute on `<html>`.

```tsx
const { theme, setTheme } = useTheme();
```

---

## 5. React Hook Form + Zod — Forms (to install)

**When to use:** Any component with form inputs, validation, and submission.

**Migration target:**

| File                                        | Current approach                    | Problem                                                                |
| ------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `components/account/account-sheet.tsx`      | 17 `useState` calls + manual `if` validation | Boilerplate, error-prone, no dirty tracking, manual error clearing |

**What React Hook Form replaces:**

| Before (manual)                              | After (React Hook Form + Zod)                  |
| -------------------------------------------- | ----------------------------------------------- |
| `useState` per field                         | `register('fieldName')` — no state needed       |
| `useState` for errors                        | `formState.errors` — automatic                  |
| Manual `if (!field.trim())` checks           | Zod schema: `z.string().min(1, 'Required')`    |
| `clearError('field')` on every `onChange`    | Automatic — errors clear on valid input         |
| `isSaving` flag                              | `formState.isSubmitting` — built-in             |

**Example of what the migration looks like:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const nameSchema = z.object({
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
});

type NameForm = z.infer<typeof nameSchema>;

function PersonalTab() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
  });

  async function onSubmit(data: NameForm) {
    const { ok, messages } = await profileService.updateFullName(data);
    if (!ok) toast.error(messages);
    else toast.success('نام با موفقیت ذخیره شد');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('firstName')} aria-invalid={!!errors.firstName} />
      {errors.firstName && <p>{errors.firstName.message}</p>}

      <Input {...register('lastName')} aria-invalid={!!errors.lastName} />
      {errors.lastName && <p>{errors.lastName.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'در حال ذخیره...' : 'ذخیره مشخصات'}
      </Button>
    </form>
  );
}
```

**Installation:**

```bash
pnpm add react-hook-form @hookform/resolvers zod
```

**Apply this pattern to every future form** in the project (login forms, settings forms, CRUD forms, etc.).

---

## 6. `useReducer` — Complex Non-Form State (not needed yet)

**When to use:** A component has many interdependent state values that change together and the logic is **not** a form.

**Examples of when you'd need it:**

- Multi-step wizard with branching: step 1 -> if verified -> step 3, if not -> step 2 -> retry
- A drag-and-drop board where moving an item updates the source list, target list, and undo stack in one action
- A state machine: `idle -> loading -> success | error -> retry -> loading`

**Why it's not needed now:** The only complex state in the project is `account-sheet.tsx`, which is a form — React Hook Form is the better tool for that.

**What it looks like (for future reference):**

```tsx
type State = {
  step: 'info' | 'verify' | 'done';
  attempts: number;
  error: string | null;
};

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'RETRY' }
  | { type: 'SET_ERROR'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: state.step === 'info' ? 'verify' : 'done', error: null };
    case 'RETRY':
      return { ...state, step: 'info', attempts: state.attempts + 1 };
    case 'SET_ERROR':
      return { ...state, error: action.error };
  }
}

const [state, dispatch] = useReducer(reducer, { step: 'info', attempts: 0, error: null });
```

**Rule of thumb:** If you're reaching for 5+ `useState` calls that change together and it's NOT a form, use `useReducer`.

---

## 7. TanStack Query — Server State Cache (not needed yet)

**When to use:** Multiple components or pages need the same API data (e.g., user profile is shown in the sidebar, the account sheet, and a dashboard).

**Why it's not needed now:** Only `account-sheet.tsx` fetches profile data. No other component needs it.

**The problem it solves:**

Without TanStack Query, each component that needs server data manages its own fetch cycle:

```tsx
// Component A
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  profileService.get().then(res => { setData(res.data); setLoading(false); });
}, []);

// Component B — exact same code, separate API call for the same data
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  profileService.get().then(res => { setData(res.data); setLoading(false); });
}, []);
```

With TanStack Query, both components share one cache:

```tsx
// Component A and B — both use the same cached data
const { data, isLoading } = useQuery({
  queryKey: ['profile'],
  queryFn: () => profileService.get(),
  staleTime: 60_000,
});
```

**Key features:**

| Feature               | What it does                                                                 |
| --------------------- | ---------------------------------------------------------------------------- |
| Shared cache          | Fetch once, every `useQuery(['profile'])` consumer gets the same data        |
| Automatic refetch     | Refetches when the window regains focus or when data becomes stale           |
| Cache invalidation    | After a mutation, call `invalidateQueries(['profile'])` → all consumers update |
| Built-in states       | `isLoading`, `isError`, `error`, `isFetching` — no manual `useState` needed |
| Optimistic updates    | Show the new value immediately, roll back if the API call fails              |

**When to install:** When you find yourself copy-pasting the `useEffect` + `useState` fetch pattern into a second component for the same endpoint.

```bash
pnpm add @tanstack/react-query
```

---

## 8. Redux — Global Client State (not needed yet)

**When to use:** Complex client-only state that is shared across many unrelated components and pages.

**Why it's not needed now:** The project's shared state is covered by:
- `SidebarContext` for sidebar UI
- `next-auth` for session/auth
- `next-themes` for theme

**When you'd add Redux Toolkit:**

- A shopping cart that persists across page navigations
- A notification center with unread counts visible in the header, sidebar, and individual pages
- Complex filter/sort state shared across a data table and a chart on different routes
- You need middleware (logging, analytics, side effects)
- You want time-travel debugging with Redux DevTools

```tsx
// Redux Toolkit example (for future reference)
import { createSlice, configureStore } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem: (state, action) => { state.items.push(action.payload); },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clear: (state) => { state.items = []; },
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
```

---

## Decision Flowchart

```
Is it a form (inputs + validation + submit)?
  └─ YES → React Hook Form + Zod

Is the state shared across multiple components?
  └─ YES → Is it server data (API responses)?
             └─ YES → TanStack Query
             └─ NO  → Is it UI state within a subtree?
                        └─ YES → React Context
                        └─ NO  → Redux (global client state)

Is the state local to one component?
  └─ YES → Are there 5+ interdependent values (NOT a form)?
             └─ YES → useReducer
             └─ NO  → useState
```

---

## File-by-File Summary

| File                              | Current    | Recommended | Action       |
| --------------------------------- | ---------- | ----------- | ------------ |
| `components/account/account-sheet.tsx` | 17x `useState` | React Hook Form + Zod | Migrate |
| `components/sidebar/nav-user.tsx`      | 1x `useState`  | `useState`            | Keep    |
| `components/sidebar/team-switcher.tsx` | 1x `useState`  | `useState`            | Keep    |
| `components/ui/persian-calendar.tsx`   | 2x `useState`  | `useState`            | Keep    |
| `components/ui/sidebar.tsx`            | Context        | Context               | Keep    |
| `hooks/use-mobile.ts`                 | 1x `useState`  | `useState`            | Keep    |
| `hooks/use-current-user.ts`           | next-auth      | next-auth             | Keep    |
| `components/theme/mode-toggle.tsx`     | next-themes    | next-themes           | Keep    |
| `providers/auth-provider.tsx`          | next-auth      | next-auth             | Keep    |
