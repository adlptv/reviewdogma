# ReviewDogma — Code Review Policy Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

Define code review rules as YAML. ReviewDogma reads PR diffs, runs policy checks, and posts findings as review comments — catching patterns that static analysis tools don't cover.

## Screenshots

| PR Diff Analysis with Violations | YAML Policy DSL Editor |
|:---:|:---:|
| ![PR Diff Analysis with Violations](screenshots/hero.png) | ![YAML Policy DSL Editor](screenshots/dashboard.png) |

## Features

- Policy DSL in YAML: define patterns, severity levels, file exclusions, and custom messages
- AST-based detection with tree-sitter for JavaScript, TypeScript, and Python
- GitHub App integration: receives webhooks, posts review comments on PRs
- Team dashboard with anti-pattern trends and review coverage stats
- Policy marketplace for sharing rules between teams
- Monaco Editor for YAML with syntax highlighting and live validation

## Example Policy

```yaml
name: TypeScript Safety Rules
severity: high
rules:
  - id: no-explicit-any
    description: New files must not use the any type
    pattern: ": any"
    excludeExistingFiles: true
    message: Use a specific type instead of any

  - id: rate-limit-api
    description: Every API route must include rate limiting
    pattern: "export async function (GET|POST|PUT|DELETE)"
    check: "must_include: rateLimit"
    message: Add rate limiting middleware to this route"
```

## Quick Start

```bash
git clone https://github.com/adlptv/reviewdogma.git
cd reviewdogma
pnpm install
pnpm dev
```

Or:
```bash
docker-compose up
```

## Architecture

```
apps/reviewdogma/
├── src/app/          # Pages: landing, policies, dashboard, marketplace, settings
│   └── api/          # policies, analyze, webhook/github, dashboard/stats, marketplace, health
├── src/components/   # PolicyEditor (Monaco), PRDiff, Dashboard, UI primitives
├── src/lib/          # AST parser, policy evaluator, validators (Zod)
├── prisma/           # SQLite: Policy, Analysis, ReviewStat
└── tests/
```

## API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | /api/policies | List or create policies |
| GET/PUT/DELETE | /api/policies/[id] | Manage a policy |
| POST | /api/policies/validate | Validate YAML syntax |
| POST | /api/analyze | Analyze code diff against policies |
| POST | /api/webhook/github | Receive GitHub webhook events |
| GET | /api/dashboard/stats | Aggregated review statistics |
| GET | /api/marketplace | List community policies |
| GET | /api/health | Health check |

## Security

- Zod validation on all routes
- GitHub webhook secret verification with timing-safe comparison
- Rate limiting
- Helmet.js headers

## License

MIT