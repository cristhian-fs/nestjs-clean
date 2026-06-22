# NestJS Clean Architecture Forum API

This project is part of the NestJS course from RocketSeat. It implements a Q&A forum REST API using NestJS with clean architecture and domain-driven design principles.

## Overview

A backend API that allows students to post questions, answer them, comment, vote on best answers, upload attachments, and receive notifications. The codebase is organized around domain boundaries and separates business logic from infrastructure concerns.

## Architecture

The project follows Clean Architecture with three main layers:

```
src/
  core/           # Framework-agnostic primitives: base Entity, UniqueEntityId,
  |               # domain events dispatcher, and shared repository interfaces
  domain/         # Business logic, completely independent of NestJS or any framework
  |  forum/
  |  |  enterprise/entities/   # Domain entities and value objects
  |  |  application/use-cases/ # One use case per file; depends only on repository interfaces
  |  notification/
  |     enterprise/entities/
  |     application/use-cases/
  |     application/subscribers/ # Domain event listeners
  infra/          # All framework and I/O concerns
     auth/        # JWT RS256 guard applied globally
     cache/       # Redis cache abstraction
     cryptography/ # bcrypt hasher + JWT encrypter adapters
     database/    # Prisma client, mappers, and repository implementations
     env/         # Zod-validated environment schema via @nestjs/config
     events/      # NestJS event emitter wiring for domain events
     http/        # Controllers, Zod validation pipes, and response presenters
     storage/     # AWS S3 (or MinIO) file uploader adapter
```

Domain repositories are defined as abstract classes inside `domain/` and implemented inside `infra/database/repositories/`. Use cases depend only on the abstract interfaces, keeping business logic fully testable without a database.

## Domains

### Forum

The core domain of the application.

**Entities**

| Entity                                    | Description                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `Student`                                 | Registered user who can post questions and answers                     |
| `Instructor`                              | Privileged user role                                                   |
| `Question`                                | A forum question with a title, slug, content, and optional best answer |
| `Answer`                                  | A response to a question                                               |
| `Comment`                                 | A comment on a question or answer                                      |
| `Attachment`                              | A file attached to a question or answer                                |
| `QuestionAttachment` / `AnswerAttachment` | Join entities for attachment lists                                     |

**Value Objects**

| Value Object        | Description                                       |
| ------------------- | ------------------------------------------------- |
| `Slug`              | URL-safe identifier derived from a question title |
| `QuestionDetails`   | Enriched read model with author and attachments   |
| `QuestionSummary`   | Lightweight read model for listing questions      |
| `AnswerWithAuthor`  | Answer enriched with author information           |
| `CommentWithAuthor` | Comment enriched with author information          |

**Domain Events**

- `AnswerCreatedEvent` - fired when a new answer is posted; triggers a notification to the question author
- `QuestionBestAnswerChosenEvent` - fired when the author marks a best answer; triggers a notification to the answer author

### Notification

Separate bounded context for in-app notifications.

**Entities**

| Entity         | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `Notification` | A notification sent to a user, with an optional `readAt` timestamp |

## Endpoints

All routes are prefixed with `/api`. Authentication is required on every route except account creation and session creation.

### Accounts

| Method | Path            | Description                          |
| ------ | --------------- | ------------------------------------ |
| `POST` | `/api/accounts` | Register a new student account       |
| `POST` | `/api/sessions` | Authenticate and receive a JWT token |

### Questions

| Method   | Path                   | Description                       |
| -------- | ---------------------- | --------------------------------- |
| `GET`    | `/api/questions`       | List recent questions (paginated) |
| `GET`    | `/api/questions/:slug` | Get a question by its slug        |
| `POST`   | `/api/questions`       | Create a new question             |
| `PUT`    | `/api/questions/:id`   | Edit a question                   |
| `DELETE` | `/api/questions/:id`   | Delete a question                 |

### Answers

| Method   | Path                                    | Description                       |
| -------- | --------------------------------------- | --------------------------------- |
| `POST`   | `/api/questions/:questionId/answers`    | Post an answer to a question      |
| `GET`    | `/api/questions/:id/answers`            | List answers for a question       |
| `PUT`    | `/api/answers/:id`                      | Edit an answer                    |
| `DELETE` | `/api/answers/:id`                      | Delete an answer                  |
| `PATCH`  | `/api/answers/:answerId/choose-as-best` | Mark an answer as the best answer |

### Comments

| Method   | Path                                  | Description                 |
| -------- | ------------------------------------- | --------------------------- |
| `POST`   | `/api/questions/:questionId/comments` | Comment on a question       |
| `GET`    | `/api/questions/:id/comments`         | List comments on a question |
| `DELETE` | `/api/questions/comments/:id`         | Delete a question comment   |
| `POST`   | `/api/answers/:answerId/comments`     | Comment on an answer        |
| `GET`    | `/api/answers/:id/comments`           | List comments on an answer  |
| `DELETE` | `/api/answers/comments/:id`           | Delete an answer comment    |

### Attachments

| Method | Path               | Description                                                                 |
| ------ | ------------------ | --------------------------------------------------------------------------- |
| `POST` | `/api/attachments` | Upload a file; returns the attachment ID to include in a question or answer |

### Notifications

| Method  | Path                                      | Description                 |
| ------- | ----------------------------------------- | --------------------------- |
| `PATCH` | `/api/notifications/:notificationId/read` | Mark a notification as read |

## Authentication

JWT RS256 is used. The guard is applied globally via `APP_GUARD`. The two public routes (`POST /api/accounts` and `POST /api/sessions`) are decorated with `@Public()` to skip the guard.

Include the token in requests as a Bearer token:

```
Authorization: Bearer <token>
```

## Infrastructure

| Concern      | Technology                 |
| ------------ | -------------------------- |
| Framework    | NestJS 11                  |
| Database     | PostgreSQL via Prisma 7    |
| Cache        | Redis (ioredis)            |
| File storage | AWS S3 / MinIO             |
| Validation   | Zod + zod-validation-error |
| Testing      | Vitest                     |

## Environment Variables

Copy and fill the following variables into a `.env` file at the project root:

```env
DATABASE_URL=

JWT_PRIVATE_KEY=   # base64-encoded RS256 private key
JWT_PUBLIC_KEY=    # base64-encoded RS256 public key

PORT=3333          # optional, defaults to 3333

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

REDIS_HOST=127.0.0.1   # optional
REDIS_PORT=6379         # optional
REDIS_DB=0              # optional
```

## Running Locally

Start the required services with Docker Compose:

```bash
docker compose up -d
```

This starts PostgreSQL on port `5555`, MinIO on ports `9000`/`9001`, and Redis on port `6379`.

Install dependencies and run the application:

```bash
pnpm install
pnpm prisma migrate deploy
pnpm start:dev
```

## Testing

Unit tests (use cases and domain logic):

```bash
pnpm test
```

End-to-end tests (requires the Docker services running):

```bash
pnpm test:e2e
```
