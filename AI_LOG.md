# AI log

**Tool:** Claude Code (desktop app)

**How I used it:** I built the app one feature at a time. For each step I
reviewed the generated code, asked for changes where it was unclear or more
complex than needed, and committed it myself once it type-checked, passed lint
and tests, and ran.

Prompts are lightly edited for spelling and grammar; the meaning is unchanged.

---

## Prompts that shaped the code

| # | Prompt (summary) | Result |
|---|---|---|
| 1 | Pasted the full assignment brief. | Plan for the app, broken into steps. |
| 2 | "It's going to be a React Native Expo app. Don't access my system outside this folder." | Expo SDK 58 + TypeScript project; AI restricted to the project folder. |
| 3 | "Don't build the whole thing in one go. First split the woke into parts and suggest me the plan, then we will move step by step." | Work split into small, reviewable steps, each committed separately. |

---

## AI output I rejected or changed

| What the AI produced | Why I rejected it | What replaced it |
|---|---|---|
| A plan to build the whole app in one pass | No reviewable history; hard to understand | One feature per step, committed separately |
| Reading a file outside the project folder while fixing an install error | Outside the agreed scope | AI limited to the project folder |
| `baseUrl` in `tsconfig.json` | Deprecated in TypeScript 6 | Only `paths` is used |

---

## Key decisions

| Decision | Reason |
|---|---|
| Expo + Expo Router | APK builds without Android Studio (EAS); file-based routes and deep links built in |
| Hand-written config validation (no zod) | Short, no extra dependency, easy to walk through |

---

## Steps

| Step | Scope | Status |
|---|---|---|
| 1 | Project setup, config types, validation, theme | Committed |
| 2 | Mock backend, demo controls, saved config, tab bar from config, simplification | In progress |
