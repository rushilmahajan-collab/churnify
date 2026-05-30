# RetainIQ Backend

Node.js + Express API server for RetainIQ, a retention intelligence dashboard for subscription businesses.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Database Setup

```bash
npm run db:push
npm run db:seed
```

### Development

```bash
npm run dev
```

Server will start on port 3001.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

- `src/server.ts` - Express app entry point
- `src/config/` - Database, Redis, external service configs
- `src/db/` - Drizzle ORM schema and migrations
- `src/routes/` - API route handlers
- `src/middleware/` - Express middleware
- `src/services/` - Business logic services
- `src/jobs/` - Background job processors and scheduler
- `src/utils/` - Helper functions
- `src/types/` - TypeScript type definitions

## API Endpoints

See `/src/routes/` for full API specification.

## Database

PostgreSQL with Drizzle ORM. Schema defined in `/src/db/schema/`.

## Jobs

Background jobs via Bull + Redis:
- Stripe sync
- Health score recalculation
- Campaign email sending
- Daily snapshots
- Alert digest emails
