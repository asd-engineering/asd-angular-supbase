# DeVinci - Project-Agnostic Cloud Development Environment (Full Plan)

> This is the full abstraction plan for DeVinci as a standalone module/platform.
> First prove the concept works with the PoC in asd-angular-supbase, then implement this.

## Context

A generic cloud IDE orchestrator that spins up **any** ASD project's full development environment in CI and makes it accessible via browser. Delegates to the **target project's own `asd.yaml`** - meaning `asd run dev` in CI gives you the same environment you'd get locally. Supports both GitHub Actions and GitLab CI, auto-detected from git remote.

## Design Decisions

1. **Delegate to project's asd.yaml** - DeVinci provisions the runner + installs tooling, then runs `asd run dev`
2. **GitLab.com (SaaS)** support alongside GitHub Actions
3. **Auto-detect CI platform** from git remote URL (`github.com` → GitHub Actions, `gitlab.com` → GitLab CI)
4. **Workflow template installed per-project** via `asd devinci setup` (like `asd gh setup`)

## Repositories

| Repo                | Role                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| **asd-devinci**     | Orchestrator. Hosts the asd_module code + CI templates (GitHub + GitLab) |
| **Any ASD project** | Target. Has its own `asd.yaml` defining the dev environment              |

---

## asd-devinci Repository Structure

```
asd-devinci/
├── modules/devinci/                    # asd_module (the core)
│   ├── index.mjs                       # Module entry + service descriptor
│   ├── scripts/
│   │   ├── cli.mjs                     # Command registration
│   │   ├── api.mjs                     # Core logic (wizard, dispatch, watch)
│   │   └── providers/                  # CI platform abstraction
│   │       ├── github.mjs              # GitHub Actions provider
│   │       └── gitlab.mjs              # GitLab CI provider
│   └── templates/                      # CI templates for `asd devinci setup`
│       ├── github/
│       │   └── devinci.yml             # GitHub Actions workflow template
│       └── gitlab/
│           └── .gitlab-ci.devinci.yml  # GitLab CI job template
├── CLAUDE.md
├── Justfile
└── .gitignore
```

## CI Templates (project-agnostic)

Both follow: **provision runner → install tooling → `asd run dev` → keep alive**.

### GitHub Actions template

Installed into `.github/workflows/devinci.yml` via `asd devinci setup`.

Single job, `ubuntu-latest`, 6h timeout. Inputs: ref, username, password, asd-version, tunnel-name, tunnel-host, tunnel-port.

Steps:

1. Checkout project
2. Setup Node 22 + pnpm
3. Install ASD CLI
4. Generate tunnel credentials + upload artifact
5. Set env vars
6. `asd run dev` (reads project's asd.yaml)
7. Display URLs
8. Keep alive

### GitLab CI template

Installed into `.gitlab-ci.devinci.yml` via `asd devinci setup`.

Manual trigger, 6h timeout, docker:dind service for Supabase.

Trigger: `glab ci run -b main --variables "USERNAME=test,PASSWORD=test123"`

## asd_module: `modules/devinci/`

### Commands

- `asd devinci` - Interactive menu
- `asd devinci launch` - Launch wizard (auto-detects GitHub/GitLab)
- `asd devinci active` - List sessions
- `asd devinci stop` - Cancel session
- `asd devinci setup` - Install CI template into current project

### Provider abstraction

**`providers/github.mjs`**:

- `dispatch(config)` → `gh workflow run devinci.yml`
- `listActive()` → `gh run list --workflow=devinci.yml --status=in_progress`
- `stop(runId)` → `gh run cancel`
- `watch(runId)` → Poll + extract tunnel URL from artifacts

**`providers/gitlab.mjs`**:

- `dispatch(config)` → `glab ci run`
- `listActive()` → `glab ci list --status=running`
- `stop(pipelineId)` → `glab ci cancel`
- `watch(pipelineId)` → Poll + extract tunnel URL from artifacts

### Module distribution

- Initial: lives in `asd-devinci/modules/devinci/`
- Next: loadable via `asd.yaml` `project.modules: [devinci]`
- Future: npm package `@asd-engineering/module-devinci`, auto-installed by `auto_install_modules: true`

## Prerequisites for each project

1. `asd.yaml` with `automation.dev` sequence
2. CI template installed via `asd devinci setup`
3. Features: `auto_start_caddy`, `auto_start_ttyd`, `auto_start_codeserver`
4. Network services configured for tunnel routing

## PoC Status

### Implemented (feature/devinci branch)

1. **asd-devinci** bootstrapped as GitHub Composite Action
   - `action.yml` - composite action with all inputs/outputs
   - `scripts/install-asd.sh` - ASD CLI installer from GitHub releases
   - `scripts/setup-tunnel.sh` - ephemeral tunnel credential setup
   - `scripts/keep-alive.sh` - health check loop

2. **asd-angular-supbase** consumer integration
   - `.github/workflows/devinci.yml` - thin workflow (~25 lines)
   - `asd.yaml` - added code-server feature, automation step, network service, hub view
   - `Justfile` - devinci, devinci-active, devinci-watch, devinci-stop commands

### Next Steps (after PoC validation)

- Abstract into asd_module with provider pattern (GitHub + GitLab)
- `asd devinci setup` command to install CI template
- `asd devinci launch` interactive wizard
- GitLab CI provider

## Redmine

Epic #2949 exists. Tickets partially created:

- #2952 Configure asd.yaml for full-stack cloud environment
- #2953 Implement multi-service tunnel routing via Caddy in CI
- #2956 Integration testing and verification
