# Freelance Marketplace - Master Project Information

## 1. Project Overview

The **Freelance Marketplace** is a full-stack web application designed for buying and selling digital freelance services. Freelancers create service listings called **Gigs**, and Clients browse, purchase, and manage project deliverables through an **Escrow-protected virtual wallet system**.

Platform administrators oversee user accounts, categories, gigs, orders, transactions, and user reviews to maintain platform quality and security.

---

## 2. Platform User Roles

### Client (`CLIENT`)
- **Capabilities**: Register, log in, browse marketplace gigs, filter by categories, search services, place orders via simplified checkout, add funds to wallet, track order progress, and review completed orders.

### Freelancer (`FREELANCER`)
- **Capabilities**: Register, log in, create and manage service gigs, view incoming client orders, accept and advance order states (`PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED`), earn wallet credits upon delivery, view read-only wallet ledger, and view received reviews.

### Administrator (`ADMIN`)
- **Capabilities**: Platform dashboard analytics, user account blocking/unblocking/status control, category CRUD management, gig moderation, order status controls, and review moderation.

---

## 3. Technology Stack Summary

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router v6, Lucide React Icons.
- **Backend**: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate ORM, JWT Authentication.
- **Database**: MySQL 8.0.
- **DevOps**: Docker, Docker Compose (`docker-compose.yml`).

---

## 4. Key Platform Features

1. **Escrow Virtual Wallet**:
   - Order placement holds funds in Escrow (`ESCROW_HOLD`).
   - Order completion releases funds to the freelancer (`RELEASE`).
   - Order cancellation refunds funds to the client (`REFUND`).
   - Client top-up modal with amount presets (`+₹500`, `+₹1000`, `+₹5000`, `+₹10000`).
   - Read-only freelancer wallet with ID search and type/status filters.

2. **Strict Order Pipeline**:
   - Sequence: `PENDING` → `ACCEPTED` → `IN_PROGRESS` → `COMPLETED`.

3. **Ratings & Reviews**:
   - 1 to 5-star rating system with client feedback comments for completed orders.
