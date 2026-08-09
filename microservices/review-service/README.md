# Review Service (`review-service`) — Freelance Marketplace

## 1. Overview & Responsibilities
The **Review Service** manages ratings, feedback, and reviews for completed freelance contracts. It runs on port `8086` with an isolated database `freelance_review_db`.

```
                  React Frontend (localhost:5173)
                                │
                                │ HTTP / JSON / JWT
                                ▼
                       API Gateway (:8080)
                                │
                                │ lb://REVIEW-SERVICE
                                ▼
                      Review Service (:8086)
                                │
                                ├── OpenFeign (GET /orders/{id}) ──▶ Order Service (:8084)
                                │
                                ▼
                     [(freelance_review_db)]
```

### Core Responsibilities:
1. **Order Review Submission**: Verified clients can submit ratings (1–5) and comments for their `COMPLETED` orders.
2. **Order Verification via OpenFeign**: Checks Order Service to verify the contract is `COMPLETED` and belongs to the authenticated client.
3. **One Review per Order**: Enforces uniqueness on `orderId` to prevent duplicate review submissions.
4. **Public Review Discovery**: Allows public browsing of reviews by `gigId`, `freelancerId`, or `clientId`.
5. **Review Moderation**: Allows the review creator or an admin to delete a review.

---

## 2. Database Schema (`freelance_review_db`)

```sql
CREATE DATABASE IF NOT EXISTS freelance_review_db;
USE freelance_review_db;

CREATE TABLE reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,      -- Logical reference to Order ID (1 review per order)
    client_id BIGINT NOT NULL,            -- Logical reference to Auth User ID
    freelancer_id BIGINT NOT NULL,        -- Logical reference to Auth User ID
    gig_id BIGINT NOT NULL,               -- Logical reference to Gig ID
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_reviews_order_id (order_id),
    INDEX idx_reviews_client_id (client_id),
    INDEX idx_reviews_freelancer_id (freelancer_id),
    INDEX idx_reviews_gig_id (gig_id)
);
```

> [!IMPORTANT]
> **Zero Cross-Service Foreign Keys**: `order_id`, `client_id`, `freelancer_id`, and `gig_id` are scalar `BIGINT` references without cross-database constraints.

---

## 3. API Endpoints

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/reviews` | `ROLE_CLIENT` | Submit a review for a completed order. |
| `GET` | `/reviews/{id}` | Public | Get single review details by ID. |
| `GET` | `/reviews/gig/{gigId}` | Public | List all reviews for a specific gig. |
| `GET` | `/reviews/freelancer/{freelancerId}` | Public | List all reviews received by a freelancer. |
| `GET` | `/reviews/client/{clientId}` | Public | List all reviews submitted by a client. |
| `DELETE` | `/reviews/{id}` | Owner / `ROLE_ADMIN` | Delete a review. |

---

## 4. Example Requests Through Gateway (Port 8080)

### 1. Submit a Review (Client Only)
```http
POST http://localhost:8080/reviews
Authorization: Bearer <CLIENT_JWT>
Content-Type: application/json

{
  "orderId": 1,
  "rating": 5,
  "comment": "Outstanding delivery! High quality Spring Boot code delivered ahead of schedule."
}
```

### 2. View Reviews for a Gig (Public)
```http
GET http://localhost:8080/reviews/gig/10
```

### 3. View Reviews for a Freelancer (Public)
```http
GET http://localhost:8080/reviews/freelancer/200
```

---

## 5. How to Run Locally

```bash
# 1. Start Eureka Server (Port 8761)
cd microservices/discovery-server
mvn spring-boot:run

# 2. Start Review Service (Port 8086)
cd microservices/review-service
mvn spring-boot:run
```
