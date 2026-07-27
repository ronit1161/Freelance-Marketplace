# Database Design
## Freelance Marketplace

**Version:** 1.0  
**Database:** MySQL  
**Backend:** Java Spring Boot + Spring Data JPA + Hibernate

---

# Overview

This document describes the complete database design for the **Freelance Marketplace** project.

The project is intentionally designed as a **simple college-level application**. The database follows normalization principles while avoiding unnecessary complexity.

The design focuses on:

- Authentication
- Gig Management
- Orders
- Wallet & Escrow
- Reviews
- Admin Operations

---

# Database Design Principles

- Use UUID as Primary Key for every entity.
- Every table extends a common `BaseEntity`.
- Use proper Foreign Key constraints.
- Use JPA relationships.
- Store passwords in encrypted form.
- Keep schema simple but scalable.
- Design should support future migration to Microservices.

---

# Entity List

1. User
2. Wallet
3. Category
4. Gig
5. Order
6. Transaction
7. Review

---

# Entity Details

---

# 1. User

## Purpose

Stores information about every user in the application.

A user can be:

- CLIENT
- FREELANCER
- ADMIN

---

## Attributes

| Field | Type | Required | Unique |
|--------|------|----------|--------|
| user_id | UUID | Yes | Yes |
| full_name | String | Yes | No |
| email | String | Yes | Yes |
| password | String | Yes | No |
| role | Enum | Yes | No |
| bio | Text | No | No |
| skills | String | No | No |
| experience | Integer | No | No |
| profile_image_url | String | No | No |
| is_active | Boolean | Yes | No |
| is_blocked | Boolean | Yes | No |
| created_on | Timestamp | Yes | No |
| last_updated | Timestamp | Yes | No |

---

## Relationships

- One User has One Wallet
- One Freelancer has Many Gigs
- One Client places Many Orders
- One Freelancer receives Many Orders
- One Client writes Many Reviews

---

## Constraints

- Email must be unique.
- Password must be encrypted.
- Role cannot be null.

---

# 2. Wallet

## Purpose

Stores virtual wallet information.

Supports Escrow implementation.

---

## Attributes

| Field | Type |
|--------|------|
| wallet_id | UUID |
| available_balance | Decimal |
| held_balance | Decimal |
| total_balance | Decimal |

---

## Relationships

- One Wallet belongs to One User.
- One Wallet contains Many Transactions.

---

## Business Rules

- Every new user receives demo coins.
- Total Balance = Available Balance + Held Balance.
- Wallet balance cannot become negative.

---

# 3. Category

## Purpose

Organizes gigs.

---

## Attributes

| Field | Type |
|--------|------|
| category_id | UUID |
| category_name | String |
| description | String |

---

## Relationships

- One Category has Many Gigs.

---

## Business Rules

- No Subcategories.
- Category name must be unique.

---

# 4. Gig

## Purpose

Represents services offered by freelancers.

---

## Attributes

| Field | Type |
|--------|------|
| gig_id | UUID |
| title | String |
| description | Text |
| price | Decimal |
| delivery_days | Integer |
| thumbnail_url | String |
| total_orders | Integer |
| is_deleted | Boolean |

---

## Relationships

- Many Gigs belong to One Freelancer.
- Many Gigs belong to One Category.
- One Gig has Many Orders.

---

## Business Rules

- Only one thumbnail image.
- Only one price.
- Freelancer can edit gig.
- Freelancer can delete gig.

---

# 5. Order

## Purpose

Represents a purchase between Client and Freelancer.

---

## Attributes

| Field | Type |
|--------|------|
| order_id | UUID |
| requirements | Text |
| agreed_price | Decimal |
| status | Enum |
| completed_date | Timestamp |

---

## Relationships

- Many Orders belong to One Client.
- Many Orders belong to One Freelancer.
- Many Orders belong to One Gig.
- One Order has One Review.
- One Order has Many Transactions.

---

## Order Status

- PENDING
- ACCEPTED
- IN_PROGRESS
- COMPLETED
- CANCELLED

---

## Business Rules

- Client can place multiple orders.
- Freelancer cannot reject an order.
- Client can cancel only before work starts.
- No revisions.
- One order can have only one review.

---

# 6. Transaction

## Purpose

Maintains wallet transaction history.

---

## Attributes

| Field | Type |
|--------|------|
| transaction_id | UUID |
| amount | Decimal |
| transaction_type | Enum |
| transaction_status | Enum |
| description | String |
| reference | String |

---

## Relationships

- Many Transactions belong to One Wallet.
- Many Transactions may belong to One Order.

---

## Transaction Types

- INITIAL_BALANCE
- HOLD
- RELEASE
- REFUND

---

## Transaction Status

- PENDING
- SUCCESS
- FAILED

---

## Business Rules

Every financial activity generates one transaction.

Examples:

- Initial Wallet Balance
- Hold Coins
- Release Coins
- Refund Coins

---

# 7. Review

## Purpose

Stores client feedback after order completion.

---

## Attributes

| Field | Type |
|--------|------|
| review_id | UUID |
| rating | Integer |
| comment | Text |

---

## Relationships

- One Review belongs to One Order.
- Many Reviews belong to One Client.
- Many Reviews belong to One Freelancer.

---

## Business Rules

- Only Client can review.
- Rating between 1–5.
- One Review per Order.
- Review cannot be edited.
- Review cannot be deleted.

---

# Relationship Summary

## User

```
User
│
├── 1 : 1 Wallet
├── 1 : N Gig
├── 1 : N Order (Client)
├── 1 : N Order (Freelancer)
└── 1 : N Review
```

---

## Category

```
Category
│
└── 1 : N Gig
```

---

## Gig

```
Gig
│
└── 1 : N Order
```

---

## Order

```
Order
│
├── 1 : 1 Review
└── 1 : N Transaction
```

---

## Wallet

```
Wallet
│
└── 1 : N Transaction
```

---

# Entity Relationship Diagram (Conceptual)

```
                      +-------------+
                      |  Category   |
                      +-------------+
                             |
                           1 | 
                             | N
                      +-------------+
                      |     Gig     |
                      +-------------+
                             |
                   +---------+---------+
                   |                   |
                   | N               1 |
                   |                   |
            +-------------+     +-------------+
            | Freelancer  |     |    Order    |
            |    User     |     +-------------+
            +-------------+            |
                   ^                   |
                   |                   |
                   |                   |
            +-------------+            |
            |   Client    |------------+
            |    User     |
            +-------------+
                   |
                   |
              1    |    1
                   |
             +-------------+
             |   Wallet    |
             +-------------+
                   |
                1  |
                   | N
             +-------------+
             | Transaction |
             +-------------+

Order
  |
1 |
  | 1
Review
```

---

# Index Recommendations

Create indexes on:

- email
- role
- category_name
- title
- price
- order_status
- transaction_type

---

# Future Scope

The current schema is designed for a monolithic application.

In the future it can be separated into microservices:

- Authentication Service
- Gig Service
- Order Service
- Wallet Service
- Review Service

without major database redesign.

---

# Notes

- Passwords must always be stored in encrypted form.
- UUIDs should be generated by Hibernate.
- All relationships should use JPA annotations.
- Use Lazy Fetch wherever appropriate.
- Use DTOs for API communication instead of exposing entities directly.
- Use Global Exception Handling and Validation for all database operations.