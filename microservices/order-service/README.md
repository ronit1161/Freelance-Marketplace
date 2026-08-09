# Order Service (`order-service`) — Freelance Marketplace

## 1. Overview & Responsibilities
The **Order Service** manages the complete contract and order lifecycle in our Freelance Marketplace microservices ecosystem. It runs on port `8084` with an isolated database `freelance_order_db`.

```
                  React Frontend (localhost:5173)
                                │
                                │ HTTP / JSON / JWT
                                ▼
                       API Gateway (:8080)
                                │
                                │ lb://ORDER-SERVICE
                                ▼
                      Order Service (:8084)
                                │
                                ├── OpenFeign (GET /gigs/{id}) ──▶ Gig Service (:8083)
                                │
                                ▼
                     [(freelance_order_db)]
```

### Core Responsibilities:
1. **Order Creation**: Client places an order on a selected active gig.
2. **Inter-Service Price & Freelancer Lookup**: Obtains current gig price and assigned freelancer dynamically via OpenFeign from `Gig Service`.
3. **Contract State Machine**: Manages strict state transitions (`PENDING` ➔ `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED` / `CANCELLED`).
4. **Role & Ownership Enforcement**: Guarantees clients can only place/view their own orders, and freelancers can only accept/start/complete orders assigned to them.

---

## 2. Order State Machine

```
              ┌───────────────┐
              │    PENDING    │◀── Order Placed (Client)
              └───────┬───────┘
                      │
            accept()  │  cancel() / reject()
            ┌─────────┴─────────┐
            ▼                   ▼
    ┌───────────────┐   ┌───────────────┐
    │   ACCEPTED    │   │   CANCELLED   │ (Terminal State)
    └───────┬───────┘   └───────────────┘
            │                   ▲
    start() │                   │ cancel()
            ▼                   │
    ┌───────────────┐           │
    │  IN_PROGRESS  │───────────┘
    └───────┬───────┘
            │
 complete() │
            ▼
    ┌───────────────┐
    │   COMPLETED   │ (Terminal State)
    └───────────────┘
```

---

## 3. Database Schema (`freelance_order_db`)

```sql
CREATE DATABASE IF NOT EXISTS freelance_order_db;
USE freelance_order_db;

CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,        -- Logical reference to Auth User ID
    freelancer_id BIGINT NOT NULL,    -- Logical reference to Auth User ID
    gig_id BIGINT NOT NULL,           -- Logical reference to Gig ID
    agreed_price DECIMAL(10, 2) NOT NULL,
    requirements TEXT,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_orders_client_id (client_id),
    INDEX idx_orders_freelancer_id (freelancer_id),
    INDEX idx_orders_gig_id (gig_id),
    INDEX idx_orders_status (status)
);
```

> [!IMPORTANT]
> **Zero Cross-Service Foreign Keys**: `client_id`, `freelancer_id`, and `gig_id` are logical references. Zero foreign key constraints link to `freelance_auth_db`, `freelance_user_db`, or `freelance_gig_db`.

---

## 4. API Endpoints

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | `ROLE_CLIENT` | Create a new order for a gig. Price and freelancer are resolved from Gig Service. |
| `GET` | `/orders/{id}` | Client / Freelancer / Admin | Get order details by ID (enforces ownership). |
| `GET` | `/orders/my` | Authenticated | List orders belonging to caller (`clientId` for clients, `freelancerId` for freelancers). |
| `PATCH` | `/orders/{id}/accept` | `ROLE_FREELANCER` | Freelancer accepts `PENDING` order ➔ `ACCEPTED`. |
| `PATCH` | `/orders/{id}/start` | `ROLE_FREELANCER` | Freelancer starts `ACCEPTED` order ➔ `IN_PROGRESS`. |
| `PATCH` | `/orders/{id}/complete` | `ROLE_FREELANCER` | Freelancer completes `IN_PROGRESS` order ➔ `COMPLETED`. |
| `PATCH` | `/orders/{id}/cancel` | Client / Freelancer / Admin | Cancel order ➔ `CANCELLED`. |
| `DELETE` | `/orders/{id}` | Client / Freelancer / Admin | Cancel order ➔ `CANCELLED`. |

---

## 5. Example Requests Through Gateway (Port 8080)

### 1. Place a New Order (Client Only)
```http
POST http://localhost:8080/orders
Authorization: Bearer <CLIENT_JWT>
Content-Type: application/json

{
  "gigId": 1,
  "requirements": "Please deliver the Spring Boot REST API with MySQL database and JWT authentication."
}
```

### 2. View My Orders (Client or Freelancer)
```http
GET http://localhost:8080/orders/my
Authorization: Bearer <JWT>
```

### 3. Accept an Order (Assigned Freelancer Only)
```http
PATCH http://localhost:8080/orders/1/accept
Authorization: Bearer <FREELANCER_JWT>
```

### 4. Start Work on Order (Assigned Freelancer Only)
```http
PATCH http://localhost:8080/orders/1/start
Authorization: Bearer <FREELANCER_JWT>
```

### 5. Complete an Order (Assigned Freelancer Only)
```http
PATCH http://localhost:8080/orders/1/complete
Authorization: Bearer <FREELANCER_JWT>
```

---

## 6. How to Run Locally

```bash
# 1. Ensure Eureka Server is running on port 8761
cd microservices/discovery-server
mvn spring-boot:run

# 2. Ensure Gig Service is running on port 8083
cd microservices/gig-service
mvn spring-boot:run

# 3. Start Order Service on port 8084
cd microservices/order-service
mvn spring-boot:run
```
