# Project Architecture

## Project Overview

FE-engage-team-builder is an Angular 21 frontend application for managing team members and their roles. It features a sidebar navigation with team management panels and member cards.

## Core Structure

```
src/
├── app/
│   ├── features/           # Feature modules and their components
│   │   ├── team-members/   # Team member management
│   │   ├── sidebar/        # Navigation sidebar
│   │   └── ...
│   ├── shared/
│   │   ├── components/     # Reusable components
│   │   ├── services/       # Business logic services
│   │   ├── models/         # Data models and interfaces
│   │   └── pipes/          # Custom pipes
│   ├── models/             # Global data models
│   ├── app.component.ts    # Root component
│   └── app.config.ts       # Application configuration
├── assets/
│   ├── images/             # Static images
│   └── styles/             # Global styles
└── environments/           # Environment-specific config
```

## Technology Stack

- **Angular 21**: Frontend framework
- **TypeScript 5.9**: Language
- **PrimeNG & PrimeIcons**: UI components and icons
- **TailwindCSS**: Utility-first CSS
- **Vitest**: Unit testing framework
- **ESLint**: Code linting
- **RxJS**: Reactive programming

## Key Components

- **SidebarComponent**: Main navigation with vertical menu (PrimeNG Sidebar)
- **TeamMemberCardComponent**: Displays individual team member info with role and healing indicator
- **TeamManagementComponent**: Main feature container for team operations

## State Management

Uses Angular services with RxJS Observables for reactive state management. No centralized state library (Redux/NgRx).

## Styling

- **TailwindCSS** for utility-first styling
- **PrimeNG theme** for component styling
- Responsive design with mobile-first approach
