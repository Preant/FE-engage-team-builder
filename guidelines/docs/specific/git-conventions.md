# Git Conventions (Project-Specific)

## Branch naming

```
{type}/{description}
```

Examples: `feature/add-role-management`, `fix/sidebar-navigation`, `chore/update-deps`

## Commit message format (Conventional Commits)

```
type(scope): description
```

Examples:

- `feat(team-member): add role management panel`
- `fix(sidebar): prevent navigation wrapping`
- `refactor(card-component): extract healing indicator`
- `test(team-member): add role validation tests`
- `docs(README): update setup instructions`

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`

## Important: Co-author signatures

⚠️ **Do NOT add `Co-Authored-By` signatures in commits.**

Claude should NEVER include `Co-Authored-By: Claude Code` or any co-author metadata when committing code. All commits should be authored solely by the project developer (Paolo).

## Merge strategy

Squash and Merge — keep history clean.

## Pull Requests

Require CI pipeline pass (lint, test, build) and review.
