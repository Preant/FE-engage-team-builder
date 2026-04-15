# CLAUDE.md — FE-engage-team-builder

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FE-engage-team-builder is an Angular 21 frontend application for managing team members and their roles. It features a dynamic sidebar navigation with team management panels and member cards displaying role information and healing indicators.

## Commands

```bash
npm start              # Start dev server (localhost:4200)
npm run build          # Build for production (dist/)
npm run watch          # Watch mode build
npm run lint           # Run ESLint
npm run lint-fix       # Fix ESLint issues
npm run test           # Run Vitest with coverage
npm run test-server    # Interactive Vitest UI
```

## Architecture

### Project Structure

```
src/app/
├── features/           # Feature modules (team-members, sidebar, etc.)
├── shared/
│   ├── components/     # Reusable UI components
│   ├── services/       # Business logic services
│   ├── models/         # Data interfaces and types
│   └── pipes/          # Custom Angular pipes
├── models/             # Global data models
├── app.component.ts    # Root component
└── app.config.ts       # Application configuration
```

### Core Components

- **SidebarComponent**: Navigation with PrimeNG Sidebar (vertical menu)
- **TeamMemberCardComponent**: Displays team member info (name, role, healing indicator)
- **TeamManagementComponent**: Main feature container

### Technology Stack

- **Angular 21**: Frontend framework with standalone components
- **TypeScript 5.9**: Strongly typed language
- **PrimeNG 21**: Component library (Sidebar, Cards, Icons)
- **TailwindCSS 3**: Utility-first CSS framework
- **RxJS 7**: Reactive programming
- **Vitest**: Unit testing framework (Vite-based)
- **ESLint**: Code linting with TypeScript support

## Development Guidelines

### TypeScript Standards

- **Explicit types**: All parameters, returns, and properties must be typed (no `any`)
- **Use `unknown`**: For external data with type guards
- **Prefer `type` over `interface`** except for extendable contracts
- **No non-null assertions** (`!`) without defensive checks
- **camelCase**: Variables, functions, properties
- **PascalCase**: Classes, interfaces, types, components
- **Path aliases**: Use `@app/` instead of `../` relative imports

### Component Development

- **Standalone components**: All new components should be standalone
- **OnPush change detection**: Use `ChangeDetectionStrategy.OnPush` for performance
- **Type-safe templates**: Bind to strongly typed properties/methods
- **Proper cleanup**: Use `takeUntil` pattern for subscriptions
- **No direct DOM manipulation**: Use Angular templates and services

Example component structure:
```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, /* ... */],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureComponent {
  @Input() data: DataType;
  @Output() action = new EventEmitter<ActionType>();

  constructor(private service: MyService) {}

  ngOnInit() { /* setup */ }
  handleAction() { /* logic */ }
}
```

### Code Quality

- **Unit tests**: All new code requires tests (target 80%+ coverage)
- **ESLint compliance**: Zero violations before committing
- **Build success**: `npm run build` must pass
- **Consistent patterns**: Follow existing codebase conventions

### Testing

- **Test structure**: Given-When-Then pattern
- **Mock external dependencies**: HTTP calls, services, etc.
- **Test components and services separately**: Unit tests over integration tests
- **Async handling**: Use `fakeAsync`/`tick` or proper async test utilities

Example test:
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName],
      // mock dependencies
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should handle user action', () => {
    // Arrange
    component.data = testData;
    
    // Act
    component.handleAction();
    fixture.detectChanges();
    
    // Assert
    expect(component.result).toBe(expected);
  });
});
```

## Git Workflow

- **Base branch**: `main`
- **Branch format**: `{type}/{description}` (e.g., `feature/add-role-management`, `fix/sidebar-wrapping`)
- **Commits**: Conventional Commits format
  - `feat(scope): description`
  - `fix(scope): description`
  - `refactor(scope): description`
  - `test(scope): description`
  - `docs(scope): description`
- **⚠️ Important**: Do NOT include `Co-Authored-By: Claude` in commits. Claude should not add any co-author signatures.
- **Merge**: Squash and Merge to keep history clean

## Security

- Never hardcode secrets, API keys, or credentials
- Use environment variables (`environment.ts`) for configuration
- Don't log sensitive data (tokens, passwords, PII)
- Validate all user input
- Use Angular's `DomSanitizer` for dynamic HTML content to prevent XSS

## Performance

- Use `ChangeDetectionStrategy.OnPush` on components
- Use the async pipe (`| async`) to handle observables in templates
- Unsubscribe from observables to prevent memory leaks
- Lazy load feature modules when possible
- Avoid unnecessary change detection cycles

## Resources

- [Angular 21 Documentation](https://angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PrimeNG Components](https://primeng.org)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [RxJS Documentation](https://rxjs.dev)

## Communication

- Code and commits must be in **English**
- Use French for developer communication (unless `.dev-language` file exists with different language)
