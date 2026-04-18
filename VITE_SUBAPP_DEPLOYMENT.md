# Vite Sub-App Deployment Standard

> This document exists because a 3-day debugging session could have been 30 minutes.
> Follow this checklist every time a new Vite React sub-app is added to this repo.

---

## The Setup

This repo uses a **static deployment on Vercel** (no build command — Vercel just serves files from the repo). The main site is plain HTML/CSS. Sub-apps (like `soundhub-app/`) are React/Vite projects that live inside the repo and cross-import components from the root `src/` directory.

---

## What Went Wrong (The 3-Day Problem)

Three separate bugs stacked on top of each other, each producing a completely blank/black screen with no useful error message:

| # | Bug | Symptom | Time Wasted |
|---|-----|---------|-------------|
| 1 | Built assets not committed to git | Vercel served source HTML with `src/main.tsx` | ~1 day |
| 2 | Missing Tailwind config in sub-app | CSS was 0.38 kB of raw unprocessed directives | ~1 day |
| 3 | Duplicate React instance | Silent hook crash, blank "Error" with no message | ~1 day |

---

## The Fix: Sub-App Setup Checklist

Every time you create a new Vite React sub-app inside this repo, do **all** of the following before writing a single line of component code.

### Step 1 — Vite Config with Aliases

Every sub-app that imports from `../../src/` **must** alias shared libraries to one single copy. Without this, framer-motion (or any library that uses React hooks) will load twice — one React for the sub-app, one React from the root — and the app will crash silently.

```ts
// yourapp/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/yourapp/',               // must match the URL path
  resolve: {
    alias: {
      // Force ONE copy of every library that uses React hooks.
      // If you skip this and cross-import from ../../src, you get
      // a duplicate React instance → silent crash → blank screen.
      'react':            resolve(__dirname, 'node_modules/react'),
      'react-dom':        resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': resolve(__dirname, 'node_modules/react-router-dom'),
      'framer-motion':    resolve(__dirname, 'node_modules/framer-motion'),
    },
  },
  build: {
    outDir: '.',           // output built files into the sub-app folder itself
    emptyOutDir: false,    // don't wipe the whole folder
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html') },
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/main.[ext]',
      },
    },
  },
});
```

---

### Step 2 — Tailwind Config (don't skip this)

A sub-app needs its **own** Tailwind and PostCSS config. If these are missing, Vite outputs the raw `@tailwind` directives into the CSS file — browsers ignore them — zero styles applied — black screen.

```js
// yourapp/tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../src/**/*.{js,ts,jsx,tsx}",   // ← covers components from root src/
  ],
  theme: {
    extend: {
      // Copy the theme from the root project's tailwind config.
      // For this repo the tokens are:
      colors: {
        obsidian:         '#050505',
        panel:            '#0E1116',
        'panel-alt':      '#12161C',
        bone:             '#F3F3F0',
        ash:              '#8D939C',
        'accent-signal':  '#E0B100',
        'border-hairline':'rgba(255,255,255,0.08)',
        danger:           '#C8372D',
      },
      fontFamily: {
        sans:    ['"Inter Tight"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'mono-spaced': '0.08em',
        'brand':       '0.15em',
      },
    },
  },
  plugins: [],
};
```

```js
// yourapp/postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**How to verify it's working:** After `npm run build`, the output CSS should be **30 kB+**. If it's under 1 kB, Tailwind is not running.

---

### Step 3 — Two HTML Files, Not One

Vercel serves static files before checking any rewrite rules. If the source `index.html` (with `<script src="src/main.tsx">`) is in the repo, Vercel will serve it directly — browsers can't run TypeScript — blank screen.

The solution: keep the Vite template as `index.src.html`, and have the build script copy it over `index.html` before Vite runs. Vite then overwrites `index.html` with the compiled output.

```html
<!-- yourapp/index.src.html — the SOURCE template, never served by Vercel -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your App</title>
  </head>
  <body style="margin:0;">
    <div id="root"></div>
    <script type="module" src="src/main.tsx"></script>
  </body>
</html>
```

```json
// yourapp/package.json
{
  "scripts": {
    "build": "cp index.src.html index.html && tsc && vite build"
  }
}
```

After the build, `index.html` contains the compiled output with correct asset paths — this is what Vercel serves.

---

### Step 4 — Commit the Built Assets

This repo does **not** use a Vercel build command. Vercel just serves whatever files are in the repo. That means the built `assets/main.js` and `assets/main.css` **must be committed to git**.

```bash
# After every build, always use -A to catch all changed files
git add -A yourapp/
git commit -m "build: yourapp assets"
git push origin main
```

Never add `yourapp/assets/` to `.gitignore`.

---

### Step 5 — Error Boundary at Root

A React crash with no error boundary = completely blank screen. Always wrap the root with an `ErrorBoundary` so crashes show a readable message instead of nothing — especially critical for debugging deployments where you can't open DevTools.

```tsx
// yourapp/src/App.tsx
import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#050505', color: '#E0B100', fontFamily: 'monospace', padding: '40px', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '16px' }}>APP — RENDER ERROR</h1>
          <pre style={{ color: '#F3F3F0', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### Step 6 — BrowserRouter Basename

The sub-app lives at `/yourapp/` not at `/`. The router must know this or all `<Link>` and `useLocation` calls will be wrong.

```tsx
<BrowserRouter basename="/yourapp">
  <Routes>
    <Route path="/" element={<YourPage />} />
  </Routes>
</BrowserRouter>
```

---

## Complete Sub-App File Structure

```
yourapp/
├── index.src.html          ← Vite template (source, not served)
├── index.html              ← Built output (committed, served by Vercel)
├── tailwind.config.js      ← Required — sub-app needs its own
├── postcss.config.js       ← Required — sub-app needs its own
├── vite.config.ts          ← Must have base + resolve.alias
├── package.json            ← build script: "cp index.src.html index.html && tsc && vite build"
├── tsconfig.json
├── assets/
│   ├── main.js             ← Built, committed to git
│   └── main.css            ← Built, committed to git
└── src/
    ├── main.tsx
    └── App.tsx             ← Has ErrorBoundary + BrowserRouter with basename
```

---

## Quick Diagnosis Guide

If a sub-app shows a blank/black screen:

| Check | Command | Expected |
|-------|---------|----------|
| CSS size | `wc -c yourapp/assets/main.css` | Should be **30 kB+**. Under 1 kB = Tailwind not running |
| Tailwind config exists | `ls yourapp/tailwind.config.js` | Should exist |
| PostCSS config exists | `ls yourapp/postcss.config.js` | Should exist |
| Built HTML is committed | `head -5 yourapp/index.html` | Should contain `<script ... src="/yourapp/assets/main.js">` not `src/main.tsx` |
| Assets committed | `git status yourapp/assets/` | Should be clean |
| Duplicate React | Check sourcemap sources | All React imports should resolve from `yourapp/node_modules` not `../../node_modules` |

---

## Deployment Workflow (Every Time You Make Changes)

```bash
# 1. Build
cd yourapp && npm run build

# 2. Stage everything (use -A, not specific files — catches new chunks)
cd .. && git add -A yourapp/

# 3. Commit and push
git commit -m "feat/fix: description of change"
git push origin main

# 4. Wait ~90 seconds for Vercel to deploy, then verify
```
