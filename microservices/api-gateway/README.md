# API Gateway (`api-gateway`)

## Overview
Spring Cloud Gateway serving as the single entry point for all client web/mobile traffic. Integrated with Netflix Eureka for dynamic service location resolution.

## Stack
- Java 21
- Spring Boot 3.3.5
- Spring Cloud Gateway (WebFlux)
- Netflix Eureka Client

## Port
- `8080`

## Planned Routes
- `/api/v1/auth/**` -> `auth-service`
- `/api/v1/users/**` -> `user-service`
- `/api/v1/gigs/**` -> `gig-service`
- `/api/v1/orders/**` -> `order-service`
- `/api/v1/wallets/**` -> `wallet-service`
- `/api/v1/reviews/**` -> `review-service`
- `/api/v1/notifications/**` -> `notification-service`
