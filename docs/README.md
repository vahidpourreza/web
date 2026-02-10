# Learning Documentation

> Documentation for learning Next.js as a .NET developer

## Current Focus

**Week**: 1 - Foundation
**Start Date**: _[Add your start date]_
**Progress**: [Link to progress.md](progress.md)

---

## Quick Access

### Daily Use
- **[Learning Guide](learning-guide.md)** - Quick reference for coding
- **[Progress Tracker](progress.md)** - Week 1 tasks & notes

### Full Learning Plan
The comprehensive 10-week learning plan is at:
`C:\Users\Admin\.claude\plans\vectorized-orbiting-blanket.md`

---

## Project Structure Overview

Your Next.js project with RTL support:

```
d:\1.Services\web\
├── app/                   # Next.js App Router
│   ├── layout.tsx        # Root layout (RTL configured)
│   ├── page.tsx          # Home page
│   └── globals.css       # Theme & styles
│
├── components/           # UI Components
│   ├── ui/              # shadcn/ui (14 components)
│   └── *.tsx            # Custom components
│
├── lib/                 # Utilities
│   └── utils.ts         # Helper functions
│
├── docs/                # Learning documentation
│   ├── learning-guide.md  # Quick reference
│   ├── progress.md        # Progress tracking
│   ├── week-plans/        # Weekly deep dives
│   ├── reference/         # Cheat sheets
│   └── notes/             # Personal notes
│
└── Configuration files
```

---

## How to Use This Documentation

### Daily Workflow
1. Open [learning-guide.md](learning-guide.md) in your editor
2. Code with quick reference nearby
3. Update [progress.md](progress.md) at end of day
4. Add notes as you discover patterns

### Weekly Workflow
1. Review week summary in [progress.md](progress.md)
2. Read next week's plan in main plan file
3. Update current focus in this README
4. Reflect and plan next week

---

## Documentation Structure

This docs folder complements the comprehensive learning plan:

- **Main Plan**: Detailed curriculum with examples and deep explanations
- **Learning Guide**: Quick reference optimized for daily coding
- **Progress Tracker**: Task execution tracking with reflection
- **Week Plans**: Focused weekly goals (to be added as needed)
- **Reference**: Technical cheat sheets (to be added as needed)
- **Notes**: Personal insights and discoveries (to be added as needed)

---

## Week 1 Goals

**Understanding the Foundation**

1. **Day 1-2**: Setup & Exploration
   - Run dev server
   - Explore demo page
   - Read layout and page files

2. **Day 3-4**: Component Fundamentals
   - Study button component
   - Create first component
   - Understand TypeScript props

3. **Day 5-7**: Understanding Existing Code
   - Read component-example.tsx
   - Understand composition patterns
   - Learn `"use client"` directive
   - Experiment with RTL

---

## Essential Commands

```bash
# Development
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # Code linting

# Adding Components
pnpm dlx shadcn@latest add <component-name>
```

---

## .NET → Next.js Quick Reference

| .NET | Next.js |
|---|---|
| Controller | Page component |
| View | React component |
| Partial View | Reusable component |
| appsettings.json | .env.local |
| DI Container | React Context |
| Middleware | middleware.ts |

---

## Key Files to Understand

| File | Purpose | Week |
|---|---|---|
| [app/layout.tsx](../app/layout.tsx) | Root layout, RTL setup | Week 1 |
| [app/page.tsx](../app/page.tsx) | Home page | Week 1 |
| [components/ui/button.tsx](../components/ui/button.tsx) | Component pattern example | Week 1 |
| [components/component-example.tsx](../components/component-example.tsx) | Composition patterns | Week 1 |
| [app/globals.css](../app/globals.css) | Theme & styling | Week 4 |
| [lib/utils.ts](../lib/utils.ts) | Utility functions | Week 4 |

---

## Future Integration

This project will connect to your:
- **.NET Microservices** via API Gateway
- **Duende IdentityServer 7.4.3** for authentication

These integrations are planned for Week 6-7.

---

## Resources

### Official Documentation
- [Next.js](https://nextjs.org/docs) - Framework docs
- [React](https://react.dev) - React docs
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling

### Backend Integration (Future)
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Duende Docs](https://docs.duendesoftware.com) - IdentityServer

---

## Notes

### What Makes This Project Special
- **RTL Support**: Full Persian/Arabic support configured
- **Modern Stack**: Next.js 16, React 19, TypeScript 5
- **UI Components**: 14 pre-built shadcn/ui components
- **Theme System**: Dark mode ready with CSS variables
- **Type Safety**: Full TypeScript integration

### Your Background
- **.NET Backend Developer**: Familiar with C#, APIs, microservices
- **New to React/Next.js**: Completed courses, ready to build
- **Goal**: Create frontend for your microservices application

---

## Progress Summary

Track your weekly progress:

- [ ] Week 1: Foundation
- [ ] Week 2: React Fundamentals
- [ ] Week 3: Routing & Pages
- [ ] Week 4: Styling with Tailwind
- [ ] Week 5: Forms & Data Handling
- [ ] Week 6-7: API & Authentication
- [ ] Week 8: State Management
- [ ] Week 9-10: Testing & Production

---

Last updated: _[Update as you progress]_

**Next Step**: Start Week 1 by running `pnpm dev` and exploring the demo!
