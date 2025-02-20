# Application Outline: Ceramics Canada Catalogue - Detailed File Breakdown (Part 2 - Concise)

## 2. Detailed Module and File Breakdown (Continued - Concise)

### 2.2. UI Modules - `src/components` (Continued - Concise)

#### 2.2.9. Shopping List Module - `src/components/ShoppingList.tsx` (Concise)

**File Description:** Shopping list table component.

**Key Responsibilities:** Display list, quantity adjust, remove item, price calculation, grand total.

**Component Hierarchy (Concise):**
```
ShoppingList
├── div (Scrollable)
│   └── table (List Table)
│       ├── thead (Header)
│       └── tbody (Items)
│           ├── tr (Item)
│           └── tr (Grand Total)
│       └── p (Tax Note)
```


#### 2.2.10. UI Primitives Module - `src/components/ui/card.tsx` (Concise)

**File Description:** Reusable Card component.

**Key Responsibilities:** Reusable card UI, composition (Header, Content, Footer), styling.

**Component Hierarchy (Concise):**
```
Card
├── CardHeader
├── CardContent
└── CardFooter
```


### 2.3. Main Application Module - `src/App.tsx` (Concise)

**File Description:** Main application component: orchestrates UI, manages state, data integration.

**Key Responsibilities:** Component orchestration, state management, data integration (`dataHandler`), user interaction handling, responsiveness, loading state.

**Component Hierarchy (Concise):**
```
App
├── Card (Catalogue)
├── Card (Shopping List)
├── Catalog (desktop)
└── MobCatalog (mobile)
```


### 2.4. Entry Point - `src/main.tsx` (Concise)

**File Description:** React entry point: renders App component.

**Responsibilities:** Render `App` to DOM.

**Internal Structure (Concise):**
```
main.tsx
└── ReactDOM.render(App)
```


### 2.5. Entry Point - `index.html` (Concise)

**File Description:** HTML entry point: basic HTML structure.

**Responsibilities:** HTML structure, root element, metadata, CSS link, JS bundle.

**Internal Structure (Concise):**
```html
index.html
├── head
└── body
    └── div#root
    └── script
```


### 2.6. Configuration and Styling Files (Concise)

#### 2.6.1. `vite.config.ts` (Concise)

**File Description:** Vite config: build tool config.

**Responsibilities:** Vite build config, plugins, dev server, build options.

**Internal Structure (Concise):**
```typescript
vite.config.ts
└── defineConfig (Vite config)
    └── plugins: [react()]
```

#### 2.6.2. `tailwind.config.js` (Concise)

**File Description:** Tailwind CSS config: styling framework config.

**Responsibilities:** Tailwind customization, theme, content, plugins.

**Internal Structure (Concise):**
```javascript
tailwind.config.js
└── module.exports = {
    ├── content: [...]
    ├── theme: { ... }
    └── plugins: []
}
```

#### 2.6.3. `postcss.config.js` (Concise)

**File Description:** PostCSS config: CSS transform config.

**Responsibilities:** PostCSS plugin config, Tailwind integration, Autoprefixer.

**Internal Structure (Concise):**
```javascript
postcss.config.js
└── module.exports = {
    └── plugins: {
        ├── tailwindcss: {}
        └── autoprefixer: {}
    }
}
```

#### 2.6.4. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` (Concise)

**File Description:** TypeScript configs: compiler options.

**Responsibilities:** TS compiler options, project/app/node configs.

**Internal Structure (Concise):**
```json
tsconfig.json
└── { compilerOptions, include, exclude, extends }
```

#### 2.6.5. `eslint.config.js` (Concise)

**File Description:** ESLint config: code linter config.

**Responsibilities:** ESLint rule config, code quality enforcement.

**Internal Structure (Concise):**
```javascript
eslint.config.js
└── module.exports = [
    { files, languageOptions, rules, extends, plugins }
]
```

#### 2.6.6. `src/index.css` (Concise)

**File Description:** Global CSS styles.

**Responsibilities:** Global styles, Tailwind directives, custom CSS.

**Internal Structure (Concise):**
```css
index.css
/* Tailwind Directives */
/* Custom CSS rules */
```

#### 2.6.7. `vite-env.d.ts` (Concise)

**File Description:** Vite env declarations: TS types for Vite env vars.

**Responsibilities:** Type declarations for Vite env vars.

**Internal Structure (Concise):**
```typescript
vite-env.d.ts
interface ImportMetaEnv { /* declarations */ }
interface ImportMeta { env: ImportMetaEnv }
```


### 2.7. Documentation Module - `old-md/` Directory (Concise)

**File Description:** Documentation module: markdown documentation files.

**Contents:** API demo, Catalog explanation, data handler plan, styling guide, WP plugin requirements.

**Internal Structure (Concise - for .md files):** Markdown syntax (headings, paragraphs, lists, code).


## 3. Custom Variables In/Out (Module Level)

*(Same as in previous outline - section 3 from previous response)*