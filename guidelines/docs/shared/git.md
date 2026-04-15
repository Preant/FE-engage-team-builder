<!-- Activation mode: Always On -->
<!-- DO NOT MODIFY — update from the dev-guidelines repository -->

# Git Conventions

## Branch naming

```
{type}/{description}
```

Examples: `feature/add-role-management`, `fix/sidebar-navigation`, `chore/update-deps`

## Commit message format (Conventional Commits)

```
type(scope): message
```

Examples:

- `feat(team-member): add role management panel`
- `fix(sidebar): prevent navigation wrapping`
- `refactor(card-component): extract healing indicator`
- `test(team-member): add role validation tests`
- `docs(README): update setup instructions`

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`

## Merge strategy

Squash and Merge — keep history clean.

## Pull Requests

Require CI pipeline pass (lint, test, build) and review.
