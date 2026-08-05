# Microservices Architecture Blueprint & Migration Guide

This directory contains the clean project skeletons and shared infrastructure configuration for migrating the Freelance Marketplace application from a monolithic architecture to a event-driven microservices architecture.

---

## 🏗️ Monolith Status & Isolation Notice

> [!IMPORTANT]
> The monolithic application located in `/backend` and `/frontend` remains **100% untouched and fully operational**.
> The monolith version has been tagged as `v1.0-monolith`.
> This `microservices/` directory serves as an isolated workspace skeleton to prepare for incremental migration without interrupting existing monolithic backend functionality.

---

## 📦 Directory Overview

```
microservices/
│
├── pom.xml                     # Maven Parent POM (Java 21, Spring Boot 3.3.x, Spring Cloud 2023.0.x)
├── docker-compose.yml          # Container orchestration configuration
├── .env.example                # Centralized environment variable template
│
├── discovery-server/           # Netflix Eureka Service Discovery (Port: 8761)
├── api-gateway/                # Spring Cloud API Gateway (Port: 8080)
│
├── auth-service/               # Authentication & JWT Management (Port: 8081)
├── user-service/               # User Profiles & Role Management (Port: 8082)
├── gig-service/                # Service Listings & Categories (Port: 8083)
├── order-service/              # Order Processing & Lifecycle (Port: 8084)
├── wallet-service/             # Balance, Payments & Transactions (Port: 8085)
├── review-service/             # Ratings & Feedback (Port: 8086)
├── notification-service/       # Email / SMS / In-App Notifications (.NET 8 Web API, Port: 8087)
│
├── shared/                     # Reusable Java Shared Libraries
│   ├── common-dto/             # Data Transfer Objects across services
│   ├── common-security/        # Shared JWT validation & Security utilities
│   ├── common-utils/           # Helper functions & constants
│   └── common-exception/       # Global exception models & handlers
│
└── docker/
    ├── mysql/                  # Database initialization scripts
    └── scripts/                # Local development & EC2 deployment helper scripts
```

---

## 🚀 Service Architecture & Port Matrix

| Service Name | Stack | Default Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Discovery Server** | Java 21 / Spring Boot 3.3 | `8761` | Service Registry & Discovery (Eureka) |
| **API Gateway** | Java 21 / Spring Cloud Gateway | `8080` | Unified Entrypoint, Routing & CORS Management |
| **Auth Service** | Java 21 / Spring Security JWT | `8081` | Authentication, Token Generation & Auth Credentials |
| **User Service** | Java 21 / Spring Data JPA | `8082` | Freelancer/Client profiles & Bio details |
| **Gig Service** | Java 21 / Spring Data JPA | `8083` | Service offerings, Search & Cloudinary Image References |
| **Order Service** | Java 21 / Spring Data JPA | `8084` | Order placement, Status workflows & Contracts |
| **Wallet Service** | Java 21 / Spring Data JPA | `8085` | User balances, Escrow funds & Payment transactions |
| **Review Service** | Java 21 / Spring Data JPA | `8086` | Rating system & Client feedback |
| **Notification Service** | C# / .NET 8 Web API | `8087` | Email, SMS & Real-time push notifications |

---

## 🔒 Shared Modules (`/shared`)

The Java microservices leverage shared library modules to eliminate duplication while avoiding tight coupling:
- **`common-dto`**: Contains cross-cutting domain DTOs used for inter-service communication.
- **`common-security`**: Shared JWT parsing logic and public key/filter setup.
- **`common-utils`**: Standard formatting, date helpers, and system constants.
- **`common-exception`**: Uniform error responses (`ApiResponse`, `GlobalExceptionHandler`).

---

## 🗺️ Migration Roadmap & Blueprint

### Phase 1: Preparation (Completed)
- Clean repository project skeletons created without business logic.
- Container orchestration templates created (`docker-compose.yml`, `.env.example`).
- Architecture & documentation established.

### Phase 2: Core Infrastructure Setup (Upcoming)
- Start Eureka Discovery Server & API Gateway containers.
- Configure Spring Cloud Gateway routing rules.

### Phase 3: Database & Service Extraction (Upcoming)
- Extract Database schemas into separate isolated MySQL databases per service (`freelance_auth_db`, `freelance_user_db`, etc.).
- Migrate authentication logic into `auth-service`.
- Migrate user, gig, order, wallet, review domain modules incrementally.
- Implement `.NET 8` notification service logic.

### Phase 4: Third-Party Integrations & Deployment (Upcoming)
- Integrate **Cloudinary SDK** into `gig-service` and `user-service`.
- Containerize all services with Dockerfiles.
- Deploy to AWS EC2 using Docker Compose.

---

## 🛠️ Building the Java Microservices Skeleton

To compile all Java microservices and shared modules:

```bash
cd microservices
mvn clean compile
```
