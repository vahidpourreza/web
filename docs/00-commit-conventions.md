# Commit Conventions (Conventional Commits)

## Format

```
type(scope): short description
```

- **type**: What kind of change
- **scope**: Optional — which part of the project (e.g. `auth`, `types`, `sidebar`)
- **description**: Imperative mood, lowercase, no period at end

## Types

| Type | When to use | Example |
| --- | --- | --- |
| `feat` | New feature or functionality | `feat(auth): add login page` |
| `fix` | Bug fix | `fix(sidebar): correct RTL alignment` |
| `docs` | Documentation only | `docs: add commit conventions guide` |
| `style` | Formatting, whitespace, no code change | `style: fix indentation in layout` |
| `refactor` | Code change that doesn't fix a bug or add feature | `refactor(api): simplify error handling` |
| `chore` | Tooling, config, dependencies | `chore: add prettier config` |
| `test` | Adding or fixing tests | `test(auth): add token refresh tests` |
| `build` | Build system or external dependencies | `build: update next.js to v16.2` |
| `ci` | CI/CD pipeline changes | `ci: add github actions workflow` |
| `perf` | Performance improvement | `perf(api): cache user claims` |

## Rules

1. **Imperative mood** — "add feature" not "added feature" or "adding feature"
2. **Lowercase** — `feat(auth): add login` not `Feat(Auth): Add login`
3. **No period** at the end
4. **Short** — under 72 characters for the first line
5. **One change per commit** — don't mix unrelated changes

## Scope Examples for This Project

| Scope | For changes in |
| --- | --- |
| `auth` | `lib/auth/`, login/logout, middleware |
| `api` | `lib/api/`, HTTP client, endpoints |
| `types` | `types/` |
| `sidebar` | Sidebar components |
| `ui` | General UI components |
| `config` | `config/`, `.env`, `next.config.ts` |

## Multi-line Commits

For bigger changes, add a body after a blank line:

```
feat(auth): add backchannel logout support

Handle IDP logout notifications via POST endpoint.
Extract session ID from logout token and add to
revoked sessions store.
```

## Breaking Changes

If your change breaks existing behavior:

```
feat(api)!: change ApiResponse structure

BREAKING CHANGE: removed `success` field, added `status` and `messages`.
```

## Good vs Bad Examples

```
# Bad
fix stuff
update files
WIP
asdfgh

# Good
fix(auth): handle expired refresh token redirect
feat(types): add MahtaUserClaims interface
chore: add axios dependency
docs: add step-by-step auth integration guide
refactor(sidebar): extract nav items to constant
```
