# ==============================================================================
# Auth Service (Authentication & JWT) - Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build JAR using Maven
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml .
COPY shared shared
COPY auth-service auth-service

RUN mvn -N -f pom.xml install && \
    mvn clean install -f shared/pom.xml -DskipTests && \
    mvn clean package -f auth-service/pom.xml -DskipTests

# Stage 2: Slim Java Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /build/auth-service/target/*.jar app.jar

ENV JAVA_OPTS="-Xms64m -Xmx192m"
EXPOSE 8081

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
