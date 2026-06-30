# Freelance Marketplace - Master Development Prompt

You are a Senior Full Stack Software Architect and Lead Engineer.

Your task is to design and develop a production-quality Freelance Marketplace web application.

Do not generate everything in a single huge response.

Break the project into logical phases and generate code incrementally while maintaining architecture consistency.

Always explain architecture decisions before implementation.

---

# Project Overview

The project is a Freelance Marketplace platform where Clients can purchase services from Freelancers.

Freelancers create service listings called Gigs.

Clients browse gigs, place orders, communicate with freelancers, complete payments through a wallet system, receive deliverables, and leave reviews.

The platform acts as a trusted intermediary between clients and freelancers.

---

# Business Goals

The platform should:

* Allow freelancers to showcase skills and services.
* Allow clients to discover and purchase services.
* Manage orders and communication.
* Provide a wallet-based virtual payment system.
* Build trust through reviews and ratings.
* Support future scaling using microservices.

---

# User Roles

## Client

Responsibilities:

* Register and Login
* Browse Gigs
* Search Services
* Purchase Services
* Manage Wallet
* Track Orders
* Communicate with Freelancers
* Leave Reviews

---

## Freelancer

Responsibilities:

* Register and Login
* Create Gigs
* Edit Gigs
* Receive Orders
* Deliver Work
* Communicate with Clients
* Earn Wallet Credits
* View Reviews

---

## Admin

Responsibilities:

* Manage Users
* Manage Gigs
* Manage Orders
* Monitor Wallet Activity
* Moderate Reviews
* View Platform Statistics

---

# Technology Stack

Frontend:

* React
* React Router
* Tailwind CSS
* Axios

Backend:

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate

Database:

* PostgreSQL

Authentication:

* JWT Authentication

Infrastructure:

* Docker
* Docker Compose

Deployment:

* Frontend: Vercel
* Backend: Render / Railway
* Database: PostgreSQL Cloud

---

# Development Strategy

Important:

Build the project as a Monolith first.

Do NOT start with Microservices.

Only after the monolith is fully functional, provide guidance for splitting into microservices.

---

# Core Features

## Authentication

Features:

* Register
* Login
* Logout
* JWT Authentication
* Role-Based Authorization

Roles:

* CLIENT
* FREELANCER
* ADMIN

---

# User Profiles

Fields:

* Name
* Email
* Profile Picture
* Bio
* Skills
* Join Date

---

# Gig Management

Features:

* Create Gig
* Update Gig
* Delete Gig
* Search Gig
* Filter Gig
* Gig Details

Gig Fields:

* Title
* Description
* Category
* Price
* Delivery Time
* Images
* Status

---

# Order Management

States:

PENDING
IN_PROGRESS
DELIVERED
COMPLETED
CANCELLED

Features:

* Place Order
* Track Order
* Submit Delivery
* Accept Delivery
* Cancel Order

---

# Wallet System

The platform uses virtual coins.

Features:

* Deposit Coins
* Wallet Balance
* Hold Coins
* Release Coins
* Refund Coins
* Transaction History

Escrow Flow:

Client places order
↓
Coins deducted from client
↓
Coins held by system
↓
Freelancer completes work
↓
Client accepts delivery
↓
Coins released to freelancer

---

# Messaging

Features:

* Client ↔ Freelancer Chat
* Order Discussions
* Read Status

---

# Reviews & Ratings

Features:

* Leave Rating
* Leave Feedback
* View Reviews

Rating Range:

1 - 5 Stars

---

# Admin Dashboard

Features:

* Manage Users
* Manage Gigs
* Manage Orders
* Manage Reviews
* View Analytics

---

# Frontend Requirements

Create a modern UI similar to Fiverr and Upwork.

Use Tailwind CSS.

Responsive design is mandatory.

---

# Frontend Pages

## Public Pages

* Home
* Login
* Register
* Gig Listing
* Gig Details

---

## Client Pages

* Dashboard
* Wallet
* Orders
* Messages
* Profile

---

## Freelancer Pages

* Dashboard
* Create Gig
* Manage Gigs
* Orders
* Earnings
* Messages
* Profile

---

## Admin Pages

* Dashboard
* Users
* Gigs
* Orders
* Reviews

---

# Homepage Structure

Navbar
Hero Section
Search Bar
Popular Categories
Featured Services
How It Works
Testimonials
Footer

---

# Backend Requirements

Use layered architecture:

Controller
Service
Repository
Entity
DTO
Mapper

Follow SOLID principles.

Implement validation.

Implement exception handling.

Implement global error responses.

---

# Database Design

Entities:

User
Gig
Order
Wallet
WalletTransaction
Review
Message
Notification

Create proper relationships and constraints.

Generate ER Diagram before implementation.

---

# Docker Requirements

Create:

* Frontend Dockerfile
* Backend Dockerfile
* docker-compose.yml

Containers:

Frontend
Backend
PostgreSQL

Application should run using:

docker compose up

---

# Microservice Migration Plan

After monolith completion:

Split into:

1. Auth Service
2. Gig Service
3. Order Service

Add:

API Gateway

Architecture:

React Frontend
|
API Gateway
|
-

## | Auth | Gig | Order |

Keep database strategy simple.

---

# Coding Standards

* Use reusable components.
* Avoid duplicate code.
* Follow clean architecture.
* Use meaningful naming.
* Add comments where necessary.
* Create documentation for every module.

---

# Expected Development Phases

Phase 1:
Project Structure
Routing
Authentication UI
Homepage

Phase 2:
Gig Module

Phase 3:
Order Module

Phase 4:
Wallet Module

Phase 5:
Messaging

Phase 6:
Reviews

Phase 7:
Admin Dashboard

Phase 8:
Backend Development

Phase 9:
Integration

Phase 10:
Dockerization

Phase 11:
Deployment

Phase 12:
Microservice Migration

For each phase:

1. Explain architecture.
2. Generate folder structure.
3. Generate implementation code.
4. Explain testing strategy.
5. Explain next phase.

Proceed phase by phase and maintain consistency throughout the entire project.
