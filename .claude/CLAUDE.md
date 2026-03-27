
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Always use external template files (`templateUrl`), do NOT use inline `template`
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Use NgRx Signal Store (`@ngrx/signals`) for shared/domain state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Structure (DDD)

- `src/app/core/` — Shared infrastructure (guards, interceptors, layout)
- `src/app/shared/` — Shared UI components, utils, pipes, directives
- `src/app/domains/<domain>/` — Feature domains (bounded contexts)
  - `feature/` — Smart components / pages
  - `ui/` — Presentational components
  - `data-access/` — Services, stores, API calls
  - `model/` — Interfaces, types, enums
- Module boundaries are enforced via `@softarc/sheriff-core` (barrelless mode)
- Do NOT use barrel files (`index.ts`), import directly from source files

## i18n

- Use `@jsverse/transloco` for all user-facing text
- Default language: German (`de`), also available: English (`en`)
- Translation files: `public/assets/i18n/{lang}.json`

## Testing

- Unit tests: Vitest (`ng test`)
- Component/E2E tests: Playwright (`npm run e2e`)

## UI & Styling

- Use PrimeNG components for UI (theme: Aura via `@primeuix/themes`)
- Use Tailwind CSS for utility styling
- zone.js is enabled (required for PrimeNG)

## Table Pattern (Blueprint)

Use the user table (`domains/user/feature/user-page.ts`) as blueprint for all new tables. Key conventions:

### Table Page Component
- `host: { class: 'flex flex-col h-full min-h-0' }` for proper scroll containment
- `providers: [ConfirmationService, MessageService]` at component level
- Define columns as `Column[]` with `field` and `headerKey` (transloco key)
- Wrap content in `<div class="flex flex-col gap-6 h-full min-h-0">`

### Toolbar (above table)
- **Left**: Column toggler (`p-multiselect`) with translated labels and `selectedItemsLabel`
- **Center**: Global search (`p-iconfield` + `pInputText`)
- **Right**: Add button (`p-button` with `pi pi-plus`)

### p-table Configuration
- `[scrollable]="true"` + `scrollHeight="flex"` (no pagination, scroll within frame)
- `size="small"` for compact rows
- `[showGridlines]="true"` for column separation
- `[resizableColumns]="true"` + `columnResizeMode="expand"` + `pResizableColumn` on `<th>`
- `selectionMode="single"` with `[pSelectableRow]` (no checkboxes)
- `dataKey="id"`

### Column Filters
- Use `display="menu"` (overlay popup, no inline filters)
- Text columns: `matchMode="contains"` with `pInputText`
- Enum columns (e.g. role): `matchMode="equals"` with `p-select` dropdown using translated options
- Use `[showMatchModes]="false" [showOperator]="false" [showAddButton]="false"`

### Actions Column
- Fixed width `style="width: 5rem"`
- Edit button: `pi pi-pencil`, `[rounded]="true"` `[text]="true"`
- Delete button: `pi pi-trash`, `[rounded]="true"` `[text]="true"` `severity="danger"`
- Delete uses `ConfirmationService` with translated labels (`acceptLabel`, `rejectLabel`)

### Toast Notifications
- `<p-toast />` + `<p-confirmdialog />` in template
- Success toast on create, update, delete (`life: 3000`)
- Error toast on failure (`life: 5000`)

### Dialog for Create/Edit
- Reuse one dialog component for both create and edit
- Accept `user` input signal (`null` = create, `UserProfile` = edit)
- Use `effect()` to patch form when user input changes
- PrimeNG `FloatLabel` with `variant="on"` for all fields
- Mark mandatory fields with `*` in labels
- Save button: `[disabled]="form.invalid || !form.dirty"`
- Emit separate outputs: `userSaved` and `dialogClosed`
- Do NOT use native DOM event names for outputs (e.g. `save`, `cancel`)
