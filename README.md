# Meal Calorie Count Generator

A production-ready Next.js frontend for the Meal Calorie Count Generator API. Users can register, log in, search any dish for detailed calorie and macronutrient data sourced from the USDA FoodData Central database, and view a persistent search history.

## Live App

> **Hosted URL:** _Add your Vercel deployment URL here after deploying_
>
> Example: `https://meal-calorie-frontend.vercel.app`

---

## Screenshots

### Login & Register
> _Add screenshots after deploying. Suggested tool: [Lightshot](https://app.prntscr.com/) or VS Code's browser preview._

| Login | Register |
|---|---|
| <img width="1899" height="932" alt="image" src="https://github.com/user-attachments/assets/282f2302-f9aa-4089-b6d5-cf151d35e5a5" /> | <img width="1899" height="930" alt="image" src="https://github.com/user-attachments/assets/53c73eb4-990b-4817-97dc-f4a6aca6a580" /> |

### Dashboard
| Light Mode | Dark Mode |
|---|---|
| <img width="1915" height="936" alt="image" src="https://github.com/user-attachments/assets/7d6eb5ac-24b4-44bd-9425-d8910622de1f" /> | <img width="1908" height="931" alt="image" src="https://github.com/user-attachments/assets/36b57425-d338-4afd-92f3-0f9a1de110b0" /> |

### Calorie Lookup — Results
><img width="1913" height="936" alt="image" src="https://github.com/user-attachments/assets/74b6f233-5b5b-479b-85af-a9b1307620a9" />


---

## Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (or pnpm / yarn)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/meal-calorie-frontend.git
cd meal-calorie-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root (copy from the example):

```bash
cp .env.example .env.local
```

`.env.local` contents:

```bash
NEXT_PUBLIC_API_BASE_URL=https://xpcc.devb.zeak.io
```

> All API calls are made to this base URL. Never commit `.env.local` — it is gitignored.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Root — redirects based on auth state
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── dashboard/        # Protected — meal history + quick actions
│   └── calories/         # Protected — calorie lookup + results
├── components/
│   ├── ui/               # Base UI components (Button, Input, Card, Alert…)
│   ├── AuthForm.tsx      # Shared login/register form
│   ├── MealForm.tsx      # Dish search form with rate-limit countdown
│   ├── ResultCard.tsx    # Nutritional breakdown display
│   ├── MealHistoryTable.tsx  # Past search history table
│   ├── Header.tsx        # Sticky nav with auth state + theme toggle
│   └── ThemeToggle.tsx   # Dark/light mode toggle
├── hooks/
│   └── useAuthGuard.ts   # Redirect hook for protected routes
├── lib/
│   ├── api.ts            # Centralised fetch client + ApiError class
│   ├── validations.ts    # Zod schemas for all forms
│   ├── utils.ts          # cn() class helper
│   └── dateUtils.ts      # Lightweight "time ago" formatter
├── stores/
│   ├── authStore.ts      # Zustand (persisted): token + user
│   └── mealStore.ts      # Zustand (persisted): last result + history
└── types/
    └── index.ts          # All shared TypeScript interfaces
```

---

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.1 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Primitives | Radix UI | latest |
| State Management | Zustand + persist | 5.x |
| Form Handling | react-hook-form | 7.x |
| Validation | Zod | 3.x |
| Theme | next-themes | latest |
| Icons | lucide-react | latest |

---

## Tech Decisions & Trade-offs

### Zustand over Context API
Zustand provides a minimal, subscription-based store without boilerplate. The `persist` middleware serialises the auth token to `localStorage` transparently — users stay logged in across refreshes. Context API would require a manual Provider tree and custom persistence logic.

**Trade-off:** Zustand is an external dependency. For a project this size, the API surface is small enough that Context could work, but Zustand's `persist` middleware alone saves significant boilerplate.

### Zod + react-hook-form over manual validation
Zod schemas serve as the single source of truth for both TypeScript types (`z.infer<>`) and runtime validation. react-hook-form handles uncontrolled inputs — fields re-render only when they need to, not on every keystroke.

**Trade-off:** The `@hookform/resolvers` bridge adds one more dependency, but the DX benefit (typed errors, no `useState` per field) is worth it.

### Handwritten UI components over shadcn CLI
The shadcn/ui CLI requires interactive terminal prompts. All components follow the exact shadcn conventions (Radix primitives + `cn()` + `forwardRef`) and are fully equivalent. This approach keeps the dependency surface explicit and avoids auto-generated files.

**Trade-off:** More initial code to write. No future `npx shadcn add` convenience — new primitives must be added manually.

### Token accessor pattern in `api.ts`
`api.ts` does not import `authStore.ts` directly. Instead, a `registerTokenAccessor(fn)` hook is called from `ApiTokenProvider` on the client. This prevents a circular module dependency between the API layer and the store.

**Trade-off:** Slightly indirect — developers need to know the pattern exists. Documented in `IMPLEMENTATION_NOTES.md`.

### No `date-fns` for relative timestamps
A 15-line `formatDistanceToNow()` function covers all needed cases (just now / Xm ago / Xh ago / Xd ago) without adding ~25 KB to the bundle.

**Trade-off:** Does not handle edge cases like "yesterday" or locale-aware formatting. Acceptable for a history table.

### `router.replace` for all auth redirects
Using `replace` instead of `push` means the login/register pages are not stored in browser history. After logout, the back button won't navigate back to a protected page.

### CSS custom properties for dark mode
All colours are defined as CSS variables on `:root` and `.dark`, then exposed to Tailwind via `@theme inline`. Toggling the `dark` class on `<html>` cascades all colours at once — no Tailwind `dark:` prefix needed on every element.

**Trade-off:** Requires understanding both the CSS variable layer and the Tailwind layer. Documented in `globals.css`.

---

## API Reference

**Base URL:** `https://xpcc.devb.zeak.io`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register — returns JWT + user |
| POST | `/api/auth/login` | No | Login — returns 7-day JWT + user |
| POST | `/api/get-calories` | Bearer token | Calorie + macro lookup via USDA |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL |
