# Spring Cloud API Gateway (`api-gateway`) — College-Level Microservices Demo

## 1. Overview & Purpose
The **API Gateway** acts as the single, simple entry point for the frontend in our microservices project. It runs on port `8080`.

```
                    React Frontend (:5173)
                              |
                              | HTTP + JWT
                              v
                      +----------------+
                      |  API Gateway   |
                      |     :8080      |
                      +-------+--------+
                              |
                     +--------+--------+
                     |                 |
                     v                 v
                  Eureka          JWT Validation
                     |
                     v
             +-------+-------+-------+
             |               |       |
             v               v       v
        Auth Service    User Service Future Services
           :8081           :8082     (Gig, Order, Wallet)
```

---

## 2. Gateway Responsibilities
The Gateway is kept clean, simple, and easy to explain in an interview:
1. **Routing**: Forward requests using clean paths (`/auth/**`, `/users/**`, `/gigs/**`, `/orders/**`, etc.).
2. **Service Discovery & Load Balancing**: Discover service instances dynamically using Eureka (`lb://AUTH-SERVICE`, `lb://USER-SERVICE`, etc.).
3. **Centralized CORS**: Allow the React development frontend (`http://localhost:5173`).
4. **Basic JWT Validation**: Check if a token is present and valid for protected endpoints; return HTTP 401 if missing or invalid.

---

## 3. Endpoints & Access Rules

### 🔓 Public Endpoints (No JWT required):
* `POST /auth/register`
* `POST /auth/login`
* `GET /actuator/health`

### 🔒 Protected Endpoints (Require `Authorization: Bearer <JWT>`):
* `/users/**`
* `/gigs/**`
* `/orders/**`
* `/wallet/**`
* `/reviews/**`

---

## 4. Gateway Route Configuration (`application.yml`)

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: auth-service
          uri: lb://AUTH-SERVICE
          predicates:
            - Path=/auth/**
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/users/**
        - id: gig-service
          uri: lb://GIG-SERVICE
          predicates:
            - Path=/gigs/**
        - id: order-service
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/orders/**
        - id: wallet-service
          uri: lb://WALLET-SERVICE
          predicates:
            - Path=/wallet/**
        - id: review-service
          uri: lb://REVIEW-SERVICE
          predicates:
            - Path=/reviews/**
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:5173"
              - "http://localhost:3000"
            allowedMethods:
              - GET
              - POST
              - PUT
              - PATCH
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka/}
  instance:
    prefer-ip-address: true

jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
```

---

## 5. How to Run Locally

```bash
# 1. Start Eureka Server (Port 8761)
cd microservices/discovery-server
mvn spring-boot:run

# 2. Start Auth Service (Port 8081)
cd microservices/auth-service
mvn spring-boot:run

# 3. Start User Service (Port 8082)
cd microservices/user-service
mvn spring-boot:run

# 4. Start API Gateway (Port 8080)
cd microservices/api-gateway
mvn spring-boot:run
```
