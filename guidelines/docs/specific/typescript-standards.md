# TypeScript Standards

## Type Definitions

- **Always provide explicit types** for parameters, return types, and properties
- Use `unknown` instead of `any` for external data with proper type guards
- Prefer `type` aliases over `interface` (except for extendable contracts)
- Use branded types for IDs to prevent mixing:

```typescript
type TeamMemberId = string & { readonly __brand: 'TeamMemberId' };
type RoleId = string & { readonly __brand: 'RoleId' };

function createTeamMemberId(id: string): TeamMemberId {
  return id as TeamMemberId;
}
```

## Naming Conventions

- **camelCase**: variables, functions, properties
- **PascalCase**: classes, interfaces, type aliases, components
- **UPPERCASE_SNAKE_CASE**: constants
- **Prefixes**: 
  - `is*` / `has*` for booleans: `isActive`, `hasPermission`
  - `on*` for event handlers: `onClick`, `onSubmit`
  - `handle*` for internal handlers: `handleError`

## Code Style

- **Max parameters**: 3-4, use typed objects for more
- **No non-null assertions** (`!`) except after defensive checks
- **No `console.log`** in production code (use proper logging)
- **Path aliases**: Use `@` (configured in `tsconfig.json`) instead of `../` relative imports

Example:
```typescript
// ❌ Bad
import { TeamService } from '../../../services/team.service';

// ✅ Good
import { TeamService } from '@app/shared/services/team.service';
```

## Immutability

- Prefer immutable data structures
- Use spread operator for object/array updates:

```typescript
// ✅ Good
const updated = { ...state, count: state.count + 1 };
const newArray = [...array, item];

// ❌ Bad
state.count++;
array.push(item);
```

## Error Handling

- Catch and log errors appropriately
- Provide meaningful error messages
- Use typed error handling:

```typescript
interface ErrorResponse {
  message: string;
  code: string;
}
```

## Comments

- Write self-documenting code
- Only comment non-obvious logic
- Keep comments updated with code changes
- Use meaningful variable names instead of explaining unclear code

Example:
```typescript
// ❌ Bad comment
// loop through members
for (const member of members) {

// ✅ Better: clear naming
for (const activeTeamMember of activeMembers) {
```
