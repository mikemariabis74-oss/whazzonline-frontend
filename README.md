# Whazzonline — Frontend

Next.js frontend for the Whazzonline e-commerce platform. Communicates with the [whazzonline-backend](../whazzonline-backend) Express API.

Live URL: `[Add after Vercel deployment]`
Backend API: `[Add after Render deployment]`

---

## Architecture Overview

This project is intentionally separated from the backend into two independent deployable units:

```
whazzonline-frontend/   → Next.js 14 → Vercel
whazzonline-backend/    → Express + TypeScript → Render
```

The frontend has zero direct Supabase dependency — all data flows through the Express REST API using JWT bearer tokens. This separation gives us:

- Independent deployments and scaling
- A single source of business logic (the API layer)
- A clean contract boundary (the API) that any future mobile client can consume without changes

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO-friendly product pages, file-based routing, image optimisation built-in |
| Styling | Tailwind CSS | Consistent design system, responsive utilities, zero runtime CSS |
| State (cart) | Zustand + localStorage | Lightweight, no boilerplate, survives page refresh for guest users |
| State (auth) | Zustand + localStorage | Persists JWT token across sessions; clears on logout |
| API client | Native fetch (lib/api.ts) | Centralised, typed wrapper — no external HTTP library needed |
| Language | TypeScript | End-to-end type safety; types shared with API response shapes |
| Fonts | Plus Jakarta Sans + Syne | Clean, modern pairing appropriate for a commerce product |

---

## Features

- **Product listing** — grid view with search, category filter, and sort (fetched server-side via SSR)
- **Product detail** — full product view with quantity selector and add-to-cart
- **Cart drawer** — slide-over with add/remove/quantity controls, live total
- **Cart page** — full-page cart with order summary
- **Checkout** — multi-step (delivery details → simulated payment → order confirmation)
- **Authentication** — signup, login, logout via Express API; JWT stored in Zustand/localStorage
- **Responsive** — mobile, tablet, desktop via Tailwind breakpoints and CSS Grid/Flexbox
- **User feedback** — toast notifications for all key actions, loading skeletons, empty states

---

## Local Setup

### Prerequisites
- Node.js 18+
- The backend running at `http://localhost:5000` (see [whazzonline-backend](../whazzonline-backend))

### 1. Install
```bash
cd whazzonline-frontend
npm install
```

### 2. Environment variables
```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start dev server
```bash
npm run dev
# Frontend at http://localhost:3000
```

Start the backend in a separate terminal first:
```bash
cd ../whazzonline-backend && npm run dev
```

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

In Vercel dashboard → **Settings → Environment Variables**, add:
```
NEXT_PUBLIC_API_URL = https://your-render-backend-url.onrender.com
```

---

## Project Structure

```
whazzonline-frontend/
├── app/
│   ├── page.tsx                 # Product listing (SSR, fetches from API)
│   ├── products/[id]/page.tsx   # Product detail (client component)
│   ├── cart/page.tsx            # Cart page
│   ├── checkout/page.tsx        # Checkout with payment simulation
│   └── (auth)/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── Navbar.tsx               # Auth-aware, cart count badge
│   ├── ProductCard.tsx          # Add-to-cart, wishlist stub
│   ├── CartDrawer.tsx           # Slide-over cart
│   └── SearchFilter.tsx         # Search input + category pills + sort
├── lib/
│   ├── api.ts                   # Centralised API client (all fetch calls)
│   ├── providers.tsx            # Client-side providers (Toast, CartDrawer)
│   ├── utils.ts                 # cn(), formatPrice()
│   └── store/
│       ├── auth.ts              # Zustand auth store (JWT + user)
│       └── cart.ts              # Zustand cart store (localStorage)
├── types/index.ts               # Shared TypeScript types
└── supabase/
    ├── schema.sql               # DB schema (run in Supabase SQL editor)
    └── seed.sql                 # 10 sample products
```

---

## API Integration

All API calls live in `lib/api.ts` — a single typed wrapper around `fetch`. Every function accepts a token parameter for authenticated routes.

```typescript
// Example: add item to cart
const data = await cartApi.add(access_token, {
  product_id: product.id,
  quantity: 1,
})
```

The API URL is set via `NEXT_PUBLIC_API_URL`, making environment switching (dev → prod) a one-variable change.

---

## Assumptions

- Prices are in Nigerian Naira (₦); `formatPrice` uses `Intl.NumberFormat` with `currency: 'NGN'`
- Cart is stored in localStorage for both guest and authenticated users. On login, the server-side cart (from `/api/cart`) could be merged — this is noted as a future improvement
- The checkout payment form is simulated — no real card processing. Paystack would be the production integration
- Product images use Unsplash URLs for seed data; in production these would be in Supabase Storage

---

## Known Limitations

- No cart merge on login (localStorage cart is not synced to server cart after authentication)
- No pagination (suitable for current product count; cursor-based pagination would be added beyond ~100 products)
- No product image upload UI
- No order history page (API supports it; UI page not built in scope)
- Checkout does not integrate a real payment gateway

---

## What I Would Improve With More Time

1. **Paystack integration** — Nigeria's dominant payment gateway; single hook covers 90% of the work
2. **Cart merge on auth** — merge guest cart with server cart on login
3. **Order history page** — `/account/orders` listing all past orders
4. **Image uploads** — Supabase Storage with client-side compression
5. **Pagination** — cursor-based pagination on product listing
6. **E2E tests** — Playwright covering add-to-cart → checkout flow
7. **Admin panel** — product CRUD at `/admin` protected by user role
