# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
ng serve
```
Starts development server at `http://localhost:4200/` with automatic reload and proxy configuration.

### Build Commands
```bash
ng build                    # Production build
ng build --configuration development    # Development build
ng build --watch --configuration development    # Development build with file watching
```

### Testing
```bash
ng test                     # Run unit tests with Karma
ng e2e                      # Run end-to-end tests (if configured)
```

### Code Generation
```bash
ng generate component component-name    # Generate new component
ng generate --help                      # List all available schematics
```

## Architecture Overview

This is an Angular 19 personal website/blog application with a feature-rich architecture:

### Project Structure
- **Feature-based organization**: Main features are organized in `src/app/features/`
- **Component library**: Reusable components in `src/app/components/`
- **Core functionality**: Authentication, guards, and shared utilities in `src/app/core/`
- **Services layer**: API services in `src/app/services/`
- **Lazy loading**: Most routes use lazy-loaded components for better performance

### Key Architectural Patterns

#### Routing Architecture
- **Main Layout**: Public pages (home, blog, about, etc.) wrapped in `MainLayoutComponent`
- **Admin Layout**: Protected admin routes with `authGuard` authentication
- **Lazy Loading**: Most feature components are lazy-loaded for performance

#### Authentication System
- JWT-based authentication using `AuthService`
- Route protection with `authGuard` functional guard
- Automatic redirect to login with return URL for protected routes
- Authentication state managed with RxJS observables

#### API Integration
- Backend API at `http://localhost:3000` (configured via proxy in development)
- Services follow Angular's `Injectable` pattern with provided-in-root
- Environment-based configuration for API URLs
- Strongly-typed models and interfaces for API responses

#### Component Architecture
- **Standalone Components**: Modern Angular 19 standalone components approach
- **Material Design**: Angular Material components with Azure Blue theme
- **SCSS Styling**: Component-specific SCSS with global include paths
- **Markdown Support**: Integrated markdown editor and preview functionality

### Key Features
- **Blog System**: Article CRUD operations, markdown editing, file uploads
- **Admin Panel**: Protected admin interface for content management
- **File Upload**: Component for handling file uploads (in development)
- **Todo Management**: Project/task tracking functionality
- **Responsive Design**: Mobile-first approach with Angular Material

### Development Configuration
- **Proxy Setup**: Development server proxies `/api/*` to `http://localhost:3000`
- **SCSS Include Paths**: Global SCSS imports configured for `src/` directory
- **Asset Management**: Public assets in `src/assets/` and `public/` directories
- **Material Theme**: Azure Blue prebuilt theme with GitHub syntax highlighting

### Testing Strategy
- Unit tests with Karma and Jasmine
- Component testing following Angular's testing patterns
- Service testing with HTTP client mocking

### Build & Deployment
- Production builds with budget limits (2MB initial, 4kB per component)
- Optimized builds with output hashing for production
- Docker configuration available in `docker/` directory