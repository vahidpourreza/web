# Personal Learning Notes

Your personal space for notes, discoveries, and insights during the learning journey.

---

## Purpose

Use this folder to capture:
- Daily learnings and aha moments
- Code snippets you find useful
- Questions to research later
- Patterns you discover
- Mistakes and how you fixed them

---

## Organization

### By Time Period

Create monthly folders as needed:
```
notes/
└── 2026-02/
    ├── week-01-notes.md
    ├── week-02-notes.md
    └── discoveries.md
```

### Special Files

- **discoveries.md** - Aha moments & useful findings
- **questions.md** - Questions to research
- **mistakes.md** - Errors encountered and solutions

---

## Note-Taking Tips

### During Learning
- Write as you learn, not after
- Capture confusion (it shows learning)
- Note what clicked
- Record useful resources

### Weekly Review
- Summarize key learnings
- Identify patterns
- Update discoveries.md
- Plan next week

---

## Template for Weekly Notes

```markdown
# Week X Notes

**Week of**: [Date range]
**Topic**: [Main focus]

## Daily Log

### Monday
- Worked on: ___
- Learned: ___
- Questions: ___

### Tuesday
...

## Key Learnings

1. ___
2. ___
3. ___

## Code Snippets

[Useful patterns discovered]

## Resources Found

- [Resource name](URL)

## Next Week Preview

[What I want to focus on]
```

---

## Example Discoveries

Here are examples of what to note:

### Good Discovery
```markdown
## useState with Objects

**Discovery**: When updating state objects, must spread existing values!

**Wrong:**
```tsx
setUser({ name: "New Name" })  // ❌ Overwrites entire object
```

**Right:**
```tsx
setUser({ ...user, name: "New Name" })  // ✅ Keeps other fields
```

**Why**: Like creating new object in C# with object initializer
```

### Good Question
```markdown
## Question: useEffect Dependencies

When should I include a variable in the dependency array?

**Answer** (after research):
- Include if variable is used inside useEffect
- Exclude if you want to run only once
- Like SQL dependency tracking in Entity Framework
```

---

## Your First Note

Create your first note file:

```markdown
# Getting Started - 2026-02-10

## Today's Goal
Start Week 1 and understand project structure

## First Impressions
- Next.js feels different from .NET MVC
- Components are like partial views
- RTL support is already configured!

## Questions
1. How does DirectionProvider work?
2. What's the difference between app and components folder?

## Next Steps
- Read through learning guide
- Complete Day 1-2 tasks
- Create first component
```

---

## Tips

1. **Be honest** - Note confusion, it's part of learning
2. **Be specific** - "useState confuses me" → "How does useState re-render?"
3. **Add context** - .NET comparisons help your brain connect
4. **Review regularly** - Re-read notes weekly
5. **Update discoveries** - When you figure something out, document it

---

## Privacy

These notes are for YOU:
- Write freely
- Ask "stupid" questions
- Document mistakes
- Experiment with ideas

No one will judge your learning process!

---

Last updated: 2026-02-10
