# AGENTS.md

Coding agent instructions for this Chrome extension project.

## Project Overview

This is a Chrome extension (Manifest V3) built with React, TypeScript, and Vite. It allows users to save web articles to GitHub issues with AI-generated summaries.

## Build/Lint/Test Commands

This project uses **Bun** as the package manager:

```bash
bun run dev          # Start Vite dev server with hot reload
bun run build       # Type-check with tsc, then build with Vite
bun run build:dev   # Development build with watch mode
bun run preview     # Preview production build locally
bun run clean       # Remove dist directory
bunx tsc --noEmit    # Type-check without emitting files
bunx eslint src/     # Run ESLint on source files
bunx prettier --write src/  # Format files with Prettier
bun outdated         # Check outdated packages
bun update           # Update all packages
```

**Package Management:**
```bash
bun install                    # Install dependencies
bun add package-name           # Add dependency
bun add -d package-name        # Add dev dependency
```

**Note:** No test framework is configured. When adding tests, choose and configure one.

## Code Style Guidelines

### Prettier Formatting

```json
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "arrowParens": "avoid",
  "printWidth": 88
}
```

### TypeScript Configuration

- Target: ES2018
- Module: CommonJS
- Strict mode enabled
- `noImplicitAny: false` (implicit any is allowed)
- Comments removed on build (`removeComments: true`)

### ESLint Rules

- Extends: `eslint:recommended`, `plugin:react/recommended`, `plugin:@typescript-eslint/recommended`, `plugin:prettier/recommended`
- `react/react-in-jsx-scope: off` (React 17+ automatic JSX transform)

### Import Conventions

Use path aliases defined in `tsconfig.json`:

```typescript
import { getTabId } from '@popup/api';          // src/pages/popup/api.ts
import Button from '@popup/components/Button';  // src/pages/popup/components/Button.tsx
import { SettingsProvider } from '@/context';// src/context/index.ts
import { useSettingsContext } from '@/context/SettingsContext';
```

**Import order:**

1. Path alias imports (`@/`, `@popup/`, `@options/`)
2. External packages (react, react-dom, etc.)
3. Styles (CSS modules, CSS files)

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `Button.tsx`, `ButtonsGroup.tsx` |
| Hooks | camelCase with `use` prefix | `useSettingsContext` |
| Functions | camelCase | `getTabId`, `htmlSanitizer` |
| Classes | PascalCase | `Process`, `SummaryError` |
| Enums | PascalCase, values in lowercase | `ActionEnum.UPDATE` |
| Files | PascalCase for components | `Button.tsx`, `App.tsx` |
| CSS modules | camelCase with `.module.css` | `button.module.css` |

### Export Patterns

```typescript
export default Component;           // Default export for components
export { settings, clear };         // Named exports for utilities
export type { State, Action };      // Named type exports
export enum ActionEnum { ... }      // Named enum exports
```

### React Patterns

- Use functional components with hooks
- Context + useReducer for global state
- Use TypeScript interfaces for props when components grow:

```typescript
type ButtonProps = {
  content: string;
  tags: string[];
};

const Button = ({ content, tags }: ButtonProps): JSX.Element => {
```

### Error Handling

- Create custom error classes for domain errors:

```typescript
export class SummaryError extends Error {}
export class SaveError extends Error {}
```

- Use try/catch with async/await
- Log errors with `console.error()` beforere-throwing or user feedback
- Use `alert()` sparingly; prefer toast notifications for non-critical feedback

### Chrome Extension APIs

The project uses these Chrome APIs:

- `chrome.storage.local` - Persist extension settings
- `chrome.tabs.query` - Get active tab info
- `chrome.scripting.executeScript` - Inject content scripts
- `chrome.runtime.onMessage` / `chrome.runtime.sendMessage` - Message passing

Global `chrome` is available (defined in `@types/chrome`).

### Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (configured in `vite.config.ts`)
- CSS-based configuration in `src/styles/tailwind.css` using `@import "tailwindcss"`
- **IMPORTANT**: Use standard Tailwind utility classes directly, NOT inline styles with CSS variables
- Custom CSS variables in `@theme` block for design system colors
- **Use arbitrary values** for custom colors: `bg-[#0D9488]`, `text-[#134E4A]`, etc.
- Standard Tailwind classes work: `bg-white`, `rounded-xl`, `shadow-lg`, `hover:bg-gray-100`
- Import Tailwind base styles: `import '@/styles/tailwind.css';`

### Design System (ui-ux-pro-max)

Based on generated design system for "Save N Summary":

**Color Palette:**
- Primary: `#0D9488` (Teal) / `#14B8A6` (Light Teal)
- CTA: `#F97316` (Orange) - for primary action buttons
- Background: `#F0FDFA` (Very light teal)
- Surface: `#FFFFFF` with glassmorphism
- Text: `#134E4A` (Dark teal) / `#5E7C79` (Muted)

**Typography:**
- Font: Plus Jakarta Sans (via Google Fonts)
- Friendly, modern, SaaS aesthetic
- Tight tracking for headings

**Effects & Animation:**
- **Micro-interactions**: 50-100ms hover transitions
- **Tactile feedback**: Buttons lift on hover (`translateY(-1px)`), press on click (`scale(0.98)`)
- **Glassmorphism**: `backdrop-filter: blur(16px)`, translucent white backgrounds
- **Bento Grid Cards**: Rounded corners (12-16px), subtle borders, hover lift effects
- **Shadows**: Teal-tinted shadows `rgba(13, 148, 136, 0.1)`

**Anti-patterns to Avoid:**
- No indigo/purple gradients (AI cliché)
- No emojis as icons
- No layout shift on hover
- Complex onboarding flows

**Implementation:**
- CSS variables defined in `src/styles/tailwind.css`
- Utility classes: `.btn-tactile`, `.btn-cta`, `.glass-card`, `.bento-card`
- Animations: `.spinner`, `.animate-success`, `.fade-slide-up`

### ESLint Configuration

- ESLint v10+ uses flat config (`eslint.config.mjs`)
- Extends: `eslint:recommended`, TypeScript ESLint, React plugin
- Globals: `chrome` is defined as readonly for Chrome extension APIs

## Project Structure

```
src/
├── context/                 # React context + reducer for settings
│   index.ts                 # Re-exports
│   SettingsContext.ts      # Context definition, types
│   SettingsProvider.tsx    # Provider component
│   reducer.ts              # State reducer
├── pages/
│   ├── background/         # Service worker (background script)
│   ├── content/             # Content script (injected into pages)
│   ├── options/             # Extension options page
│   │   api.ts               # Settings storage API
│   │   App.tsx              # Main options component
│   │   index.tsx            # Entry point
│   │   components/          # Options-specific components
│   └── popup/               # Extension popup
│       api.ts               # Business logic (Process class)
│       App.tsx              # Main popup component
│       index.tsx            # Entry point
│       components/          # Popup-specific components
│       styles/               # CSS modules
├── styles/
│   tailwind.css            # Tailwind directives
└── vite-env.d.ts           # Vite type declarations
```

## Key Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build config, path aliases, multi-entry setup |
| `public/manifest.json` | Chrome extension manifest (V3) |
| `eslint.config.mjs` | ESLint v10+ flat config |
| `src/styles/tailwind.css` | Tailwind CSS v4 base styles |

## Notes

- All source files use `.tsx` or `.ts` (TypeScript). Prefer TypeScript for all new code.
- `// @ts-ignore` comments are used sparingly for Chrome API typing gaps; avoid adding more.
- React.StrictMode is enabled in both popup and options entry points.
- No test framework installed. Add one before writing tests.
- React 19: Use `React.JSX.Element` instead of `JSX.Element` for return types.
- Tailwind CSS v4: Uses CSS-based configuration, no JavaScript config file needed.