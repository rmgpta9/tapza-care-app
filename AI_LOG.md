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
| 4 | "Create an index file in the components folder and export all components from there." | `src/components/index.ts`; screens import from `@/components`. |
| 5 | "The code is over-complicated, even the theme has lots of calculations." | Simplification pass, listed in the next table. |

---

## AI output I rejected or changed

| What the AI produced | Why I rejected it | What replaced it |
|---|---|---|
| A plan to build the whole app in one pass | No reviewable history; hard to understand | One feature per step, committed separately |
| Reading a file outside the project folder while fixing an install error | Outside the agreed scope | AI limited to the project folder |
| `baseUrl` in `tsconfig.json` | Deprecated in TypeScript 6 | Only `paths` is used |
| Long comment blocks on every function, "STEP N PLACEHOLDER" banners | Noisy; restated the code | Short comments only where the reason isn't obvious |
| Theme colour maths (brightness, contrast ratios, colour mixing) | Hard to explain; not required by the brief | Config colours used as sent, plus one `withOpacity()` helper |
| Dark palette calculated from the light one | Same reason | Dark colours come from the config, or a fixed default |
| Slot availability from a hash function and timezone arithmetic | Over-engineered for mock data | Plain list of clinic times; every 4th slot is booked |
| Mock server built with dependency injection | Extra indirection for no benefit | One plain function per endpoint |
| `useSyncExternalStore` to load saved data | Hard to explain | `loadSavedData()` and a `ready` flag in the root layout |
| Spring animation on every button press | Animation where the brief doesn't ask for it | `Pressable` with a pressed opacity |
| Validation with warning lists, contrast checks and a custom error class | More than the app uses | Validation returns `{ ok, config }` or `{ ok, error }` |
| A `lib/` folder for small helpers | Unclear name | `utils/` |

---

## Key decisions

| Decision | Reason |
|---|---|
| Expo + Expo Router | APK builds without Android Studio (EAS); file-based routes and deep links built in |
| Mock backend inside the app (not json-server or MSW) | The APK works on its own, so slow network, failures and the Diwali theme can be tested without a computer |
| TanStack Query for server data | Loading, error, retry and caching are handled the same way on every screen |
| Zustand for saved app state (no Redux) | Small stores, saved to the phone in one line |
| Hand-written config validation (no zod) | Short, no extra dependency, easy to walk through |
| Hard-coded colours only in `src/theme/colors.ts` | Everything else comes from the config, as the brief requires |

---

## Problems found during review

| Problem | Fix |
|---|---|
| Expo Router's custom tab bar API changed in SDK 58 (no `navigation` prop) | Rewritten to use `navigateToTab`, matching the library's own tab bar |
| React Native's `URL` doesn't fully support `searchParams` | Query string parsed with a small helper in the mock server |
| The icon font loader needs `expo-asset`, which was only installed inside Expo's own folder | Installed it with `npx expo install expo-asset` |

---

## Steps

| Step | Scope | Status |
|---|---|---|
| 1 | Project setup, config types, validation, theme | Committed |
| 2 | Mock backend, demo controls, saved config, tab bar from config, simplification | Committed |
| 3 | Config-driven home screen: six section types, header, animations, skeleton; feature folders | In progress |
