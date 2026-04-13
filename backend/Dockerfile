# Use Maven as a builder layer to strictly guarantee a clean build environment
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run the compiled jar in a clean, lightweight image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Explicitly expose port 8080 required by Spring Boot and cloud routing
EXPOSE 8080

# Environment variables to be superseded by Render variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
