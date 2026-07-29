# Freelance Marketplace - Requirements Specification

## 1. Project Goal
The **Freelance Marketplace** is a web platform connecting clients seeking professional digital services with skilled freelancers offering structured service listings (Gigs). The system acts as a trusted intermediary overseeing secure order execution, escrow payment protection, review aggregation, and platform moderation.

---

## 2. User Roles & Capabilities

### 2.1 Client Role (`CLIENT`)
- **Account Registration & Security**: Sign up, log in, manage profile info, avatar preview.
- **Service Discovery**: Search gigs by keywords, filter by category, view comprehensive gig details and seller reputation.
- **Order Placement**: Place orders with mandatory project instructions via the streamlined Order Checkout Modal.
- **Wallet & Funds**: Top up virtual coins (`POST /api/wallets/top-up`), view available/held balances and ledger history.
- **Order Lifecycle**: View active/completed orders, track order progress (`PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED`), or cancel pending orders.
- **Reviews**: Submit 1-5 star ratings and reviews upon order completion.

### 2.2 Freelancer Role (`FREELANCER`)
- **Profile Management**: View and edit professional bio, skills, and experience with live avatar preview. Read-only email and role.
- **Gig Management**: Create service gigs with title, category, description, price, delivery time, and thumbnail. Edit or soft-delete gigs.
- **Order Processing**: Receive client orders and advance status strictly through `PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED`.
- **Freelancer Wallet**: Read-only dedicated wallet page (`/freelancer/wallet`) displaying available earnings, held escrow funds, transaction search by ID, and type/status filter dropdowns.
- **Reviews**: View client reviews and aggregate ratings on a dedicated read-only Reviews page.

### 2.3 Administrator Role (`ADMIN`)
- **Admin Dashboard**: Overview statistics cards for total platform users, active gigs, total orders, and total platform revenue.
- **User Management**: View platform users, block/unblock accounts, or soft-delete users.
- **Category Management**: Add, update, or soft-delete service categories.
- **Gig Moderation**: Monitor and manage all published marketplace gigs.
- **Order Management**: Oversee all platform orders and force-cancel troubled orders if necessary.
- **Reviews Moderation**: Monitor and delete inappropriate reviews.

---

## 3. Core Business Rules

1. **Email & Username Uniqueness**: User emails and usernames must be unique during registration.
2. **Escrow Protection**:
   - Order placement locks agreed funds from Client's Available Balance into Held Balance (`ESCROW_HOLD`).
   - Order completion transfers funds to Freelancer's Available Balance (`RELEASE`).
   - Order cancellation returns funds to Client's Available Balance (`REFUND`).
3. **Strict Order Transition Sequence**:
   - `PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED`.
   - Cancellation allowed only from `PENDING` or `ACCEPTED` status.
4. **Read-Only Controls**:
   - Client and Freelancer emails and roles cannot be edited.
   - Freelancer Wallet is read-only (no manual balance editing or withdraw/deposit controls).
   - Reviews are read-only for freelancers.
