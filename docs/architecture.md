# Freelance Marketplace - System Architecture

## Architecture Overview

The system follows a three-tier architecture:

Client Layer
↓
Application Layer
↓
Database Layer

---

# 1. Client Layer (Frontend)

Technology:

* React
* Tailwind CSS
* React Router

Responsibilities:

* User Interface
* Routing
* Form Validation
* API Consumption
* State Management

Main Modules:

* Authentication
* Homepage
* Gig Management
* Orders
* Wallet
* Messaging
* Reviews
* Admin Dashboard

---

# 2. Application Layer (Backend)

Technology:

* Spring Boot
* Spring Security
* Hibernate
* JPA

Architecture Pattern:

Controller
↓
Service
↓
Repository
↓
Database

Responsibilities:

* Business Logic
* Authentication
* Authorization
* Order Processing
* Wallet Processing
* Data Validation

---

# 3. Database Layer

Technology:

* PostgreSQL

Responsibilities:

* Data Storage
* Data Integrity
* Relationship Management

---

# Core Modules

## Authentication Module

Responsibilities:

* Registration
* Login
* JWT Generation
* Role Management

---

## User Module

Responsibilities:

* Profile Management
* User Information

---

## Gig Module

Responsibilities:

* Gig Creation
* Gig Management
* Gig Search

---

## Order Module

Responsibilities:

* Order Placement
* Order Tracking
* Order Completion

Order States:

PENDING
IN_PROGRESS
DELIVERED
COMPLETED
CANCELLED

---

## Wallet Module

Responsibilities:

* Coin Management
* Escrow Handling
* Refund Processing

Transaction Types:

DEPOSIT
WITHDRAWAL
HOLD
RELEASE
REFUND

---

## Messaging Module

Responsibilities:

* Client-Freelancer Communication
* Order Discussions

---

## Review Module

Responsibilities:

* Ratings
* Reviews
* Reputation Management

---

# Future Microservice Architecture

The project will initially be developed as a monolith.

After successful completion, the following services may be extracted:

## Auth Service

* Authentication
* Authorization

## Gig Service

* Gig Management
* Search

## Order Service

* Orders
* Wallet Processing

Architecture:

Frontend
↓
API Gateway
↓
Auth Service
Gig Service
Order Service

---

# Deployment Architecture

Frontend:
React Application
↓
Vercel

Backend:
Spring Boot Application
↓
Render / Railway

Database:
PostgreSQL
↓
Cloud Database Provider

Docker Compose will be used for local development and testing.
