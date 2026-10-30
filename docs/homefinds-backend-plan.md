# HomeFinds backend plan (v1)

**Status:** planned  
**Scope:** turn the current static HomeFinds catalogue and Seller Hub into a safe, small marketplace for individual kitchenware and bedding sellers.

## 1. Current demo to preserve

The live demo already has:

- buyer catalogue, search, filters and cart
- buyer checkout details and WhatsApp handoff
- a clearly labelled simulated payment choice
- Seller Hub pages for listings, buyer activity and payment-status examples

The v1 backend adds real data, accounts and controlled order handling. It does **not** replace the visual HomeFinds demo until each part is ready.

## 2. Recommended stack

| Layer | Choice | Reason |
|---|---|---|
| Web app | React + Vite | Small, clear upgrade from the current static pages; good place to apply React fundamentals before Next.js. |
| Database, authentication and file storage | Supabase | Managed PostgreSQL, seller login, row-level security and product-image storage in one service. |
| Server-only actions | Supabase Edge Functions | Keeps secrets, payment callbacks and WhatsApp sending logic off the browser. |
| Hosting | Vercel or Netlify | Deploys the React app separately from the current GitHub Pages demo. |
| Payments | PayFast or Yoco | South African payment provider. Use hosted checkout, never collect card or banking details in HomeFinds. |
| Notifications | WhatsApp click-to-chat first, then approved WhatsApp Business API | Start with seller-controlled WhatsApp confirmation; automate only after the operational process is clear. |

GitHub Pages remains the public demo/portfolio site. The live application must be deployed separately because it needs secure server-side functions.

## 3. Roles and safety boundaries

| Role | Can do | Cannot do |
|---|---|---|
| Guest buyer | Browse listings, create an order, check order status using a secure order link | View seller private details or other buyers' orders |
| Buyer account (later) | Save profile, view own order history | Edit products or seller data |
| Seller | Manage only their own profile, listings, stock and orders | Read other sellers' buyers, orders or earnings |
| Admin | Approve sellers/listings, handle reports, manage categories | Handle card data or bypass payment-provider controls |

Non-negotiables:

- Never store card numbers, CVV, banking passwords or payment PINs.
- Payment success comes only from a provider-signed server webhook.
- Sellers cannot mark a card payment as paid themselves.
- Public listings expose a seller display name, not a personal address, identity number or private contact details.
- Buyer phone/address data is visible only to the assigned seller and admin after an order is created.
- Every table uses Supabase Row Level Security (RLS) before going live.

## 4. Core database design

### `profiles`

One row per authenticated person.

| Field | Notes |
|---|---|
| `id` | UUID, matches Supabase Auth user ID |
| `role` | `buyer`, `seller` or `admin` |
| `display_name` | Public seller name or buyer first name |
| `phone` | Private contact field |
| `created_at` | Audit timestamp |

### `seller_profiles`

| Field | Notes |
|---|---|
| `user_id` | Links to `profiles.id` |
| `shop_name` | Public shop identity |
| `bio` | Optional public description |
| `status` | `pending`, `approved`, `suspended` |
| `collection_area` | General area only, never a home address publicly |
| `payout_status` | `not_ready`, `verified`, `on_hold` |

### `categories`

Seeded by admin: `kitchenware`, `tableware`, `bedding`, `bath-linen`.

### `listings`

| Field | Notes |
|---|---|
| `id` | UUID |
| `seller_id` | Seller profile owner |
| `title`, `description` | Product information |
| `category_id` | Category reference |
| `price_cents` | Integer Rand cents, never floating-point money |
| `condition` | `new`, `like_new`, `good`, `used` |
| `stock_quantity` | Prevents accidental overselling |
| `status` | `draft`, `pending_review`, `live`, `paused`, `sold`, `rejected` |
| `created_at`, `updated_at` | Audit timestamps |

### `listing_images`

Stores image path, order and alt text. Images live in a private upload flow and are published only after listing approval.

### `orders`

| Field | Notes |
|---|---|
| `id` | UUID |
| `order_code` | Buyer-safe reference such as `HF-XXXXXX` |
| `seller_id` | One seller per v1 order |
| `buyer_name`, `buyer_phone` | Private order data |
| `fulfilment_method` | `collection` or `delivery` |
| `delivery_area`, `delivery_address` | Address only when delivery is selected |
| `status` | `pending_seller`, `accepted`, `ready`, `completed`, `cancelled`, `expired` |
| `subtotal_cents`, `delivery_fee_cents`, `total_cents` | Snapshot totals |
| `created_at` | Audit timestamp |

### `order_items`

Snapshot the listing title, unit price and quantity at checkout so historic orders do not change when sellers edit a listing.

### `payments`

| Field | Notes |
|---|---|
| `order_id` | Associated order |
| `provider` | `payfast`, `yoco` or `cash_collection` |
| `provider_reference` | Provider token/reference only |
| `status` | `not_started`, `pending`, `paid`, `failed`, `refunded`, `cash_due` |
| `amount_cents` | Amount expected/received |
| `verified_at` | Set only from server-side provider webhook |

### `order_events`

Append-only timeline: status changes, payment updates, seller acceptance and admin action. It creates a clear support trail.

## 5. Build order

### Phase 0: foundation

1. Create a dedicated Supabase project for HomeFinds.
2. Keep Supabase keys in environment variables, never in GitHub Pages or the repository.
3. Create the schema, database migrations, RLS policies and seed categories.
4. Set up separate local, staging and production environment values.
5. Create an admin account manually and test permissions with seller and buyer test accounts.

**Done when:** an unauthenticated visitor cannot read private order data, and a seller can only query their own records.

### Phase 1: seller onboarding and catalogue

1. Build React pages for seller sign-up, sign-in and password reset.
2. Add seller profile submission and admin approval.
3. Replace the Seller Hub's sample listing list with authenticated listing management.
4. Upload and resize images through Supabase Storage.
5. Replace catalogue sample cards with live listings where `status = live` and seller is approved.
6. Keep the current public demo route available as a portfolio example until the live route is stable.

**Done when:** an approved seller can add, edit, pause and publish only their own listing, and it appears correctly in public browsing.

### Phase 2: buyer checkout and orders

1. Keep cart in browser state until checkout.
2. Limit v1 checkout to **one seller per order**. If a cart contains more than one seller, split it into clear separate orders.
3. Create orders through a server-side function that rechecks listing status, price and stock.
4. Reserve stock for a short time during payment, then release it on failed/expired payment.
5. Give the buyer a private status page using a signed link or a buyer account.
6. Notify the seller that a new order needs action.

**Done when:** checkout cannot alter a price, order total or seller ID from the browser, and sellers only see their own orders.

### Phase 3: payment and fulfilment

1. Choose PayFast or Yoco after checking fees, settlement terms and business verification requirements.
2. Create a hosted payment session from an Edge Function.
3. Receive and verify the provider webhook signature before recording `paid`.
4. Support collection and seller-arranged delivery first. Delivery pricing is set by the seller or confirmed after enquiry.
5. Keep cash-on-collection clearly marked as `cash_due`, not paid.
6. Add seller acceptance, collection-ready, completed and cancellation status actions.

**Done when:** a fake browser request cannot set `paid`; only a verified provider webhook can.

### Phase 4: operations and trust

1. Admin queue for seller approval, listing review and user reports.
2. Seller and buyer terms, privacy notice, prohibited-items policy and returns/dispute flow.
3. Basic fraud controls: rate limits, CAPTCHA on signup/checkout, audit events and report/block controls.
4. Backups, error monitoring and incident process.
5. Analytics that measure listings, enquiries, paid orders and cancellations without exposing personal data.

**Done when:** the team can remove a risky listing, suspend a seller and investigate an order without accessing payment secrets.

## 6. First API/function endpoints

| Function | Who uses it | Key protection |
|---|---|---|
| `create-order` | Guest/buyer | Validates server prices, stock, seller status and input limits |
| `start-payment` | Buyer | Creates hosted-provider session; no card details in app |
| `payment-webhook` | Payment provider | Validates signature and updates payment/order atomically |
| `seller-order-action` | Seller | Verifies seller owns the order and allowed status transition |
| `upload-listing-image` | Approved seller | Validates file type/size and upload ownership |
| `admin-review-listing` | Admin | Requires admin role and writes audit event |

## 7. Launch checklist

- [ ] Schema migrations reviewed and applied to staging
- [ ] RLS tests pass for guest, buyer, seller and admin
- [ ] Image upload limits and allowed formats enabled
- [ ] Payment provider webhook signature is verified
- [ ] Secrets exist only in deployment environment settings
- [ ] Privacy policy and seller/buyer terms are published
- [ ] Support contact and dispute path are visible
- [ ] Production backup and error-alerting configured
- [ ] Small pilot with 3–5 approved sellers completed before public launch

## 8. Next technical task

Build **Phase 0** first: a Supabase migration folder containing the schema, roles and RLS policies, plus a small React login shell. Do not connect real payments until seller listings and orders work correctly in staging.
