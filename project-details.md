# SaaS Event Booking Platform

A multi-tenant RESTful API for managing events, organizations, and subscription-based plans.

## Tech Stack & Tools

| Layer               | Technology                                         |
| ------------------- | -------------------------------------------------- |
| **Runtime**         | Node.js + TypeScript                               |
| **Framework**       | NestJS (modular architecture, DI, decorators)      |
| **ORM**             | TypeORM (entities, relations, migrations)          |
| **Database**        | PostgreSQL                                         |
| **Auth**            | JWT (access + refresh tokens), Passport.js, bcrypt |
| **Validation**      | class-validator, class-transformer                 |
| **Logging**         | Pino (pino-http, pino-nestjs)                      |
| **Build Tool**      | SWC (fast TypeScript compilation)                  |
| **Package Manager** | pnpm                                               |
| **Testing**         | Jest, Supertest                                    |
| **Linting**         | ESLint, Prettier                                   |

## Key Features

1. **JWT Authentication with Refresh Token Rotation** — Secure auth with access/refresh token pairs, one-time-use refresh tokens, and automatic token invalidation on logout.

2. **Role-Based Access Control (RBAC)** — Custom guards and decorators (`AuthGuard`, `RoleGuard`, `@Roles()`, `@GetUser()`) to restrict endpoints by user role (Admin, Organizer, User).

3. **Multi-Tenant Organization Management** — Organizer-role users can create and manage organizations; events are scoped to organizations via foreign keys.

4. **SaaS Subscription & Plan System** — Tiered subscription model with monthly/yearly billing cycles, plan-based feature limits (e.g., max events per plan), and subscription status lifecycle (Active/Inactive).

5. **Event CRUD with Plan Limit Enforcement** — Events created under organizations with automatic capacity calculation (rows × columns). The system checks the user's subscription plan limits before allowing new event creation.

6. **Category Tagging (Many-to-Many)** — Events support multiple categories via a junction table, with bulk category validation and dynamic relation updates.

7. **Modular Architecture** — 7 feature modules (Auth, Users, Organizations, Events, Plans, Subscriptions, Categories) with dedicated DTOs, entities, services, and controllers.

8. **Relational Database Design** — 6 entities with UUID primary keys, one-to-one, one-to-many, and many-to-many relationships, cascade deletes, and automatic timestamps.
