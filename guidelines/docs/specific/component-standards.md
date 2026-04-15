# Component Development Standards

## Component Structure

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, FormsModule, /* dependencies */],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentNameComponent {
  // Inputs
  @Input() required: string;
  @Input() optional?: string;

  // Outputs
  @Output() action = new EventEmitter<type>();

  // Lifecycle
  ngOnInit() {}

  // Public methods
  handleAction() {}

  // Private methods
  private compute() {}
}
```

## Best Practices

- **OnPush Change Detection**: Use `ChangeDetectionStrategy.OnPush` for better performance
- **Standalone Components**: All new components should be standalone (no NgModule)
- **Type Safety**: Always provide explicit types, never use `any`
- **Async Operations**: Use async pipe or proper subscription cleanup
- **Unsubscribe Pattern**: Use `takeUntil` with a destroy subject for subscriptions
- **Comments**: Only for non-obvious logic; code should be self-documenting

## Template Guidelines

- Use `*ngIf` and `*ngFor` for conditional rendering and loops
- Use async pipe (`| async`) for observables
- Bind events with proper handlers: `(click)="handleClick()"`
- Use property binding for data: `[property]="value"`
- Use two-way binding sparingly: `[(ngModel)]="value"`

## Service Standards

- Services should be injectable with `providedIn: 'root'`
- Use typed Observables: `Observable<Type>` not `Observable<any>`
- Keep services focused on single responsibility
- Return Observables rather than Promises for consistency

## Testing

- One test file per component: `component-name.component.spec.ts`
- Follow Arrange-Act-Assert pattern
- Mock external dependencies
- Test user interactions and output changes
- Target 80%+ coverage for new components
