# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Overview

**ASD Angular Supabase** is a production-grade Angular boilerplate with Supabase integration, Tailwind CSS 4, DaisyUI 5, and full ASD platform orchestration. Uses the global `asd` binary (no `.asd/` submodule).

## Tech Stack

- **Frontend:** Angular 21+ with SSR, standalone components, signals
- **Styling:** Tailwind CSS 4 + DaisyUI 5 (ASD brand system)
- **Database/Auth:** Supabase (PostgreSQL + Auth)
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Package Manager:** pnpm 10+
- **Task Runner:** Just (see Justfile)
- **Orchestration:** ASD CLI (global `asd` binary)

## Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Angular dev server (port 4200)
just dev              # Start full stack via asd.yaml (Supabase + Caddy + Angular)
just start            # Start infrastructure only
just stop             # Stop all services
```

### Testing

```bash
pnpm test             # Unit tests (watch mode)
pnpm test:run         # Unit tests (CI mode)
pnpm test:coverage    # Unit tests with coverage

just test-e2e         # Playwright E2E tests
just test-e2e-chromium # Chromium only
just test-e2e-ui      # Playwright UI mode
```

### Quality Checks

```bash
pnpm lint             # ESLint
pnpm typecheck        # TypeScript type checking
pnpm format           # Auto-format with Prettier
pnpm format:check     # Check formatting
just check            # Run all quality checks
```

### Supabase

```bash
just supa-start       # Start local Supabase
just supa-stop        # Stop local Supabase
just supa-status      # Check status
just supa-types-local # Regenerate database.types.ts
just supa-reset       # Reset database
```

## Architecture

### Project Structure

```
src/app/
├── core/              # Singletons, guards, interceptors
│   ├── guards/        # Route guards (auth.guard.ts)
│   ├── services/      # Global services (supabase, auth)
│   └── types/         # TypeScript types (database.types.ts)
├── shared/            # Reusable UI components
│   └── components/    # toast, confirm-modal, avatar
├── features/          # Feature routes (lazy-loaded)
│   ├── auth/          # Login, signup, callback
│   ├── home/          # Public home page
│   └── dashboard/     # Protected dashboard + settings
├── layouts/           # Page layouts
│   ├── main-layout/   # Header + footer + content
│   └── auth-layout/   # Centered card layout
├── app.routes.ts      # Main routing config
└── app.routes.server.ts # SSR render modes
```

### Path Aliases

- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`
- `@env/*` → `src/environments/*`

### Key Patterns

- **Standalone components** - No NgModules, all components are standalone
- **Signals** - Use Angular signals for reactive state
- **Lazy loading** - All feature routes are lazy-loaded
- **Functional guards** - `authGuard` is a `CanActivateFn`
- **SSR with client-side auth** - Dashboard and auth callback use `RenderMode.Client`

### Environment Files

- `src/environments/environment.ts` - Production config
- `src/environments/environment.development.ts` - Local development (auto-replaced in prod builds)

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `build.yml` - Build check
- `linting.yml` - ESLint + TypeScript type checking
- `format.yml` - Prettier check
- `tests.yml` - Vitest unit tests
- `duplication.yml` - jscpd threshold check
- `playwright-e2e.yml` - Playwright E2E tests

## Git Conventions

- No "Co-Authored-By" in commit messages
- Branch: feature branches -> main
- Versioning: `YY.M.D-alpha.HHMM`
