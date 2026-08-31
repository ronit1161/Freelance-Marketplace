# Freelance Marketplace - Project Directory Structure

This document outlines the complete directory layout for the **Root Workspace**, **Frontend SPA**, **Layered Monolith Backend**, **Microservices Infrastructure**, and **Documentation** modules.

---

## 1. Root Workspace Layout

```
Freelance-Marketplace/
├── backend/                  # Java Spring Boot 3 Layered Monolith
├── frontend/                 # React 18 + Vite + Tailwind CSS Single Page Application
├── microservices/            # Spring Cloud & Polyglot Microservices Migration Workspace
├── docs/                     # Specifications, Architecture, API, Security & Interview Docs
├── Dockerfile                # Backend Docker Container Definition
├── docker-compose.yml        # Monolith Docker Multi-Container Orchestration
└── README.md                 # Master Project Overview & Setup Instructions
```

---

## 2. Documentation Directory (`docs/`)

```
docs/
├── Project-Info.md           # Master Project Overview & Business Requirements
├── Project-Plan.md           # Development Roadmap & Phase Tracking
├── api-design.md             # REST API Endpoint Specifications & Payload Contracts
├── architecture.md           # System Architecture & Technical Layer Design
├── backend-improvements.md   # Comprehensive Backend Audit Report & Security Hardening
├── database-design.md        # Relational Database Schema, ERD & Indexing Specification
├── frontend-issues.md        # Frontend Audit Tracker & Resolution Status
├── interview-questions.md    # 25-Section Comprehensive Technical Interview Preparation Guide
├── project-structure.md      # Directory Layout & Component Mapping (This Document)
├── requirements.md           # Detailed Functional & Non-Functional Specifications
└── tasks.md                  # Task Breakdown & Implementation Checklist
```

---

## 3. Frontend Directory Structure (`frontend/src/`)

```
frontend/src/
├── app/
│   ├── App.jsx               # Application Root Component
│   ├── routes.jsx            # Centralized React Router Configuration
│   └── providers.jsx         # Context Providers Wrapper
│
├── components/               # Cross-Feature Shared Components
│   ├── common/               # UI Primitives: Modal, Spinner, Alert, Button
│   └── layout/               # Navbar, Footer, Page Layout Wrappers
│
├── context/
│   └── AuthContext.jsx       # User Authentication & JWT Context State
│
├── services/                 # Centralized HTTP & Feature Service APIs
│   ├── apiClient.js          # Axios Instance with Request/Response Interceptors
│   ├── authApi.js            # Registration & Authentication Calls
│   ├── gigApi.js             # Gig Listing & Management API Calls
│   ├── orderApi.js           # Order Checkout & Lifecycle Status Transitions
│   ├── walletapi.js          # Wallet Balances & Top-Up Calls
│   ├── reviewApi.js          # Freelancer/Gig Reviews API Calls
│   ├── userApi.js            # User Profile & Admin Management Calls
│   └── categoryApi.js        # Category CRUD API Calls
│
├── features/                 # Modular Feature Modules
│   ├── auth/
│   │   ├── pages/            # LoginPage.jsx, RegisterPage.jsx
│   │   └── components/       # Auth Form Components
│   │
│   ├── home/
│   │   ├── pages/            # HomePage.jsx
│   │   └── components/       # Hero, SearchBar, CategoryGrid, FeaturedGigs
│   │
│   ├── gigs/
│   │   ├── pages/            # GigMarketplacePage.jsx, GigDetailsPage.jsx, CreateGigPage.jsx, MyGigsPage.jsx, AdminGigManagementPage.jsx
│   │   └── components/       # GigCard, OrderCheckoutModal, GigFilters
│   │
│   ├── orders/
│   │   ├── pages/            # OrdersPage.jsx (Client), FreelancerOrdersPage.jsx, AdminOrderManagementPage.jsx
│   │   └── components/       # OrderTrackerCard, OrderStatusBadge
│   │
│   ├── wallet/
│   │   └── pages/            # WalletPage.jsx (Client/Add Funds), FreelancerWalletPage.jsx (Read-Only)
│   │
│   ├── reviews/
│   │   ├── pages/            # FreelancerReviewsPage.jsx
│   │   └── components/       # ReviewCard, ReviewRatingStars
│   │
│   ├── profile/
│   │   ├── pages/            # ClientProfilePage.jsx, FreelancerProfilePage.jsx, AdminProfilePage.jsx, EditProfilePage.jsx
│   │   └── components/       # ProfileHeader, SideBar, AvatarUploader
│   │
│   ├── Client/
│   │   └── Pages/            # ClientDashboard.jsx
│   │
│   ├── dashboard/
│   │   ├── pages/            # FreelancerDashboardPage.jsx, AdminDashboardPage.jsx
│   │   └── components/       # FreelancerHeader, QuickAccessBar, FreelancerStatsGrid, RecentOrdersTable
│   │
│   └── categories/
│       └── pages/            # CategoryManagementPage.jsx
│
└── styles/
    └── index.css             # Design Tokens, Color System & Global Tailwind Directives
```

---

## 4. Layered Monolith Backend (`backend/src/main/java/com/freelancemarketplace/`)

```
com.freelancemarketplace/
├── FreelanceMarketplaceApplication.java    # Spring Boot Main Entry Class
│
├── config/
│   ├── SecurityConfig.java                 # Spring Security & Password Encoder Config
│   ├── JwtAuthenticationFilter.java        # JWT Bearer Token Processing Filter
│   ├── JwtUtils.java                       # JWT Generation & Parsing Utility
│   └── WebConfig.java                      # CORS Configuration
│
├── common/
│   ├── ApiResponse.java                    # Standardized API Response Envelope
│   └── GlobalExceptionHandler.java         # Controller Advice Error Interceptor
│
├── enums/
│   ├── Role.java                           # CLIENT, FREELANCER, ADMIN
│   ├── OrderStatus.java                    # PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED
│   ├── TransactionType.java                # DEPOSIT, ESCROW_HOLD, RELEASE, REFUND, DEBIT
│   └── TransactionStatus.java              # COMPLETED, PENDING, FAILED
│
└── modules/                                # Domain Modules
    ├── auth/
    │   ├── controller/AuthController.java
    │   ├── service/AuthServiceImpl.java
    │   └── dto/LoginRequest.java, RegisterRequest.java, AuthResponse.java
    │
    ├── user/
    │   ├── entity/User.java
    │   ├── repository/UserRepository.java
    │   ├── service/UserServiceImplementation.java
    │   ├── controller/UserController.java
    │   └── dto/UserProfileRecord.java, UpdateProfileRecord.java
    │
    ├── category/
    │   ├── entity/Category.java
    │   ├── repository/CategoryRepository.java
    │   ├── service/CategoryServiceImpl.java
    │   └── controller/CategoryController.java
    │
    ├── gigs/
    │   ├── entity/Gig.java
    │   ├── repository/GigRepository.java
    │   ├── service/GigServiceImpl.java
    │   ├── controller/GigController.java
    │   └── dto/GigResponseRecord.java, CreateGigRecord.java
    │
    ├── order/
    │   ├── entity/Order.java
    │   ├── repository/OrderRepository.java
    │   ├── service/OrderServiceImpl.java
    │   ├── controller/OrderController.java
    │   └── dto/OrderResponseRecord.java, CreateOrderRecord.java
    │
    ├── wallet/
    │   ├── entity/Wallet.java
    │   ├── repository/WalletRepository.java
    │   ├── service/WalletServiceImpl.java
    │   └── controller/WalletController.java
    │
    ├── walletTransactions/
    │   ├── entity/WalletTransaction.java
    │   ├── repository/WalletTransactionRepository.java
    │   ├── service/WalletTransactionServiceImpl.java
    │   └── controller/WalletTransactionController.java
    │
    ├── review/
    │   ├── entity/Review.java
    │   ├── repository/ReviewRepository.java
    │   ├── service/ReviewServiceImpl.java
    │   └── controller/ReviewController.java
    │
    └── admin/
        └── controller/                     # Admin Overlord Controllers
            ├── AdminUserController.java
            ├── AdminGigController.java
            ├── AdminOrderController.java
            ├── AdminCategoryController.java
            ├── AdminTransactionController.java
            ├── AdminReviewController.java
            └── DashboardController.java
```

---

## 5. Microservices Migration Architecture (`microservices/`)

```
microservices/
├── pom.xml                     # Maven Parent POM (Java 21, Spring Boot 3.3.x, Spring Cloud 2023.0.x)
├── docker-compose.yml          # Microservices Container Orchestration
├── .env.example                # Centralized Environment Variables Template
├── README.md                   # Microservices Migration Guide & Architecture Blueprint
│
├── discovery-server/           # Netflix Eureka Service Registry (Port: 8761)
├── api-gateway/                # Spring Cloud API Gateway & CORS Management (Port: 8080)
│
├── auth-service/               # JWT Token Generation & Credentials (Port: 8081)
├── user-service/               # User Profiles & Bio Management (Port: 8082)
├── gig-service/                # Service Listings & Catalog Search (Port: 8083)
├── order-service/              # Order Placement & Lifecycle Workflow (Port: 8084)
├── wallet-service/             # Balances, Payments & Escrow Ledger (Port: 8085)
├── review-service/             # Ratings & Client Feedback (Port: 8086)
├── notification-service/       # Notification Service (.NET 8 Web API, Port: 8087)
├── ai-service/                 # GenAI Requirement Generator Service
│
├── shared/                     # Cross-Cutting Shared Libraries
│   ├── common-dto/             # Shared Inter-Service DTO Models
│   ├── common-security/        # Shared JWT Validation Filters & Public Key Security
│   ├── common-utils/           # System Constants & Helper Functions
│   └── common-exception/       # Standardized ApiResponse & Global Error Models
│
└── docker/
    ├── mysql/                  # Database Isolation Initialization Scripts
    └── scripts/                # Local Dev & EC2 Deployment Helpers
```