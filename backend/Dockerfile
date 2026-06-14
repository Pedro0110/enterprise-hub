# Multi-stage Dockerfile for building and running the Spring Boot application
# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy maven files and download dependencies first for caching
COPY pom.xml mvnw mvnw.cmd /workspace/

# copy sources
COPY src ./src

# package the application (skip tests by default in image build)
RUN mvn -B -DskipTests package

# The spring-boot-maven-plugin is configured to exclude log4j-to-slf4j at build time,
# so there's no need for manual WAR repackaging here.

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built artifact from the build stage. The project packages as a war.
COPY --from=build /workspace/target/enterprise-hub-0.0.1-SNAPSHOT.war ./enterprise-hub.war



EXPOSE 8080

# Java options can be provided at runtime via environment variables
ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["java","-jar","/app/enterprise-hub.war"]




