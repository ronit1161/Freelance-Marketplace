# ==============================================================================
# API Gateway (Spring Cloud Gateway) - Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build JAR using Maven
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml .
COPY api-gateway api-gateway

RUN mvn clean package -f api-gateway/pom.xml -DskipTests

# Stage 2: Slim Java Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /build/api-gateway/target/*.jar app.jar

ENV JAVA_OPTS="-Xms64m -Xmx192m"
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
