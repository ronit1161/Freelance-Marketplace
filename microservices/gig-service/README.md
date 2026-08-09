# Gig Service (`gig-service`) — Freelance Marketplace

## 1. Overview & Responsibilities
The **Gig Service** manages the marketplace gig catalog, categories, and service listings. It runs on port `8083` with an isolated database `freelance_gig_db`.

```
                  React Frontend (localhost:5173)
                                │
                                │ HTTP / JSON / JWT
                                ▼
                       API Gateway (:8080)
                                │
                                │ lb://GIG-SERVICE
                                ▼
                       Gig Service (:8083)
                                │
                                ▼
                      [(freelance_gig_db)]
```

### Core Responsibilities:
1. **Gig Catalog & Browsing**: Public searching, filtering by category/price range/keyword, and sorting.
2. **Freelancer Gig Management**: Creation, updates, soft-deletion, and personal gig listing (`/gigs/my`).
3. **Category Management**: Categories owned inside Gig Service; admin-only creation/update/deletion.
4. **Ownership Authorization**: Enforces that only the creator of a gig can update or delete it.

---

## 2. Database Schema (`freelance_gig_db`)

```sql
CREATE DATABASE IF NOT EXISTS freelance_gig_db;
USE freelance_gig_db;

CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE gigs (
    gig_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    freelancer_id BIGINT NOT NULL, -- Logical reference to Auth User ID
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    delivery_days INT NOT NULL,
    thumbnail_url VARCHAR(255),
    category_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    total_orders INT DEFAULT 0 NOT NULL,
    average_rating DOUBLE DEFAULT 0.0 NOT NULL,
    total_reviews INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_gigs_freelancer_id (freelancer_id),
    INDEX idx_gigs_category_id (category_id)
);
```

> [!IMPORTANT]
> **Zero Cross-Service Foreign Keys**: `freelancer_id` is a logical `BIGINT` reference to the Auth user's ID without any database-level constraint to `freelance_auth_db` or `freelance_user_db`.

---

## 3. API Endpoints

### Gigs (`/gigs`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/gigs` | `ROLE_FREELANCER` | Create a new gig (uses `X-User-Id` for ownership). |
| `GET` | `/gigs` | Public | Browse all active gigs with filters (`categoryId`, `minPrice`, `maxPrice`, `search`, `sortBy`). |
| `GET` | `/gigs/{id}` | Public | Get single gig details by ID. |
| `GET` | `/gigs/my` | `ROLE_FREELANCER` | Get gigs belonging to the authenticated freelancer. |
| `GET` | `/gigs/freelancer/{freelancerId}` | Public | Get active gigs created by a specific freelancer. |
| `PUT` | `/gigs/{id}` | `ROLE_FREELANCER` (Owner) | Update an existing gig. |
| `DELETE` | `/gigs/{id}` | Owner / `ROLE_ADMIN` | Soft-delete a gig. |

### Categories (`/categories`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Public | List all active categories. |
| `GET` | `/categories/{id}` | Public | Get category by ID. |
| `POST` | `/categories` | `ROLE_ADMIN` | Create a new category. |
| `PUT` | `/categories/{id}` | `ROLE_ADMIN` | Update a category. |
| `DELETE` | `/categories/{id}` | `ROLE_ADMIN` | Soft-delete a category. |

---

## 4. Example Requests Through Gateway (Port 8080)

### 1. Create a Category (Admin Only)
```http
POST http://localhost:8080/categories
Authorization: Bearer <ADMIN_JWT>
Content-Type: application/json

{
  "name": "Web Development",
  "description": "Full stack, backend, and frontend development services"
}
```

### 2. Create a Gig (Freelancer Only)
```http
POST http://localhost:8080/gigs
Authorization: Bearer <FREELANCER_JWT>
Content-Type: application/json

{
  "title": "Build Spring Boot Microservices Backend",
  "description": "I will develop robust and scalable Spring Boot microservices with MySQL and JWT.",
  "price": 250.00,
  "deliveryDays": 4,
  "thumbnailUrl": "https://example.com/images/gig1.png",
  "categoryId": 1
}
```

### 3. Search & Filter Gigs (Public)
```http
GET http://localhost:8080/gigs?categoryId=1&minPrice=50&maxPrice=500&search=Spring&sortBy=price_asc
```

### 4. Update Gig (Owner Only)
```http
PUT http://localhost:8080/gigs/1
Authorization: Bearer <FREELANCER_JWT>
Content-Type: application/json

{
  "title": "Build Spring Boot Microservices Backend (Updated)",
  "description": "Updated description with Docker and Eureka integration.",
  "price": 300.00,
  "deliveryDays": 5,
  "thumbnailUrl": "https://example.com/images/gig1_v2.png",
  "categoryId": 1,
  "active": true
}
```

---

## 5. How to Run Locally

```bash
# 1. Ensure Eureka Server is running on port 8761
cd microservices/discovery-server
mvn spring-boot:run

# 2. Start Gig Service on port 8083
cd microservices/gig-service
mvn spring-boot:run
```
