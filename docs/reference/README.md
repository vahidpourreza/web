# Quick Reference Library

Technical reference sheets for common tasks and patterns.

---

## Purpose

Quick lookup references for:
- Common React patterns
- Tailwind CSS classes
- TypeScript tips for C# developers
- API integration patterns
- State management patterns

---

## Available References

### Coming Soon

These references will be added as you progress through the weeks:

- **react-patterns.md** - Common React patterns (Week 2)
- **tailwind-cheatsheet.md** - Most-used Tailwind classes (Week 4)
- **typescript-tips.md** - TypeScript for C# developers (Week 1-2)
- **api-patterns.md** - API integration patterns (Week 6-7)
- **state-management.md** - State management patterns (Week 8)
- **testing-patterns.md** - Testing best practices (Week 9)

---

## Quick Tips

### React Patterns

**Conditional Rendering:**
```tsx
{user && <div>Welcome {user.name}</div>}
{isLoading ? <Spinner /> : <Content />}
```

**List Rendering:**
```tsx
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

**Event Handling:**
```tsx
<button onClick={() => handleClick()}>Click</button>
```

### Tailwind Quick Reference

**Layout:**
- `flex` `grid` - Display modes
- `items-center` `justify-between` - Alignment
- `gap-4` - Spacing

**Spacing:**
- `p-4` `px-2` `py-2` - Padding
- `m-4` `mx-2` `my-2` - Margin

**Colors:**
- `bg-primary` `text-foreground` - Theme colors
- `bg-blue-500` `text-white` - Direct colors

### TypeScript for C#

**Interfaces:**
```tsx
// C#
public interface IUser {
    string Name { get; set; }
    int Age { get; set; }
}

// TypeScript
interface User {
  name: string
  age: number
}
```

**Optional Parameters:**
```tsx
// C#
public void DoSomething(string required, string? optional = null)

// TypeScript
function doSomething(required: string, optional?: string)
```

---

## Format Guidelines

Each reference should be:
- **Scannable** - Tables or bullet lists
- **Practical** - Code snippets ready to use
- **Contextual** - .NET comparisons where helpful
- **Brief** - Under 200 lines

---

## How to Use

1. **Quick lookup** - Find the pattern you need
2. **Copy & adapt** - Use code snippets as starting points
3. **Learn patterns** - Understand common approaches
4. **Build muscle memory** - Reference less over time

---

## Contributing to Your References

As you learn, add your own patterns and discoveries:

1. Create a new .md file in this folder
2. Use the format: `topic-name.md`
3. Include code examples
4. Add .NET comparisons if relevant

---

Last updated: 2026-02-10
