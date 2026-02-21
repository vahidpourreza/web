# Redux (Redux Toolkit) — Beginner Guide

Redux is a **global state management** library. It provides a single store that holds all your app-wide state, with a predictable pattern for updating it.

**Redux Toolkit (RTK)** is the modern, official way to use Redux. It removes the old boilerplate and makes Redux much simpler.

---

## When Do You Need It?

Most apps **don't need Redux**. You only need it when:

- Multiple unrelated components across different pages need the **same client state**
- The state is **client-only** (not server data — use React Query for that)
- The state is **complex** with many interdependent updates

**Examples:**
- Shopping cart (header badge + cart page + checkout page all need the items)
- Notification center (header count + dropdown + settings page)
- Complex filters shared between a table and a chart on different routes

**You DON'T need Redux for:**
- Form state → React Hook Form
- Server data (API responses) → React Query
- Theme / auth → dedicated libraries (next-themes, next-auth)
- State used by one component → `useState`
- State shared in a subtree → React Context

---

## Installation

```bash
pnpm add @reduxjs/toolkit react-redux
```

---

## Core Concepts

Redux has 3 main ideas:

### 1. Store — The single container for all state

```
┌──────────────────────────────────┐
│            Redux Store            │
│                                  │
│  cart: { items: [...] }          │
│  notifications: { unread: 5 }    │
│  filters: { search: 'shoes' }   │
└──────────────────────────────────┘
        ↑                  ↓
    dispatch(action)    useSelector(state => ...)
        ↑                  ↓
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Component │  │ Component │  │ Component │
│     A     │  │     B     │  │     C     │
└──────────┘  └──────────┘  └──────────┘
```

### 2. Slice — A piece of state + its update logic

A slice defines:
- **Initial state** — the starting values
- **Reducers** — functions that describe how the state changes

```tsx
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [] as CartItem[],
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((i) => i.id === action.payload);
      if (index !== -1) {
        state.total -= state.items[index].price;
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

// Export the action creators (used by components to dispatch changes)
export const { addItem, removeItem, clearCart } = cartSlice.actions;

// Export the reducer (used by the store)
export default cartSlice.reducer;
```

**Important:** Inside reducers, you can **mutate the state directly** (`state.items.push(...)`) because Redux Toolkit uses Immer internally. It converts your mutations into safe immutable updates.

### 3. Actions — Instructions to change state

Actions are plain objects that describe **what happened**:

```tsx
// Redux Toolkit generates these from your reducers:
addItem({ id: '1', name: 'Shoes', price: 99 })
// Creates: { type: 'cart/addItem', payload: { id: '1', name: 'Shoes', price: 99 } }

removeItem('1')
// Creates: { type: 'cart/removeItem', payload: '1' }

clearCart()
// Creates: { type: 'cart/clearCart' }
```

---

## Setting Up the Store

### Step 1: Create the store

```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart-slice';
import notificationsReducer from './notifications-slice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    notifications: notificationsReducer,
  },
});

// TypeScript types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 2: Create typed hooks

```tsx
// store/hooks.ts
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use these instead of plain useSelector/useDispatch for type safety
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
```

### Step 3: Wrap your app with the Provider

```tsx
// app/providers.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

```tsx
// app/layout.tsx
<ReduxProvider>
  {children}
</ReduxProvider>
```

---

## Using Redux in Components

### Reading state with `useAppSelector`

```tsx
import { useAppSelector } from '@/store/hooks';

function CartBadge() {
  // Select just the data this component needs
  const itemCount = useAppSelector((state) => state.cart.items.length);
  const total = useAppSelector((state) => state.cart.total);

  return (
    <span>
      Cart ({itemCount}) — ${total}
    </span>
  );
}
```

**The component only re-renders when `items.length` or `total` changes** — not when other store data changes.

### Changing state with `useAppDispatch`

```tsx
import { useAppDispatch } from '@/store/hooks';
import { addItem, removeItem, clearCart } from '@/store/cart-slice';

function ProductCard({ product }) {
  const dispatch = useAppDispatch();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => dispatch(addItem(product))}>
        Add to Cart
      </button>
    </div>
  );
}

function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </div>
      ))}
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
}
```

---

## The Data Flow

```
1. User clicks "Add to Cart"
2. Component calls: dispatch(addItem({ id: '1', name: 'Shoes', price: 99 }))
3. Redux receives the action: { type: 'cart/addItem', payload: { ... } }
4. The cart reducer runs: state.items.push(payload)
5. Store updates
6. Every component using useSelector for cart data re-renders with new data
```

This is called **one-way data flow**:

```
Action → Reducer → Store → Components → (user action) → Action → ...
```

---

## Async Operations (Thunks)

For API calls or other async logic, use `createAsyncThunk`:

```tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the async operation
export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await fetch('/api/users');
  return response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [] as User[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch';
      });
  },
});
```

```tsx
// In a component
const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);
```

**Note:** For most server data fetching, **React Query is a better choice** than Redux thunks. Redux thunks don't give you caching, deduplication, or automatic refetching. Use thunks only when the fetched data needs to live in the Redux store alongside other client state.

---

## DevTools — Time-Travel Debugging

Install the **Redux DevTools** browser extension. It gives you:

- **State inspector** — see the entire store at any point
- **Action log** — see every action that was dispatched
- **Time travel** — click any past action to see the state at that moment
- **Diff view** — see exactly what changed with each action

This works automatically with `configureStore` — no extra setup needed.

---

## When to Use Redux vs Alternatives

| Need | Best Tool | Why |
|------|-----------|-----|
| Form state | React Hook Form | Purpose-built for forms |
| Server data | React Query | Caching, refetching, deduplication |
| Theme / auth | Dedicated library | next-themes, next-auth |
| One component's state | `useState` | Simplest option |
| Subtree shared state | React Context | Lighter than Redux |
| Complex non-form local state | `useReducer` | No global store needed |
| Complex global client state | **Redux** | Predictable, DevTools, middleware |

---

## Cheat Sheet

| Task | Code |
|------|------|
| Create a slice | `createSlice({ name, initialState, reducers })` |
| Create the store | `configureStore({ reducer: { sliceName: sliceReducer } })` |
| Read state | `useAppSelector((state) => state.sliceName.value)` |
| Change state | `dispatch(actionCreator(payload))` |
| Async operation | `createAsyncThunk('name', async () => { ... })` |
| Type the store | `type RootState = ReturnType<typeof store.getState>` |
| Type dispatch | `type AppDispatch = typeof store.dispatch` |
| Typed hooks | `useSelector.withTypes<RootState>()` |
