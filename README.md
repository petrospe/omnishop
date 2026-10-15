# OmniShop

B2C shop built with Laravel, Inertia.js, and React. The catalog and homepage are edited in `/admin`. Checkout is Stripe-hosted. A paid order is queued and sent to SoftOne or Epsilon Net so the Greek fiscal document (AADE / myDATA) can be issued.

## Requirements

- PHP 8.3 or later
- Composer
- Node.js and npm
- A Stripe account for payments
- A queue worker (started automatically by `composer run dev`)

SQLite is the default database.

## Install

From the project directory:

```bash
touch database/database.sqlite
composer run setup
```

That installs PHP and JavaScript dependencies, copies `.env.example` to `.env` when `.env` is missing, generates `APP_KEY`, migrates, seeds the shop editor and demo catalog, and builds the frontend.

Set the public URL and the shop name in `.env` before the first request if they differ from the defaults:

```env
APP_NAME=OmniShop
APP_URL=http://localhost:8000
```

## Run locally

```bash
composer run dev
```

This starts the PHP server, the Vite dev server, the queue listener, and the log tail. Open [http://localhost:8000](http://localhost:8000).

Stop the process with `Ctrl+C`. The queue must stay running in production as well (`php artisan queue:listen`), because paid orders are sent to the ERP in the background.

## Accounts created by the seed

| Email | Password | Where it goes |
| --- | --- | --- |
| `admin@omnishop.test` | `password` | `/admin` |
| `test@example.com` | `password` | Customer account at `/dashboard` |

Change both passwords before any shared or public deployment. Registration at `/register` creates a normal customer. It cannot create an administrator. An administrator is a user with `is_admin` set in the database.

## Shop

| URL | Purpose |
| --- | --- |
| `/` | Homepage |
| `/shop/{slug}` | Collection, for example `/shop/woman` |
| `/product/{slug}` | Product |
| `/cart` | Shopping bag and Checkout |
| `/wishlist` | Saved products |
| `/checkout/success` | Return page after a paid Stripe session |
| `/checkout/cancel` | Return page when the customer leaves Stripe |
| `/login`, `/register`, `/profile` | Customer account |

The bag and the wishlist live in the browser (`localStorage`). Products, collections, and homepage copy live in the database.

Shelf prices are VAT-inclusive. Checkout charges that amount in USD. The VAT split used for the fiscal document comes from `ERP_DEFAULT_VAT_RATE` (24 by default).

## Admin

Sign in as `admin@omnishop.test`, then open [http://localhost:8000/admin](http://localhost:8000/admin). A signed-in administrator also sees **Edit shop** in the storefront header. Anyone else who opens `/admin` receives 403.

| Section | What it edits |
| --- | --- |
| Overview | Counts, and the demo-catalog buttons |
| Products | Name, price, collection, sizes, image, publish state |
| Collections | Woman, Man, Studio, and any collection you add |
| Homepage | Announcement bar, hero text, hero image, featured collection |

**Insert demo data** adds only the demo collections and products whose slugs are not already stored. It does not overwrite products you have edited. The button is disabled when every demo record is already present.

**Remove demo data** deletes rows marked as demo. Products and collections you created stay. A demo collection that still has one of your products is kept.

A collection that still has products cannot be deleted.

## Stripe

Add the keys to `.env`:

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

`STRIPE_SECRET` is what opens Checkout. `STRIPE_KEY` is the publishable key (`pk_test_…` or `pk_live_…`). Hosted Checkout does not read it. `STRIPE_WEBHOOK_SECRET` is the signing secret of the webhook endpoint, not the API secret.

Checkout flow:

1. The customer adds a product to the bag and clicks **Checkout** on `/cart`.
2. OmniShop stores a pending order and redirects to Stripe.
3. Stripe collects email, shipping, and payment.
4. Stripe sends `checkout.session.completed` to `POST /stripe/webhook`.
5. The webhook marks the order paid and queues `SyncOrderToErpJob`.
6. The customer returns to `/checkout/success`, which also confirms the session so a local payment is recorded even before the webhook arrives.

In the Stripe Dashboard, add the endpoint `https://your-domain/stripe/webhook` and subscribe to `checkout.session.completed` and `payment_intent.succeeded`. The route is excluded from CSRF protection because Stripe does not send a Laravel token.

Local forwarding:

```bash
stripe listen --forward-to localhost:8000/stripe/webhook
```

Copy the `whsec_…` value into `STRIPE_WEBHOOK_SECRET`. A test card is `4242 4242 4242 4242`, any future expiry, and any CVC.

## ERP and electronic invoicing

After payment, the queue job posts a retail receipt (myDATA type `11.1`, card payment type `7`) to the URL in `ERP_API_URL`. The order number is sent as the idempotency key. Connection errors and HTTP 429 or 5xx are retried up to five times. A 4xx rejection is logged on the order and is not retried.

```env
ERP_PROVIDER=softone
ERP_API_URL=
ERP_API_TOKEN=
ERP_API_USERNAME=
ERP_API_PASSWORD=
ERP_COMPANY=
ERP_ISSUER_VAT=
ERP_INVOICE_SERIES=A
ERP_TIMEOUT=20
ERP_DEFAULT_VAT_RATE=24
```

`ERP_PROVIDER` is `softone` or `epsilonnet`. `ERP_API_URL` is the full endpoint for that installation. `ERP_ISSUER_VAT` is the seller VAT number used by the Epsilon Net payload. `ERP_COMPANY` is the SoftOne application id. A missing URL is a configuration error: the order is marked `sync_failed` and the job is not retried. Set the URL before taking payments, or dispatch `SyncOrderToErpJob` again for that order after the URL is in place.

The reference returned by the ERP (`mark`, `id`, or `reference`) is stored on the order.

## Tests

```bash
composer test
```

## Production notes

- Set `APP_ENV=production`, `APP_DEBUG=false`, and the real `APP_URL`.
- Use live Stripe keys and the live webhook signing secret.
- Run a persistent queue worker. `QUEUE_CONNECTION` is `database`.
- Serve the built assets with `npm run build` instead of the Vite dev server.
- Change the seeded passwords.
