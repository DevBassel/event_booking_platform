# SaaS Event Booking Platform - Memory

## Project Overview
A multi-tenant RESTful API for managing events, organizations, and subscription-based plans. It provides role-based access control (Admin, Organizer, User) where Organizers can create Organizations and host Events within them, constrained by their active Subscription Plan.

## Tech Stack
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport.js, bcrypt
- **Validation**: class-validator, class-transformer
- **Logging**: Pino
- **Testing**: Jest, Supertest

## Architecture & Modules
The system follows a modular NestJS architecture with 7 core feature modules:
1. **Auth**: JWT-based authentication with refresh token rotation.
2. **Users**: User management, creation, updates, and profile retrieval.
3. **Organizations**: Multi-tenant containers created by Organizers (1-to-1 with Users).
4. **Events**: Hosted within organizations, categorized via tags, capacity calculated automatically (rows x columns).
5. **Plans**: Seeded subscription tiers defining feature limits (e.g. max events).
6. **Subscriptions**: User-linked active plans tracking billing cycles.
7. **Categories**: Pre-defined tags for grouping events (many-to-many relationship).

## Key Patterns
- **Decorators**: `@Roles()` for RBAC, `@GetUser()` for extracting JWT payload.
- **Guards**: `JwtAuthGuard` for auth verification, `RoleGuard` for enforcing `UserRoles` (Admin, Organizer, User).
- **Pagination**: Consistent approach via `pagination` utility.
- **Transactions**: TypeORM cascade rules configured (e.g. `onDelete: 'SET NULL'`, cascade `events`).

## Testing Conventions
- Service layer testing mocks `Repository<Entity>` and specific utilities (e.g. bcrypt, pagination utils).
- Controller layer testing mocks the corresponding service layer.
- `jest.mock()` is preferred for external utility functions.

## Workflows
- **Auth Flow**: 
  - **Register**: Validates role (Admin disallowed). Creates user. If role is Organizer, creates an Organization linked to the user.
  - **Login**: Validates credentials via `bcrypt`. Generates Access Token (short-lived) and Refresh Token (longer-lived). Updates `refreshToken` in DB.
  - **Refresh**: Validates Refresh Token type, expiration, and matches it with the one stored in DB. Issues new Access and Refresh tokens.
  - **Logout**: Clears the `refreshToken` in DB for the user.
- **Payloads**: Tokens contain `userId`, `name`, `role` (Access only), and `type` (`access` | `refresh`).
- **Event Flow**: A User (Organizer) creates an Organization. They purchase a Plan (Subscription). They can then create Events under the Organization, as long as it doesn't exceed the Plan's `maxEvents` limit.
