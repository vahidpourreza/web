# useReducer — Beginner Guide

`useReducer` is a React hook for managing **complex local state** in a single component. Think of it as a more structured version of `useState` when you have many related state values that change together.

---

## When Do You Need It?

**Use `useState`** when:
- You have 1-3 simple, independent values
- Each value changes on its own

**Use `useReducer`** when:
- You have 5+ related state values
- Multiple values change together in response to one event
- The next state depends on the current state in complex ways
- The state logic is NOT a form (use React Hook Form for forms)

---

## The Problem It Solves

Imagine a multi-step wizard with complex state:

```tsx
// With useState — messy and scattered
const [step, setStep] = useState(1);
const [data, setData] = useState({});
const [error, setError] = useState(null);
const [attempts, setAttempts] = useState(0);
const [canGoBack, setCanGoBack] = useState(false);
const [isComplete, setIsComplete] = useState(false);

function goToNextStep() {
  setStep(step + 1);
  setError(null);
  setCanGoBack(true);
  if (step + 1 === 4) setIsComplete(true);
}

function retry() {
  setStep(1);
  setAttempts(attempts + 1);
  setError(null);
  setCanGoBack(false);
  setIsComplete(false);
}
```

**The problem:** Each event (`goToNextStep`, `retry`) updates 3-5 states at once. It's easy to forget one, and the logic is scattered across multiple functions.

```tsx
// With useReducer — all transitions in one place
function reducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        step: state.step + 1,
        error: null,
        canGoBack: true,
        isComplete: state.step + 1 === 4,
      };
    case 'RETRY':
      return {
        ...state,
        step: 1,
        attempts: state.attempts + 1,
        error: null,
        canGoBack: false,
        isComplete: false,
      };
  }
}

const [state, dispatch] = useReducer(reducer, initialState);

// In the component:
dispatch({ type: 'NEXT_STEP' });
dispatch({ type: 'RETRY' });
```

**Every possible state transition is defined in one function.** No way to forget updating a value.

---

## How It Works

### The 3 pieces

```
1. STATE    — the current values (like a snapshot)
2. ACTION   — a description of what happened (like an event)
3. REDUCER  — a function that takes (state + action) and returns the new state
```

```
   dispatch(action)
         ↓
┌─────────────────┐
│     REDUCER      │
│                  │
│  (state, action) │ → new state
│                  │
└─────────────────┘
         ↓
   Component re-renders with new state
```

### Step by step

```tsx
import { useReducer } from 'react';

// Step 1: Define the state type
type State = {
  count: number;
  lastAction: string;
};

// Step 2: Define the action types
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET'; payload: number };

// Step 3: Write the reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1, lastAction: 'increment' };
    case 'DECREMENT':
      return { count: state.count - 1, lastAction: 'decrement' };
    case 'RESET':
      return { count: 0, lastAction: 'reset' };
    case 'SET':
      return { count: action.payload, lastAction: `set to ${action.payload}` };
  }
}

// Step 4: Use in the component
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, lastAction: 'none' });

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Last action: {state.lastAction}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>Set to 100</button>
    </div>
  );
}
```

---

## Real-World Example — Data Fetching

A common pattern where `useReducer` shines:

```tsx
type State = {
  data: User[] | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.payload };
  }
}

function UserList() {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });

    fetch('/api/users')
      .then((res) => res.json())
      .then((users) => dispatch({ type: 'FETCH_SUCCESS', payload: users }))
      .catch((err) => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, []);

  if (state.loading) return <p>Loading...</p>;
  if (state.error) return <p>Error: {state.error}</p>;
  if (!state.data) return null;

  return (
    <ul>
      {state.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Why this is better than `useState`:**

With `useState`, you could accidentally set `loading: true` but forget to clear `error`, leaving the component in an impossible state (loading AND showing an error). With `useReducer`, each action defines the **complete** next state — impossible states become impossible.

---

## Real-World Example — Multi-Step Wizard

```tsx
type Step = 'info' | 'verify' | 'payment' | 'done';

type State = {
  step: Step;
  attempts: number;
  formData: { name: string; email: string };
  error: string | null;
};

type Action =
  | { type: 'SUBMIT_INFO'; payload: { name: string; email: string } }
  | { type: 'VERIFY_SUCCESS' }
  | { type: 'VERIFY_FAIL'; payload: string }
  | { type: 'PAYMENT_SUCCESS' }
  | { type: 'RETRY' }
  | { type: 'GO_BACK' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SUBMIT_INFO':
      return { ...state, step: 'verify', formData: action.payload, error: null };

    case 'VERIFY_SUCCESS':
      return { ...state, step: 'payment', error: null };

    case 'VERIFY_FAIL':
      return { ...state, error: action.payload, attempts: state.attempts + 1 };

    case 'PAYMENT_SUCCESS':
      return { ...state, step: 'done', error: null };

    case 'RETRY':
      return { ...state, step: 'info', error: null };

    case 'GO_BACK':
      const prevStep: Record<Step, Step> = {
        info: 'info',
        verify: 'info',
        payment: 'verify',
        done: 'done',
      };
      return { ...state, step: prevStep[state.step], error: null };
  }
}

function SignupWizard() {
  const [state, dispatch] = useReducer(reducer, {
    step: 'info',
    attempts: 0,
    formData: { name: '', email: '' },
    error: null,
  });

  return (
    <div>
      {state.error && <p className="error">{state.error}</p>}
      <p>Attempts: {state.attempts}</p>

      {state.step === 'info' && (
        <InfoForm
          onSubmit={(data) => dispatch({ type: 'SUBMIT_INFO', payload: data })}
        />
      )}

      {state.step === 'verify' && (
        <VerifyStep
          email={state.formData.email}
          onSuccess={() => dispatch({ type: 'VERIFY_SUCCESS' })}
          onFail={(msg) => dispatch({ type: 'VERIFY_FAIL', payload: msg })}
        />
      )}

      {state.step === 'payment' && (
        <PaymentStep
          onSuccess={() => dispatch({ type: 'PAYMENT_SUCCESS' })}
        />
      )}

      {state.step === 'done' && <p>All done!</p>}

      {state.step !== 'info' && state.step !== 'done' && (
        <button onClick={() => dispatch({ type: 'GO_BACK' })}>Back</button>
      )}
    </div>
  );
}
```

---

## `useReducer` vs `useState` — Side by Side

### Simple counter (use `useState`)

```tsx
// useState — simple and clear
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>+1</button>

// useReducer — overkill for this
const [state, dispatch] = useReducer(reducer, { count: 0 });
<button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
```

### Complex form wizard (use `useReducer`)

```tsx
// useState — scattered, easy to create impossible states
function goNext() {
  setStep(step + 1);     // what if we forget one of these?
  setError(null);
  setCanGoBack(true);
}

// useReducer — all transitions in one place
case 'NEXT':
  return { ...state, step: state.step + 1, error: null, canGoBack: true };
```

---

## `useReducer` vs Redux

| | `useReducer` | Redux |
|---|---|---|
| **Scope** | One component (local) | Entire app (global) |
| **Install** | Built into React (free) | Needs `@reduxjs/toolkit` |
| **DevTools** | None (just console.log) | Full time-travel debugging |
| **Middleware** | None | Logging, analytics, async |
| **Best for** | Complex state in one component | Complex state shared across many components |

**Rule of thumb:** If the state is only used in one component or a small subtree, use `useReducer`. If it needs to be accessed from anywhere in the app, use Redux.

---

## Tips

### 1. Always return a new object

```tsx
// GOOD — new object
return { ...state, count: state.count + 1 };

// BAD — mutating the existing object (React won't re-render)
state.count += 1;
return state;
```

### 2. Use TypeScript union types for actions

```tsx
type Action =
  | { type: 'INCREMENT' }
  | { type: 'SET'; payload: number };

// TypeScript will warn you if:
// - You dispatch an unknown action type
// - You forget to handle an action in the switch
// - You access payload on an action that doesn't have one
```

### 3. Keep the reducer pure

The reducer should only compute the new state. No side effects:

```tsx
// BAD — side effects in reducer
case 'SAVE':
  await api.save(state.data);     // NO! Don't call APIs in reducers
  localStorage.setItem('data');    // NO! Don't access browser APIs
  return state;

// GOOD — side effects outside, dispatch after
async function handleSave() {
  dispatch({ type: 'SAVE_START' });
  const result = await api.save(state.data);
  dispatch({ type: 'SAVE_SUCCESS', payload: result });
}
```

---

## Cheat Sheet

| Task | Code |
|------|------|
| Create reducer | `function reducer(state: State, action: Action): State { switch... }` |
| Use in component | `const [state, dispatch] = useReducer(reducer, initialState)` |
| Dispatch action | `dispatch({ type: 'ACTION_NAME' })` |
| Dispatch with data | `dispatch({ type: 'SET', payload: value })` |
| Read state | `state.fieldName` |
| Initial state | `useReducer(reducer, { count: 0, error: null })` |
