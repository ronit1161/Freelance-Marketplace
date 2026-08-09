# Netflix Eureka Discovery Server (`discovery-server`) — Freelance Marketplace

## 1. Overview & Role
The **Discovery Server** is the central service registry for our Freelance Marketplace microservices ecosystem. It runs on port `8761` using **Spring Cloud Netflix Eureka Server**.

```
                             +-----------------------+
                             |     Eureka Server     |
                             |   (discovery-server)  |
                             |         :8761         |
                             +-----------+-----------+
                                         ▲
                                         │ Dynamic Heartbeats & Registry
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
            +-------+-------+    +-------+-------+    +-------+-------+
            |  API Gateway  |    |  Auth Service |    |  User Service |
            |     :8080     |    |     :8081     |    |     :8082     |
            +---------------+    +---------------+    +---------------+
```

---

## 2. Why Eureka? (Core Interview Concept)

### Problem Without Eureka:
- Microservices would have to communicate using **hardcoded IP addresses and ports** (e.g. `http://192.168.1.15:8081`).
- If an instance restarts on a new IP/port or multiple instances are spawned for scaling, the API Gateway would fail without manual configuration changes.

### Solution With Eureka:
1. **Self-Registration**: Microservices announce their presence (`AUTH-SERVICE`, `USER-SERVICE`, `GIG-SERVICE`) to Eureka at startup.
2. **Dynamic Discovery**: API Gateway queries Eureka using logical service names (`lb://AUTH-SERVICE`) instead of fixed IPs.
3. **Health Monitoring**: Services send periodic heartbeats every 30s. If a service crashes, Eureka automatically removes it from the routing table.

---

## 3. Server Configuration Breakdown (`application.yml`)

```yaml
server:
  port: 8761

spring:
  application:
    name: discovery-server

eureka:
  instance:
    hostname: localhost
  client:
    # A standalone Eureka Server should not register with itself
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

### Key Settings Explained:
* `register-with-eureka: false` — Tells Eureka not to register itself as a client service.
* `fetch-registry: false` — Tells the server not to try fetching an external registry since it is the master registry.
* `defaultZone` — The endpoint where all client microservices publish their heartbeat metadata.

---

## 4. How to Run & Verify Locally

### Step 1: Start Discovery Server
From the root or `microservices/discovery-server` directory:
```bash
cd microservices/discovery-server
mvn spring-boot:run
```

### Step 2: Access the Eureka Dashboard
Open your web browser and navigate to:
👉 **`http://localhost:8761`**

### Step 3: Verify Registered Instances
Once other services (`auth-service`, `user-service`, `api-gateway`) start, you will see them listed in the **"Instances currently registered with Eureka"** table:

| Application | AMIs | Availability Zones | Status |
| :--- | :--- | :--- | :--- |
| **API-GATEWAY** | n/a | (1) | **UP** (1) - `192.168.1.5:api-gateway:8080` |
| **AUTH-SERVICE** | n/a | (1) | **UP** (1) - `192.168.1.5:auth-service:8081` |
| **USER-SERVICE** | n/a | (1) | **UP** (1) - `192.168.1.5:user-service:8082` |

---

## 5. Connecting Microservices to Eureka

In every client microservice (`application.yml`), simply add:
```yaml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://localhost:8761/eureka/}
  instance:
    prefer-ip-address: true
```
