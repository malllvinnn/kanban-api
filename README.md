<p align="center">
  <a href="https://malv-store.my.id" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Malvin Logo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/author-Muhammad%20Malfin-blueviolet" />
  <img src="https://img.shields.io/badge/framework-nestjs-red" />
  <img src="https://img.shields.io/badge/deployment-docker-green" />
  <img src="https://img.shields.io/badge/type-REST%20API-blue" />
  <img src="https://img.shields.io/badge/license-MIT-yellow" />
</p>

## 📌 Overview

Kanban Tasks API is a backend service designed to handle task management in a simple Kanban-style board (e.g., TODO, IN_PROGRESS, DONE). It supports user registration and login using JWT authentication, and provides secure CRUD endpoints for managing tasks.

This project was developed as part of my personal learning journey to explore backend development using NestJS, TypeORM, and Docker. It helped me practice structuring modular APIs, implementing authentication, and deploying services in a containerized environment.
## 🚀 Features

- 🔐 JWT-based user authentication
- ✅ CRUD operations for tasks
- 📊 Update task statuses (TODO → DONE)
- 🔄 Filter and retrieve task details
- 🧩 Built with modular NestJS architecture
## 🧰 Tech Stack

- **NestJS** – Backend framework
- **TypeORM** – ORM for PostgreSQL
- **PostgreSQL** – Relational database
- **JWT** – Authentication system
- **Docker** – Containerized deployment
## 🛠️ Installation

### 1. Clone repo
```bash
git clone https://github.com/your-username/kanban-be.git
cd kanban-be
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env
**Isi file .env (contoh):**
```env
# App
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=kanban-be
JWT_ALGORITHM=HS256
JWR_EXPIRES=1h
JWT_AUDIENCE=kanban-be
JWT_ISSUER=kanban-be

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=kanban-be
DATABASE_PASSWORD=Yourpassword1
DATABASE_DATABASE=kanban-be
```
> 💡 **Note:** Adjust to your development environment
## 🐳 Run with Docker
```yml
docker compose up --build -d
```
Docker Compose akan mengatur backend beserta database PostgreSQL secara otomatis.
> ⚠️ **Warning:** Check terlebih dahulu docker-compose ini dan pastikan bisa untuk membaca file .env

## 📦 Run with Docker Image (GHCR)
If you prefer not to build the image manually, you can use the prebuilt Docker image available on GitHub Container Registry:
### 1. Pull Docker Images from Registry
```bash
docker pull ghcr.io/malllvinnn/kanban-be_service:v0.2.0
```
### 2. Create a new Directory
```bash
mkdir kanban-be-docker && cd kanban-be-docker
```
### 3. Create a .env file
```env
# App
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
JWR_EXPIRES=1h
JWT_AUDIENCE=kanban-be
JWT_ISSUER=kanban-be

# Database
DATABASE_HOST=kanban_be_postgres
DATABASE_PORT=5432
DATABASE_USERNAME=kanban-be
DATABASE_PASSWORD=Yourpassword1
DATABASE_DATABASE=kanban-be
```
> 💡 **Note:** Adjust to your development environment
### 4. Create a docker-compose file
```yaml
services:
  kanban_service:
    container_name: kanban_service
    image: ghcr.io/malllvinnn/kanban-be_service:v0.2.0
    ports:
      - '3000:3000'
    env_file:
      - .env
    depends_on:
      - kanban_be_postgres

  kanban_be_postgres:
    container_name: kanban_be_postgres
    image: postgres:latest
    restart: on-failure
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: ${DATABASE_DATABASE}
```
> 💡 **Note:** Make sure your .env file is present and correctly configured before running.
### 5. Running the container
```bash
docker compose up -d
```
## 📋 API Endpoints
### 🔐 Auth
- **`POST /users/register`** – Register a new user
- **`POST /users/login`** – Login and receive JWT
### 📌 Tasks
- **`GET /v1/tasks`** – Get all tasks
- **`GET /v1/tasks/:id`** – Get task by ID
- **`POST /v1/tasks`** – Create a new task
- **`PATCH /v1/tasks/:id`** – Update a task
- **`DELETE /v1/tasks/:id`** – Delete a task
## 🧪 Testing
To run tests, execute the following command:
```bash
npm run test:cov
```
> ⚠️ **Note:** Unit test coverage is currently around 50% and is expected to improve as testing progresses.

## 📎 Postman / HTTP Collection
You can test the API using:
- `Postman` Collection (optional to add)
- `.http` files in local dev tools (e.g., VS Code REST Client)
## 📚 Resources
- [NestJS Docs](https://docs.nestjs.com/)
- [TypeORM Docs](https://typeorm.io/)
## 📄 License

[MIT License](https://choosealicense.com/licenses/mit/)


## 👨‍💻 Author
**Muhammad Malfin**
- 📍 Semarang, Indonesia
- 📧 [malvin.arkade7@gmail.com]()
- 🔗 [Instagram](https://www.instagram.com/malllvinnn/) | [LinkedIn](https://www.linkedin.com/in/muhammad-malfin-8642241b8/)
