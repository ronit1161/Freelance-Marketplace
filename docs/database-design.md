# Database Design Specification

**Database Engine**: MySQL 8.0  
**ORM Framework**: Spring Data JPA + Hibernate  

---

## 1. Overview

This document details the relational database design for the **Freelance Marketplace** project. The schema enforces normalization, data integrity, foreign key constraints, and performance index optimizations across all domain entities.

---

## 2. Entity Summaries

1. **`User`**: Stores system accounts (`CLIENT`, `FREELANCER`, `ADMIN`) and profile data.
2. **`Category`**: Organizes service listings into distinct categories.
3. **`Gig`**: Represents freelance service listings with pricing, delivery timeline, and thumbnails.
4. **`Order`**: Tracks service orders between clients and freelancers with lifecycle states.
5. **`Wallet`**: Manages digital balances (`availableBalance`, `heldBalance`, `totalBalance`).
6. **`WalletTransaction`**: Maintains immutable transaction history ledger entries.
7. **`Review`**: Stores ratings (1-5 stars) and feedback comments for completed orders.

---

## 3. Entity Details & Schema Definitions

### 3.1 `users` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique User ID |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Full Name |
| `email` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | User Email |
| `password` | `VARCHAR(255)` | `NOT NULL` | Encrypted Password (BCrypt) |
| `role` | `VARCHAR(20)` | `NOT NULL` | `CLIENT`, `FREELANCER`, or `ADMIN` |
| `bio_data` | `TEXT` | `NULLABLE` | Professional Biography |
| `skills` | `VARCHAR(255)` | `NULLABLE` | Comma-separated Skills |
| `experience` | `INT` | `NULLABLE` | Years of Experience |
| `profile_image_url` | `VARCHAR(500)` | `NULLABLE` | Profile Avatar URL |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active Status Flag |
| `is_blocked` | `BOOLEAN` | `DEFAULT FALSE` | Account Blocked Flag |
| `created_on` | `DATETIME` | `NOT NULL` | Registration Timestamp |
| `last_updated` | `DATETIME` | `NULLABLE` | Profile Update Timestamp |

---

### 3.2 `categories` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Category ID |
| `category_name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Category Name |
| `description` | `TEXT` | `NULLABLE` | Category Description |
| `is_deleted` | `BOOLEAN` | `DEFAULT FALSE` | Soft-delete Flag |

---

### 3.3 `gigs` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Gig ID |
| `title` | `VARCHAR(255)` | `NOT NULL` | Service Title |
| `description` | `TEXT` | `NOT NULL` | Service Description |
| `price` | `DECIMAL(10,2)` | `NOT NULL` | Service Base Price (₹) |
| `delivery_days` | `INT` | `NOT NULL` | Delivery Timeframe in Days |
| `thumbnail_url` | `VARCHAR(500)` | `NULLABLE` | Showcase Image URL |
| `freelancer_id` | `BIGINT` | `FOREIGN KEY (users.id)` | Freelancer Owner ID |
| `category_id` | `BIGINT` | `FOREIGN KEY (categories.id)` | Associated Category ID |
| `is_deleted` | `BOOLEAN` | `DEFAULT FALSE` | Soft-delete Flag |
| `created_on` | `DATETIME` | `NOT NULL` | Listing Creation Timestamp |

---

### 3.4 `orders` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Order ID |
| `client_id` | `BIGINT` | `FOREIGN KEY (users.id)` | Purchasing Client ID |
| `freelancer_id` | `BIGINT` | `FOREIGN KEY (users.id)` | Assigned Freelancer ID |
| `gig_id` | `BIGINT` | `FOREIGN KEY (gigs.id)` | Purchased Gig ID |
| `requirements` | `TEXT` | `NOT NULL` | Mandatory Project Instructions |
| `agreed_price` | `DECIMAL(10,2)` | `NOT NULL` | Agreed Purchase Price (₹) |
| `status` | `VARCHAR(30)` | `NOT NULL` | `PENDING`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `created_on` | `DATETIME` | `NOT NULL` | Order Placement Timestamp |
| `completed_date` | `DATETIME` | `NULLABLE` | Completion Timestamp |

---

### 3.5 `wallets` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Wallet ID |
| `user_id` | `BIGINT` | `FOREIGN KEY (users.id)`, `UNIQUE` | Account Owner User ID |
| `available_balance` | `DECIMAL(10,2)` | `DEFAULT 0.00` | Liquid Funds Available |
| `held_balance` | `DECIMAL(10,2)` | `DEFAULT 0.00` | Funds Locked in Escrow |
| `total_balance` | `DECIMAL(10,2)` | `DEFAULT 0.00` | Sum of Available + Held |

---

### 3.6 `wallet_transactions` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Transaction ID |
| `wallet_id` | `BIGINT` | `FOREIGN KEY (wallets.id)` | Associated Wallet ID |
| `order_id` | `BIGINT` | `FOREIGN KEY (orders.id)` | Associated Order ID (Optional) |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` | Monetary Amount (₹) |
| `transaction_type` | `VARCHAR(30)` | `NOT NULL` | `DEPOSIT`, `ESCROW_HOLD`, `RELEASE`, `REFUND` |
| `transaction_status` | `VARCHAR(20)` | `NOT NULL` | `COMPLETED`, `PENDING`, `FAILED` |
| `description` | `VARCHAR(255)` | `NOT NULL` | Ledger Description Note |
| `created_on` | `DATETIME` | `NOT NULL` | Transaction Timestamp |

---

### 3.7 `reviews` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Review ID |
| `order_id` | `BIGINT` | `FOREIGN KEY (orders.id)`, `UNIQUE` | Reviewed Order ID |
| `client_id` | `BIGINT` | `FOREIGN KEY (users.id)` | Author Client ID |
| `freelancer_id` | `BIGINT` | `FOREIGN KEY (users.id)` | Target Freelancer ID |
| `gig_id` | `BIGINT` | `FOREIGN KEY (gigs.id)` | Target Gig ID |
| `rating` | `INT` | `CHECK (rating BETWEEN 1 AND 5)` | Rating Stars (1 to 5) |
| `comment` | `TEXT` | `NOT NULL` | Feedback Text |
| `created_on` | `DATETIME` | `NOT NULL` | Submission Timestamp |

---

## 4. Entity Relationship Diagram (ERD)

```
       +------------------+                    +------------------+
       |    categories    |                    |      users       |
       +------------------+                    +------------------+
       | id (PK)          |                    | id (PK)          |
       | category_name    |                    | email            |
       +------------------+                    | role             |
                | 1                            +------------------+
                |                               /    |          \
                | N                            /     | 1         \ 1
       +------------------+                   /      v            v
       |       gigs       |                  /  +---------+   +----------+
       +------------------+                 /   | wallets |   |  reviews |
       | id (PK)          |                /    +---------+   +----------+
       | freelancer_id(FK)|<--------------+          | 1           | N
       | category_id (FK) |                          |             |
       +------------------+                          | N           v
                | 1                             +-----------------------+
                |                               |  wallet_transactions  |
                | N                             +-----------------------+
       +------------------+
       |      orders      |
       +------------------+
       | id (PK)          |
       | client_id (FK)   |
       | freelancer_id(FK)|
       | gig_id (FK)      |
       +------------------+
```