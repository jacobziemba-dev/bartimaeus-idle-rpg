# Vite + TypeScript Migration Plan

## Overview
Migrate Bartimaeus Idle RPG from vanilla JavaScript to Vite + TypeScript while maintaining all existing functionality.

**Timeline:** 2-3 hours for basic migration
**Risk:** Low (can rollback easily)
**Bundle Size Impact:** +20-30% (158 KB → ~190 KB)

---

## Phase 1: Project Setup (30 minutes)

### Step 1.1: Initialize npm project
```bash
npm init -y
```

### Step 1.2: Install dependencies
```bash
# Core dependencies
npm install -D vite typescript

# Optional but recommended
npm install -D @types/node
npm install -D vite-plugin-html
```

### Step 1.3: Create configuration files

**tsconfig.json** (TypeScript configuration):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "isolatedModules": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**vite.config.ts** (Vite configuration):
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    minify: 'terser',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
```

### Step 1.4: Update package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 1.5: Update .gitignore
```
node_modules/
dist/
*.log
.DS_Store
```

---

## Phase 2: Project Restructuring (30 minutes)

### Current structure:
```
bartimaeus-idle-rpg/
├── index.html
├── src/
│   ├── scripts/ (10 JS files)
│   └── styles/ (2 CSS files)
└── assets/ (29 SVG files)
```

### New structure:
```
bartimaeus-idle-rpg/
├── index.html (updated for Vite)
├── src/
│   ├── main.ts (new entry point)
│   ├── scripts/ (10 files, .js → .ts)
│   ├── styles/
│   │   ├── main.css
│   │   └── battle.css
│   └── types/ (new)
│       └── index.ts (type definitions)
├── assets/ (unchanged)
├── vite.config.ts
├── tsconfig.json
├── package.json
└── dist/ (build output, gitignored)
```

### Step 2.1: Create main.ts entry point
**src/main.ts** (new file):
```typescript
// Import styles
import './styles/main.css';
import './styles/battle.css';

// Import game modules
import { AssetManager } from './scripts/assetManager';
import { Hero } from './scripts/hero';
import { Enemy } from './scripts/enemy';
import { SkillManager } from './scripts/skills';
import { AdventureLog } from './scripts/adventureLog';
import { ResourceManager } from './scripts/resources';
import { StorageManager } from './scripts/storage';
import { BattleManager } from './scripts/battle';
import { UIManager } from './scripts/ui';
import { Game } from './scripts/game';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  (window as any).game = game; // For console debugging
});
```

### Step 2.2: Update index.html
**Before (vanilla):**
```html
<script src="src/scripts/assetManager.js"></script>
<script src="src/scripts/hero.js"></script>
<!-- ... 8 more scripts ... -->
```

**After (Vite):**
```html
<script type="module" src="/src/main.ts"></script>
```

That's it! Vite handles everything else.

---

## Phase 3: TypeScript Conversion (60 minutes)

### Strategy: Incremental migration
1. Rename `.js` → `.ts` (all files at once)
2. Fix errors file-by-file (start with leaf modules)
3. Add types gradually (don't need to be perfect)

### Step 3.1: Create type definitions
**src/types/index.ts** (new file):
```typescript
// Core game types
export interface HeroStats {
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
}

export interface EnemyStats {
  health: number;
  attack: number;
  defense: number;
  goldReward: number;
  gemReward: number;
}

export type HeroRole = 'tank' | 'damage' | 'support';
export type EnemyType = 'goblin' | 'orc' | 'skeleton' | 'demon' | 'dragon';

export interface DamageNumber {
  x: number;
  y: number;
  value: number;
  opacity: number;
  isCrit: boolean;
}

export interface SaveState {
  heroes: any[];
  currentStage: number;
  resources: {
    gold: number;
    gems: number;
  };
  lastSaveTime: number;
}
```

### Step 3.2: Conversion order (easiest → hardest)

**File conversion order:**
1. ✅ `assetManager.ts` (no dependencies)
2. ✅ `adventureLog.ts` (no dependencies)
3. ✅ `resources.ts` (simple)
4. ✅ `hero.ts` (depends on types)
5. ✅ `enemy.ts` (depends on types)
6. ✅ `skills.ts` (depends on hero)
7. ✅ `storage.ts` (depends on hero, resources)
8. ✅ `battle.ts` (depends on hero, enemy, skills)
9. ✅ `ui.ts` (depends on everything)
10. ✅ `game.ts` (main controller, depends on all)

### Step 3.3: Example conversion (hero.js → hero.ts)

**Before (hero.js):**
```javascript
class Hero {
  constructor(name, role, baseHealth, baseAttack, baseDefense) {
    this.name = name;
    this.role = role;
    this.level = 1;
    this.baseHealth = baseHealth;
    this.baseAttack = baseAttack;
    this.baseDefense = baseDefense;
    this.currentHealth = this.effectiveHealth;
  }

  get effectiveHealth() {
    return Math.floor(this.baseHealth * (1 + (this.level - 1) * 0.15));
  }
}
```

**After (hero.ts):**
```typescript
import type { HeroRole, HeroStats } from '../types';

export class Hero {
  name: string;
  role: HeroRole;
  level: number;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  currentHealth: number;

  constructor(
    name: string,
    role: HeroRole,
    stats: HeroStats
  ) {
    this.name = name;
    this.role = role;
    this.level = 1;
    this.baseHealth = stats.baseHealth;
    this.baseAttack = stats.baseAttack;
    this.baseDefense = stats.baseDefense;
    this.currentHealth = this.effectiveHealth;
  }

  get effectiveHealth(): number {
    return Math.floor(this.baseHealth * (1 + (this.level - 1) * 0.15));
  }

  // Type-safe JSON serialization
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      role: this.role,
      level: this.level,
      baseHealth: this.baseHealth,
      baseAttack: this.baseAttack,
      baseDefense: this.baseDefense
    };
  }
}
```

### Step 3.4: Add exports to all modules

**In every file:**
```typescript
// assetManager.ts
export class AssetManager { /* ... */ }

// hero.ts
export class Hero { /* ... */ }
export function createStartingHeroes() { /* ... */ }

// enemy.ts
export class Enemy { /* ... */ }
export function createEnemyForStage(stage: number) { /* ... */ }
```

---

## Phase 4: Testing & Verification (30 minutes)

### Step 4.1: Development server
```bash
npm run dev
```
Open http://localhost:3000 and test:
- [ ] Game loads without errors
- [ ] Assets load correctly
- [ ] Combat works
- [ ] Skills trigger
- [ ] Save/load functions
- [ ] Upgrades work
- [ ] Canvas renders correctly

### Step 4.2: Production build
```bash
npm run build
```

Check `dist/` folder:
- [ ] index.html generated
- [ ] JavaScript bundled and minified
- [ ] CSS bundled and minified
- [ ] Assets copied to dist/assets/
- [ ] Total size <300 KB

### Step 4.3: Preview production build
```bash
npm run preview
```
Test again to ensure production build works.

---

## Phase 5: CI/CD Update (15 minutes)

### Update .github/workflows/deploy.yml

**Before:**
```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: '.'
```

**After:**
```yaml
- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'
```

**Full updated workflow:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Phase 6: Documentation Updates (15 minutes)

### Files to update:
1. **README.md** - Add build instructions
2. **CLAUDE.md** - Update stack info
3. **package.json** - Add description, author, license

### README.md additions:
```markdown
## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open http://localhost:3000

### Build for Production
\`\`\`bash
npm run build
\`\`\`
Output in `dist/` folder

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`
```

---

## Rollback Plan

If something goes wrong:

### Option 1: Git revert
```bash
git checkout main
git branch -D vite-migration
```

### Option 2: Keep both versions
```bash
# Tag the vanilla version
git tag vanilla-version
git push --tags

# Continue with Vite on main
```

### Option 3: Parallel development
```
main branch: Vite version
vanilla branch: Original version (keep for comparison)
```

---

## Benefits After Migration

### Developer Experience
✅ Instant hot module reload (changes appear without full refresh)
✅ Better error messages in console
✅ Type checking catches bugs before runtime
✅ Import/export instead of global variables
✅ Modern JavaScript features (async/await, optional chaining)
✅ Better VS Code autocomplete

### Code Quality
✅ No more load order issues
✅ Explicit dependencies via imports
✅ Type safety prevents common errors
✅ Easier refactoring
✅ Self-documenting code with types

### Performance
✅ Automatic code splitting
✅ Tree shaking (removes unused code)
✅ Minification in production
✅ Source maps for debugging

### Production
✅ Optimized bundle size
✅ Automatic asset optimization
✅ Cache-friendly file naming (hash in filenames)
✅ Modern browser features with polyfills for old browsers

---

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Add `.ts` extension to imports or configure path aliases

### Issue: "Property does not exist on type"
**Solution:** Add type annotations or use `any` temporarily

### Issue: "Assets not loading"
**Solution:** Check `publicDir` in vite.config.ts

### Issue: "Build fails in GitHub Actions"
**Solution:** Ensure Node.js setup step is present

### Issue: "Game works in dev but not production"
**Solution:** Test with `npm run preview` before deploying

---

## Next Steps After Migration

Once Vite + TypeScript is working:

1. **Gradual type improvement** - Add stricter types over time
2. **Add linting** - ESLint + Prettier integration
3. **Add testing** - Vitest (Vite's test framework)
4. **Environment variables** - Use `.env` files
5. **Code splitting** - Lazy load scenes/stages
6. **PWA support** - Offline play with service worker

---

## Estimated Timeline

| Phase | Time | Difficulty |
|-------|------|------------|
| Project Setup | 30 min | Easy |
| Restructuring | 30 min | Easy |
| TypeScript Conversion | 60 min | Medium |
| Testing | 30 min | Easy |
| CI/CD Update | 15 min | Easy |
| Documentation | 15 min | Easy |
| **Total** | **3 hours** | **Medium** |

---

## Checklist

### Before starting:
- [ ] Commit all current changes
- [ ] Create backup branch
- [ ] Read this plan fully

### During migration:
- [ ] Work on feature branch
- [ ] Test after each phase
- [ ] Commit frequently

### After migration:
- [ ] Full game test
- [ ] Production build test
- [ ] Create PR
- [ ] Merge to main
- [ ] Verify GitHub Pages deployment

---

## Questions to Answer Before Starting

1. **Should we migrate all at once or file-by-file?**
   - Recommendation: All at once (easier with small codebase)

2. **How strict should TypeScript be?**
   - Recommendation: Start lenient (`strict: false`), tighten later

3. **Keep vanilla version?**
   - Recommendation: Tag as `vanilla-version`, continue with Vite

4. **When to deploy?**
   - Recommendation: After thorough testing, merge to main

Ready to start? Let me know and I'll begin with Phase 1!
