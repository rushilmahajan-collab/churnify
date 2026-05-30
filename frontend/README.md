# RetainIQ Frontend

Next.js 14 + React + TypeScript frontend for RetainIQ, a retention intelligence dashboard for subscription businesses.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Make sure `NEXT_PUBLIC_API_URL` points to your backend server (default: `http://localhost:3001`).

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Design System

The UI follows the Claude Artifact aesthetic with a dark-first, minimal design system:

- **Colors**: See `src/app/globals.css` for CSS variable definitions
- **Typography**: Geist font family (body) and Geist Mono (data)
- **Components**: Using shadcn/ui primitives with custom theming
- **Charts**: Recharts with custom theme configuration
- **Animations**: Framer Motion for micro-interactions

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components (layout, pages, shared, ui)
- `src/lib/` - Utilities, API client, formatters
- `src/stores/` - Zustand state management
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions

## Key Features

- Magic link authentication
- Stripe integration
- Real-time health score dashboard
- Customer list with filtering and search
- Alert management
- Campaign builder
- Email template management
- Settings and configuration

## API Integration

API calls use the `api()` helper from `src/lib/api.ts`. All endpoints require authentication via JWT token stored in localStorage.

```typescript
import { api } from '@/lib/api';

const customers = await api<Customer[]>('/api/customers?status=critical');
```
