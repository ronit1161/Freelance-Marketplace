# Freelance Marketplace - System Architecture Document

## 1. Executive Summary

The **Freelance Marketplace** platform is a full-stack web application connecting Clients, Freelancers, and Administrators in a digital service ecosystem. It features role-based access control, service gig listings, a strict order execution lifecycle, an Escrow-protected virtual wallet, ratings & reviews, and administrative platform controls.

---

## 2. Architectural Overview

The application follows a clean **Three-Tier Architecture**:

```
+-------------------------------------------------------------+
|                      CLIENT LAYER                           |
|      Single Page Application (React 18 + Vite + Tailwind)   |
+-------------------------------------------------------------+
                              | HTTP / REST (JSON)
                              v
+-------------------------------------------------------------+
|                    APPLICATION LAYER                        |
|       Layered Monolith (Spring Boot 3 + Spring Security)    |
|      [Controller] -> [Service] -> [Repository/DAO]          |
+-------------------------------------------------------------+
                              | JPA / JDBC (Hibernate)
                              v
+-------------------------------------------------------------+
|                      DATABASE LAYER                         |
|               Relational Database (MySQL 8)                 |
+-------------------------------------------------------------+
```

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS (Vanilla CSS design system)
- **HTTP Client**: Axios with centralized request/response interceptors (`apiClient.js`)
- **State & Auth**: React Context API (`AuthContext.jsx`) with persistent local storage
- **Icons**: Lucide React

### Backend Architecture
- **Framework**: Java 17 / Spring Boot 3
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Persistence**: Spring Data JPA & Hibernate ORM
- **Database Driver**: MySQL Connector/J
- **Build Tool**: Apache Maven

### Database Tier
- **Engine**: MySQL 8.0
- **Entity Identification**: Auto-increment / Numeric IDs with base timestamps (`createdOn`, `lastUpdated`)

---

## 4. Layered Monolith Architecture

The backend is structured into domain modules (`auth`, `user`, `gig`, `order`, `wallet`, `transaction`, `review`, `category`). Each module follows strict separation of concerns:

1. **Controller Layer (`*.controller`)**:
   - Handles REST HTTP requests/responses.
   - Validates incoming DTOs and handles response wrapping via `ApiResponse<T>`.
2. **Service Layer (`*.service`)**:
   - Encapsulates domain logic, financial escrow rules, and order state transitions.
   - Transactional boundary (`@Transactional`).
3. **Repository Layer (`*.repository`)**:
   - Extends `JpaRepository<Entity, Long>` for data access and custom JPQL queries.
4. **Data Transfer Objects (`*.dto`)**:
   - Decouples internal database entities from external API contracts.

---

## 5. Security & Authentication Flow

```
[ Client ] ---> POST /api/auth/login ---> [ AuthController ]
                                                  |
                                          Validate Credentials
                                                  |
[ Client ] <--- JWT Token + User Info <-----------+
    |
    | (Include "Authorization: Bearer <token>" in headers)
    v
[ Spring Security Filter Chain ] ---> Validate Token ---> Execute Request
```

- **Stateless Authentication**: Requests are authenticated via JWT Bearer Tokens.
- **Role-Based Authorization (RBAC)**: Enforces access rules for `CLIENT`, `FREELANCER`, and `ADMIN` roles across endpoints.

---

## 6. Escrow & Wallet Architecture

The wallet system guarantees financial safety between clients and freelancers through automated Escrow lifecycle management:

```
1. Order Placed (CLIENT)
   └── Deducts Available Balance -> Moves funds to Held (Escrow) Balance.
   └── Creates ESCROW_HOLD Transaction record.

2. Order Delivery & Acceptance (FREELANCER / CLIENT)
   └── Order status transitions to COMPLETED.
   └── Held funds are transferred to Freelancer's Available Balance.
   └── Creates RELEASE Transaction record.

3. Order Cancellation
   └── Order status transitions to CANCELLED.
   └── Held funds return from Escrow back to Client's Available Balance.
   └── Creates REFUND Transaction record.
```

---

## 7. Deployment & Containerization

- **Containerization**: Prepared for containerized orchestration via `Dockerfile` (Frontend & Backend) and `docker-compose.yml` for unified execution with MySQL.
- **Production Targets**: Frontend (Vercel/Netlify), Backend (Render/Railway), Database (Managed MySQL).
