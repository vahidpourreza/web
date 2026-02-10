# Learning Progress Tracker

**Started**: _[Add date when you begin]_
**Current Week**: Week 1 - Foundation
**Full Plan**: [C:\Users\Admin\.claude\plans\vectorized-orbiting-blanket.md](C:\Users\Admin\.claude\plans\vectorized-orbiting-blanket.md)

---

## Week 1: Understanding the Foundation

**Goal**: Understand project structure and create your first component

### Day 1-2: Setup & Exploration

#### Tasks
- [ ] Run `pnpm dev` and open http://localhost:3000
  - **File**: Terminal command
  - **Time spent**: _____
  - **Notes**:
    ```


    ```

- [ ] Explore the demo page and interact with all UI components
  - **What worked well**:
    ```


    ```
  - **Questions**:
    ```


    ```

- [ ] Open `app/page.tsx` and understand what it renders
  - **File**: [d:\1.Services\web\app\page.tsx](d:\1.Services\web\app\page.tsx)
  - **Key learnings**:
    ```


    ```

- [ ] Read `app/layout.tsx` to see RTL setup
  - **File**: [d:\1.Services\web\app\layout.tsx](d:\1.Services\web\app\layout.tsx)
  - **Understanding of RTL**:
    ```


    ```

#### Daily Reflection (Day 1-2)
**What I learned**:
```


```

**Challenges faced**:
```


```

**Questions for later**:
```


```

---

### Day 3-4: Component Fundamentals

#### Tasks
- [ ] Study `components/ui/button.tsx` to understand:
  - **File**: [d:\1.Services\web\components\ui\button.tsx](d:\1.Services\web\components\ui\button.tsx)
  - [ ] How `buttonVariants` defines different styles
  - [ ] What `cva` (class-variance-authority) does
  - [ ] TypeScript props typing

  **Notes**:
  ```
  buttonVariants:


  cva usage:


  Props typing:


  ```

- [ ] Create your first component: `components/hello.tsx`
  - **File**: `d:\1.Services\web\components\hello.tsx`
  - **Component code**:
    ```tsx
    export function Hello({ name }: { name: string }) {
      return <div>سلام {name}!</div>
    }
    ```
  - **Status**: ⬜ Not started | ⬜ In progress | ⬜ Complete
  - **Notes**:
    ```


    ```

- [ ] Import and use it in `app/page.tsx`
  - **File**: [d:\1.Services\web\app\page.tsx](d:\1.Services\web\app\page.tsx)
  - **Import line used**:
    ```tsx

    ```
  - **Where added**:
    ```


    ```
  - **Result**: ⬜ Works | ⬜ Has issues
  - **Notes**:
    ```


    ```

#### Daily Reflection (Day 3-4)
**What I learned**:
```


```

**Challenges faced**:
```


```

**Aha moments**:
```


```

---

### Day 5-7: Understanding Existing Code

#### Tasks
- [ ] Read through `components/component-example.tsx`
  - **File**: [d:\1.Services\web\components\component-example.tsx](d:\1.Services\web\components\component-example.tsx)
  - **Line count**:
  - **Key components found**:
    ```


    ```

- [ ] Identify how components are composed (Card → CardHeader → CardTitle)
  - **Component hierarchy**:
    ```
    Card
      ├── CardHeader
      │     ├── CardTitle
      │     └── CardDescription
      ├── CardContent
      └── CardFooter
    ```
  - **Pattern observations**:
    ```


    ```

- [ ] Understand the `"use client"` directive and when it's needed
  - **Why component-example uses it**:
    ```


    ```
  - **Rules for when to use**:
    ```


    ```

- [ ] Experiment with modifying Persian text and see changes
  - **Text modified**:
    ```


    ```
  - **Result**:
    ```


    ```
  - **RTL behavior**:
    ```


    ```

#### Daily Reflection (Day 5-7)
**What I learned**:
```


```

**Most complex concept**:
```


```

**Ready for Week 2?**: ⬜ Yes | ⬜ Need more practice | ⬜ Have questions

**Questions before moving on**:
```


```

---

## Week 1 Summary

**Completion Date**: _______

**Overall Learning**:
```




```

**Confidence Level** (1-5):
- Project structure understanding: __ / 5
- Component creation: __ / 5
- Reading existing code: __ / 5
- RTL and styling: __ / 5

**Biggest Challenge**:
```


```

**Biggest Win**:
```


```

**Ready for Week 2**: ⬜ Yes | ⬜ Need review

---

## Notes & Discoveries

Use this section for any additional notes, code snippets, or discoveries:

```






```

---

## Resources Used

- [ ] Next.js Documentation - [https://nextjs.org/docs](https://nextjs.org/docs)
- [ ] React Documentation - [https://react.dev](https://react.dev)
- [ ] shadcn/ui Components - [https://ui.shadcn.com](https://ui.shadcn.com)
- [ ] Tailwind CSS Docs - [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- [ ] Other: _______________

---

**Next**: Week 2 - React Fundamentals (see full plan)
