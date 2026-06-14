Docker Quickstart (development)

Prerequisites
- Docker and Docker Compose installed

Build and run with Docker Compose

From the `backend` folder run:

```powershell
docker compose up --build
```

This will:
- Start a Postgres container (postgres:latest) with database `enterprise-hub` and user/password `postgres`.
- Build the application image using the provided `Dockerfile` and run it mapped to port 8080.

Environment
- The compose file sets `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` so the app connects to the Postgres container.

Notes
- The Dockerfile uses a multi-stage build (Maven build stage and runtime stage) and packages the war produced by Maven.
- For production images you should enable tests in the build and tune JVM options.

