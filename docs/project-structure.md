# Freelance Marketplace - Project Directory Structure

This document outlines the complete directory layout for both the **Frontend** and **Backend** applications.

---

## 1. Root Workspace Layout

```
Freelance-Marketplace/
├── backend/                  # Java Spring Boot 3 Monolith
├── frontend/                 # React 18 + Vite + Tailwind CSS Single Page Application
├── docs/                     # Project Specifications & Architecture Documentation
├── Dockerfile                # Backend Docker Container Definition
├── docker-compose.yml        # Docker Multi-Container Orchestration (MySQL + Spring Boot + React)
└── README.md                 # Project Overview & Setup Instructions
```

---

## 2. Frontend Directory Structure (`frontend/src/`)

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

## 3. Backend Directory Structure (`backend/src/main/java/com/freelancemarketplace/`)

```
com.freelancemarketplace/
├── FreelanceMarketplaceApplication.java    # Spring Boot Main Entry Class
│
├── config/
│   ├── SecurityConfig.java                 # Spring Security & Password Encoder Config
│   ├── JwtAuthenticationFilter.java        # JWT Bearer Token Processing Filter
│   ├── JwtTokenProvider.java               # JWT Generation & Validation Utility
│   └── WebConfig.java                      # CORS Configuration
│
├── common/
│   ├── ApiResponse.java                    # Standardized API Response Envelope
│   └── GlobalExceptionHandler.java         # Controller Advice Error Interceptor
│
└── modules/                                # Domain Modules
    ├── auth/
    │   ├── controller/AuthController.java
    │   ├── service/AuthService.java
    │   └── dto/LoginDTO.java, RegisterDTO.java, AuthResponseDTO.java
    │
    ├── user/
    │   ├── entity/User.java, Role.java
    │   ├── repository/UserRepository.java
    │   ├── service/UserService.java
    │   ├── controller/UserController.java
    │   └── dto/UserProfileDTO.java, UserUpdateDTO.java
    │
    ├── category/
    │   ├── entity/Category.java
    │   ├── repository/CategoryRepository.java
    │   ├── service/CategoryService.java
    │   └── controller/CategoryController.java
    │
    ├── gig/
    │   ├── entity/Gig.java
    │   ├── repository/GigRepository.java
    │   ├── service/GigService.java
    │   ├── controller/GigController.java
    │   └── dto/GigDTO.java, CreateGigDTO.java
    │
    ├── order/
    │   ├── entity/Order.java, OrderStatus.java
    │   ├── repository/OrderRepository.java
    │   ├── service/OrderService.java
    │   ├── controller/OrderController.java
    │   └── dto/OrderDTO.java, CreateOrderDTO.java
    │
    ├── wallet/
    │   ├── entity/Wallet.java, WalletTransaction.java, TransactionType.java, TransactionStatus.java
    │   ├── repository/WalletRepository.java, WalletTransactionRepository.java
    │   ├── service/WalletService.java
    │   ├── controller/WalletController.java, TransactionController.java
    │   └── dto/WalletDTO.java, WalletTopUpDTO.java, TransactionDTO.java
    │
    └── review/
        ├── entity/Review.java
        ├── repository/ReviewRepository.java
        ├── service/ReviewService.java
        ├── controller/ReviewController.java
        └── dto/ReviewDTO.java, CreateReviewDTO.java
```