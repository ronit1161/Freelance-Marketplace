# Wallet Service (`wallet-service`) — Freelance Marketplace

## 1. Overview & Responsibilities
The **Wallet Service** manages balances, deposits, escrow fund locking, earnings releases, and transaction records for the Freelance Marketplace microservices ecosystem. It runs on port `8085` with an isolated database `freelance_wallet_db`.

```
                  React Frontend (localhost:5173)
                                │
                                │ HTTP / JSON / JWT
                                ▼
                       API Gateway (:8080)
                                │
                                │ lb://WALLET-SERVICE
                                ▼
                      Wallet Service (:8085)
                                │
                                ├── Escrow Operations (Lock / Release / Refund)
                                │
                                ▼
                     [(freelance_wallet_db)]
```

### Core Responsibilities:
1. **Balance & Deposit Management**: Tracks user `availableBalance` and `escrowBalance`. Users can deposit funds into their available balance.
2. **Escrow Fund Locking**: Atomically moves funds from `availableBalance` to `escrowBalance` upon order placement.
3. **Escrow Earnings Release**: Atomically transfers locked funds from client's `escrowBalance` to freelancer's `availableBalance` upon order completion.
4. **Escrow Refund**: Atomically restores locked funds from client's `escrowBalance` back to `availableBalance` upon order cancellation.
5. **Idempotency**: Guarantees duplicate escrow requests for the same order produce no double-charging, double-paying, or double-refunding.
6. **Financial Audit Trail**: Logs immutable transaction records (`DEPOSIT`, `ESCROW_LOCK`, `ESCROW_RELEASE`, `ESCROW_REFUND`).

---

## 2. Database Schema (`freelance_wallet_db`)

```sql
CREATE DATABASE IF NOT EXISTS freelance_wallet_db;
USE freelance_wallet_db;

CREATE TABLE wallets (
    wallet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    available_balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    escrow_balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_wallets_user_id (user_id)
);

CREATE TABLE wallet_transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id BIGINT NOT NULL,
    order_id BIGINT,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_wt_wallet_id (wallet_id),
    INDEX idx_wt_order_id (order_id)
);

CREATE TABLE escrows (
    escrow_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    client_id BIGINT NOT NULL,
    freelancer_id BIGINT,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_escrows_order_id (order_id),
    INDEX idx_escrows_client_id (client_id)
);
```

> [!IMPORTANT]
> **Zero Cross-Service Foreign Keys**: `user_id` and `order_id` are stored as pure scalar `BIGINT` identifiers without database constraints to other services.

---

## 3. Escrow State Lifecycle

```
Client Wallet: (Available: 1000, Escrow: 0)
Freelancer Wallet: (Available: 0, Escrow: 0)
                      │
                      │ 1. lockEscrow(orderId, client, 500)
                      ▼
Client: (Available: 500, Escrow: 500)
Escrow Record: (orderId: 1, status: LOCKED, amount: 500)
                      │
         ┌────────────┴────────────┐
         │                         │
  Order Completed           Order Cancelled
  releaseEscrow()           refundEscrow()
         │                         │
         ▼                         ▼
Client: (Avail: 500, Esc: 0)    Client: (Avail: 1000, Esc: 0)
Freelancer: (Avail: +500)       Freelancer: (Avail: 0)
Escrow: RELEASED                Escrow: REFUNDED
```

---

## 4. API Endpoints

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallet` / `/wallet/me` | Authenticated | Retrieve authenticated user's wallet (auto-created if new). |
| `GET` | `/wallet/{userId}` | Self / `ROLE_ADMIN` | Retrieve wallet by user ID. |
| `POST` | `/wallet/deposit` | Authenticated | Deposit money into wallet available balance. |
| `GET` | `/wallet/transactions` | Authenticated | View audit trail of wallet transactions. |
| `POST` | `/wallet/escrow/lock` | Internal / Feign | Locks funds for an order (`available ➔ escrow`). |
| `POST` | `/wallet/escrow/release` | Internal / Feign | Releases funds on completion (`client escrow ➔ freelancer available`). |
| `POST` | `/wallet/escrow/refund` | Internal / Feign | Refunds funds on cancellation (`client escrow ➔ client available`). |

---

## 5. Example Requests Through Gateway (Port 8080)

### 1. View My Wallet
```http
GET http://localhost:8080/wallet
Authorization: Bearer <JWT_TOKEN>
```

### 2. Deposit Funds
```http
POST http://localhost:8080/wallet/deposit
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "amount": 1000.00
}
```

### 3. View Transaction History
```http
GET http://localhost:8080/wallet/transactions
Authorization: Bearer <JWT_TOKEN>
```

---

## 6. How to Run Locally

```bash
# 1. Start Eureka Server (Port 8761)
cd microservices/discovery-server
mvn spring-boot:run

# 2. Start Wallet Service (Port 8085)
cd microservices/wallet-service
mvn spring-boot:run
```
