# Book Server

NestJS API with PostgreSQL, Drizzle ORM, and Zod validation.

## Requirements

- Node.js 22+
- pnpm
- Docker with Docker Compose

## Local setup

```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:migrate
pnpm start:dev
```

PostgreSQL runs on `localhost:5432` by default. Docker Compose keeps its data in
the `postgres_data` named volume and waits for PostgreSQL to become healthy.
Once the API is running, `GET /health/database` verifies a live database query.

## Book API

| Method   | Path         | Operation     |
| -------- | ------------ | ------------- |
| `POST`   | `/books`     | Create a book |
| `GET`    | `/books`     | List books    |
| `GET`    | `/books/:id` | Get one book  |
| `PATCH`  | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Delete a book |

Create and update payloads accept `title`, `slug`, and optional `description`.
The API rejects unknown fields, validates UUID route parameters, and returns
consistent JSON errors for invalid input, missing books, and duplicate slugs.

## Database workflow

The Drizzle schema lives in `src/database/schema`. After changing it, generate
and apply a versioned migration:

```bash
pnpm db:generate
pnpm db:migrate
```

Useful commands:

```bash
pnpm db:up       # start PostgreSQL
pnpm db:down     # stop PostgreSQL without deleting its data
pnpm db:check    # validate generated migration history
pnpm db:studio   # open Drizzle Studio
pnpm db:push     # push schema directly (local prototyping only)
```

`DatabaseService` is global and injectable in Nest services. Use its typed
`client` property for queries:

```ts
constructor(private readonly database: DatabaseService) {}

findAll() {
  return this.database.client.query.books.findMany();
}
```

`insertBookSchema` and `selectBookSchema` are generated from the Drizzle table
definition, so database types and Zod runtime validation stay aligned.

## Environment variables

Copy `.env.example` for local development. Configuration is parsed by Zod at
application startup and by Drizzle Kit, so invalid values fail fast.

| Variable      | Default         | Description                    |
| ------------- | --------------- | ------------------------------ |
| `NODE_ENV`    | `development`   | Runtime environment            |
| `PORT`        | `3000`          | HTTP port                      |
| `DB_HOST`     | `localhost`     | PostgreSQL host                |
| `DB_PORT`     | `5432`          | PostgreSQL host port           |
| `DB_USER`     | `book_postgres` | PostgreSQL user                |
| `DB_PASSWORD` | `book_password` | PostgreSQL password            |
| `DB_NAME`     | `book_db`       | PostgreSQL database            |
| `DB_SSL`      | `false`         | Enable TLS for remote database |

## Validation

```bash
pnpm lint
pnpm test
pnpm build
```
