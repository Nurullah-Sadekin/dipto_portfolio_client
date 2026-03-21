# Event Activation Portfolio

A premium corporate personal portfolio website for an event activation specialist with client servicing experience.

## Implemented Features

- Landing page with hero, core stats, featured event cards, social links, and inquiry section
- Strategic Planner top section with dark navigation and profile card
- Featured work section that shows six events on the homepage
- Separate all-events page for portfolio browsing
- Dynamic event detail pages using route slugs
- Event detail content includes location, client, attendee count, event experience, gallery images, and client feedback
- Password-protected admin panel at `/admin` for create/update/delete event management
- API routes for event CRUD at `/api/events` and `/api/events/[slug]`
- Responsive layout for desktop and mobile

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4 (base import)

## Project Structure

- app/page.tsx: landing page
- app/events/page.tsx: all-events listing page
- app/events/[slug]/page.tsx: dynamic event case study page
- lib/events.ts: portfolio event data source
- components/EventCard.tsx: reusable event card component

## Run the Project

```bash
npm run dev
```

The development server runs on localhost port 3000.

## Validation

```bash
npm run lint
npm run build
```

Both commands currently pass.

## Admin Panel

- Route: `/admin`
- Default password: `Admin@123`
- Recommended: set `ADMIN_PASSWORD` in environment variables before production deployment.

Example local env:

```bash
cp .env.example .env.local
```

## Deployment

- This project can be deployed to Vercel.
- Event data writes use local filesystem in development and `/tmp` in Vercel runtime.
- Note: `/tmp` storage is ephemeral; for persistent production admin updates, switch to a managed database.

## Placeholder Content Note

All event names, descriptions, metrics, and images are placeholders and should be replaced with real project content.
