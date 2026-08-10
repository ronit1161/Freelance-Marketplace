# ==============================================================================
# Discovery Server (Eureka Server) - Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build JAR using Maven
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml .
COPY discovery-server discovery-server

RUN mvn clean package -f discovery-server/pom.xml -DskipTests

# Stage 2: Slim Java Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /build/discovery-server/target/*.jar app.jar

ENV JAVA_OPTS="-Xms64m -Xmx192m"
EXPOSE 8761

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
