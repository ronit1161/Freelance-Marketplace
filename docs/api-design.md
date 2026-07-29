# Freelance Marketplace - API Design Specification

**Base URL**: `/api`  
**Authentication Header**: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/auth/register` | Register a new user (`CLIENT` or `FREELANCER`) | No | Public |
| `POST` | `/api/auth/login` | Authenticate user and return JWT token + user details | No | Public |

---

## 2. User & Profile Management (`/api/users`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/users` | Retrieve all platform users | Yes | `ADMIN` |
| `GET` | `/api/users/{id}` | Get user by ID | Yes | `CLIENT`, `FREELANCER`, `ADMIN` |
| `GET` | `/api/users/profile/{userId}` | Fetch detailed user profile information | Yes | `CLIENT`, `FREELANCER`, `ADMIN` |
| `PUT` | `/api/users/{id}` | Update user details (name, bio, skills, experience, profile image) | Yes | Account Owner |
| `PUT` | `/api/users/{id}/block` | Block user account | Yes | `ADMIN` |
| `PUT` | `/api/users/{id}/unblock` | Unblock user account | Yes | `ADMIN` |
| `PATCH` | `/api/users/{id}/status` | Soft-delete or toggle active status of user | Yes | `ADMIN` |

---

## 3. Categories (`/api/categories`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/categories` | List all active categories | No | Public |
| `GET` | `/api/categories/{id}` | Get category by ID | No | Public |
| `POST` | `/api/categories` | Create a new service category | Yes | `ADMIN` |
| `PUT` | `/api/categories/{id}` | Update an existing category | Yes | `ADMIN` |
| `DELETE` | `/api/categories/{id}` | Soft-delete a category | Yes | `ADMIN` |

---

## 4. Gigs & Services (`/api/gigs`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/gigs` | List all active marketplace gigs | No | Public |
| `GET` | `/api/gigs/{id}` | Get detailed gig information | No | Public |
| `GET` | `/api/gigs/freelancer/{freelancerId}` | Get all gigs created by a specific freelancer | Yes | `FREELANCER`, `ADMIN` |
| `GET` | `/api/gigs/category/{categoryId}` | Filter gigs by category | No | Public |
| `GET` | `/api/gigs/search` | Search gigs by keyword, title, or category | No | Public |
| `POST` | `/api/gigs` | Create a new service gig listing | Yes | `FREELANCER` |
| `PUT` | `/api/gigs/{id}` | Update gig details (title, description, price, delivery time, image) | Yes | Gig Owner / `ADMIN` |
| `DELETE` | `/api/gigs/{id}` | Soft-delete a gig listing | Yes | Gig Owner / `ADMIN` |

---

## 5. Orders & Escrow Lifecycle (`/api/orders`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/orders` | Place a new order (creates escrow hold) | Yes | `CLIENT` |
| `GET` | `/api/orders` | Get all platform orders | Yes | `ADMIN` |
| `GET` | `/api/orders/{id}` | Get order details by ID | Yes | Order Participants / `ADMIN` |
| `GET` | `/api/orders/client/{clientId}` | Get orders placed by client | Yes | Client / `ADMIN` |
| `GET` | `/api/orders/freelancer/{freelancerId}` | Get orders received by freelancer | Yes | Freelancer / `ADMIN` |
| `PUT` | `/api/orders/{id}/accept` | Accept a pending order (`PENDING` → `ACCEPTED`) | Yes | Freelancer |
| `PUT` | `/api/orders/{id}/start` | Start order work (`ACCEPTED` → `IN_PROGRESS`) | Yes | Freelancer |
| `PUT` | `/api/orders/{id}/complete` | Complete order & release escrow funds (`IN_PROGRESS` → `COMPLETED`) | Yes | Freelancer / Client |
| `PUT` | `/api/orders/{id}/cancel` | Cancel order & refund escrow balance (`PENDING`/`ACCEPTED` → `CANCELLED`) | Yes | Order Participants / `ADMIN` |

---

## 6. Digital Wallet (`/api/wallets`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/wallets/user/{userId}` | Get wallet balance details (Available, Held, Total) | Yes | Account Owner / `ADMIN` |
| `POST` | `/api/wallets/top-up` | Add virtual funds/coins to client wallet | Yes | `CLIENT` |

---

## 7. Transactions Ledger (`/api/transactions`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/transactions` | List all system transactions | Yes | `ADMIN`, Logged-in User |
| `GET` | `/api/transactions/wallet/{walletId}` | Get transaction history by wallet ID | Yes | Account Owner / `ADMIN` |
| `GET` | `/api/transactions/user/{userId}` | Get transaction history by user ID | Yes | Account Owner / `ADMIN` |

---

## 8. Reviews & Ratings (`/api/reviews`)

| Method | Endpoint | Description | Auth Required | Roles Allowed |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/reviews` | Submit a review for a completed order | Yes | `CLIENT` |
| `GET` | `/api/reviews/freelancer/{freelancerId}` | Fetch all reviews received by a freelancer | No | Public |
| `GET` | `/api/reviews/gig/{gigId}` | Fetch all reviews for a specific gig | No | Public |
| `GET` | `/api/reviews/client/{clientId}` | Fetch all reviews submitted by a client | Yes | Client / `ADMIN` |
| `DELETE` | `/api/reviews/{id}` | Moderate/delete an inappropriate review | Yes | `ADMIN` |