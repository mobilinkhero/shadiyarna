# Shadiyarana Web

Wedding planning platform — admin panel, user-facing website, and REST API for the Flutter mobile app.

## Stack

- **Next.js 16** (App Router)
- **Prisma 5** + SQLite (dev) / PostgreSQL (prod)
- **Tailwind CSS v4**
- **JWT** authentication
- **NextAuth v4**

## Project Structure

```
app/
├── page.tsx              # Homepage
├── vendors/              # Vendor listing & detail pages
├── categories/           # Category browser
├── about/                # About page
├── admin/                # Admin panel (protected)
│   ├── login/            # Admin login
│   ├── vendors/          # Vendor management
│   ├── users/            # User management
│   ├── bookings/         # Booking management
│   ├── categories/       # Category management
│   ├── reviews/          # Review management
│   └── analytics/        # Platform analytics
└── api/
    ├── auth/             # Login, register, OTP
    ├── vendors/          # Vendor CRUD
    ├── categories/       # Category endpoints
    ├── bookings/         # Booking endpoints
    ├── reviews/          # Review endpoints
    ├── wishlist/         # Wishlist toggle
    ├── notifications/    # Notifications
    ├── profile/          # User profile
    └── flutter/          # Flutter app endpoints
        └── vendors/      # Vendor list + detail for app
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Push database schema
npm run prisma:push

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Flutter API Base URL

```
http://localhost:3000/api/flutter
```

Key endpoints:
- `GET  /api/flutter/vendors` — vendor list with filters
- `GET  /api/flutter/vendors/[id]` — vendor detail
- `POST /api/auth/otp/send` — send OTP
- `POST /api/auth/otp/verify` — verify OTP + get JWT
- `GET  /api/categories` — category list
- `GET  /api/bookings` — user bookings (auth required)
- `POST /api/bookings` — create booking (auth required)

## Environment Variables

See `.env.example` for all required variables.

## Database

```bash
npm run prisma:push    # Apply schema to DB
npm run prisma:studio  # Open Prisma Studio GUI
```
