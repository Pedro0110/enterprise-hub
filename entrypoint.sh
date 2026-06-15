#!/bin/sh
set -e

echo "=== Iniciando Backend (Spring Boot) ==="
cd /app/backend
mvn spring-boot:run \
  -Dspring-boot.run.arguments="\
    --spring.datasource.url=${SPRING_DATASOURCE_URL} \
    --spring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    --spring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    --spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect" &

echo "=== Iniciando Frontend (Angular) ==="
cd /app/frontend
npm start &

wait -n