# RetainIQ

A retention intelligence dashboard for subscription businesses. Connect Stripe → See who's at risk → Save them.

Built with Next.js, Node.js, PostgreSQL, and Stripe.

## Project Structure

```
churnify/
├── backend/              # Node.js + Express API (Railway)
├── frontend/             # Next.js React app (Vercel)
├── shared/               # Shared types and utilities
└── README.md
```

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App runs on `http://localhost:3000`

### Database

Create a PostgreSQL database and configure `DATABASE_URL` in backend `.env`:

```bash
createdb retainiq
```

Then run migrations:

```bash
cd backend
npm run db:push
```

### Redis

Start a Redis server (required for job queue):

```bash
redis-server
```

Or using Docker:

```bash
docker run -d -p 6379:6379 redis:latest
```

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React, TypeScript, Tailwind | Web UI |
| Backend | Node.js, Express, TypeScript | REST API |
| Database | PostgreSQL, Drizzle ORM | Data persistence |
| Cache/Jobs | Redis, Bull | Async job processing |
| Auth | JWT, Magic Links | Authentication |
| Payments | Stripe API | Payment processing |
| Email | Resend | Email delivery |
| Hosting | Vercel, Railway | Production deployment |

## Development

### Scripts

**Backend:**
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm run db:push` - Apply database migrations
- `npm run db:seed` - Seed default data

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run type-check` - Type checking

## Documentation

See `/backend/README.md` and `/frontend/README.md` for detailed setup and architecture docs.

For complete product spec, see `RETAINIQ.md` (includes design system, API spec, database schema, health scoring engine, etc.).

## MVP Build Order

The project follows a structured 6-week MVP build plan:

1. **Phase 1**: Backend Foundation (database, auth, middleware)
2. **Phase 2**: Frontend Foundation (Next.js, design system, components)
3. **Phase 3**: Stripe Integration (webhook, sync, connection flow)
4. **Phase 4**: Health Scoring & Customers (scoring engine, customer detail)
5. **Phase 5**: Dashboard & Alerts (metrics, alerts, real-time updates)
6. **Phase 6**: Campaigns & Polish (campaign builder, email, launch)

## License

MIT
