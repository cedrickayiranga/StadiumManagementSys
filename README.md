🏟️ Stadium Management System

> Full-stack web application for managing stadium events, ticket bookings, and attendee records at **Amahoro National Stadium, Kigali, Rwanda**.

**Course:** Best Programming Practices and Design Patterns (SENG 8240)  
**Institution:** Adventist University of Central Africa (AUCA)  
**Student:** Cedric Kayiranga | **ID:** 26489  
**Instructor:** Rutarindwa Jean Pierre | **Academic Year:** 2025–2026

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Diagrams](#Diagrams)
  - [Prerequisites](#prerequisites)
  - [Run with Docker](#run-with-docker)
  - [Run Locally (Without Docker)](#run-locally-without-docker)
- [API Endpoints](#api-endpoints)
- [Design Patterns](#design-patterns)
- [Features](#features)
- [Test Plan](#test-plan)

---

## 📌 Project Overview

The Stadium Management System (SMS) is a full-stack web application that digitises all core operations of Amahoro National Stadium — from event creation and ticket booking to admin reporting and user management.

**Problems it solves:**
- Manual paper-based ticketing causing long queues and duplicate tickets
- No real-time tracking of seat availability per section
- No role-based access control for staff and admin operations
- No digital ticket history for customers
- Revenue loss from untracked bookings and scalping

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Spring Boot 3 (Java 17) |
| Database | PostgreSQL 15 |
| Authentication | Spring Security + JWT |
| Containerisation | Docker + docker-compose |
| Version Control | Git + GitHub |
| Design Pattern | Repository Pattern + MVC |
StadiumManagementSys/
├── Backend/
│   └── stadiumManagement/
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       │   └── rw/ac/auca/stadiumms/
│       │       │       ├── controller/
│       │       │       ├── service/
│       │       │       ├── repository/
│       │       │       ├── entity/
│       │       │       └── security/
│       │       └── resources/
│       │           ├── application.properties
│       │           └── data.sql
│       ├── pom.xml
│       └── Dockerfile
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── BookingCard.jsx
│   │   │   ├── TicketCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── MyTicketsPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── testplan.md
└── README.md

---

## Diagrams
<img width="767" height="1389" alt="Use case diagram " src="https://github.com/user-attachments/assets/60d8dd20-0d86-4a64-9354-2a474c2ab5b9" />
<img width="589" height="1066" alt="Class diagram" src="https://github.com/user-attachments/assets/9dcce2f8-3355-4d9d-aba2-445632ce1e6c" />
<img width="735" height="1182" alt="Activity Diagram " src="https://github.com/user-attachments/assets/53686377-6754-4bb7-af57-bf356d1e07ae" />

<img width="1488" height="927" alt="Sequence Diagram " src="https://github.com/user-attachments/assets/5685ca28-670e-4b01-8783-04b3c781c6cb" />

<img width="1326" height="1034" alt="Component diagram " src="https://github.com/user-attachments/assets/5d052c09-c775-4687-bbd6-488cccc41223" />
## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- OR for local dev: Java 17+, Node.js 20+, PostgreSQL 15

---

### Run with Docker

This is the recommended way. One command starts everything:

```bash
git clone https://github.com/cedrickayiranga/StadiumManagementSys.git
cd StadiumManagementSys
docker-compose up --build
```

Then open:
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Database | localhost:5432 |

To stop:
```bash
docker-compose down
```

To stop and delete all data:
```bash
docker-compose down -v
```

---

### Run Locally (Without Docker)

**Backend:**
```bash
cd Backend/stadiumManagement
./mvnw spring-boot:run
```

Make sure PostgreSQL is running locally with:
- Database: `stadium_db`
- Username: `postgres`
- Password: `postgres`

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login — returns JWT token |
| POST | `/api/users/save` | Register new user |

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations/all` | Get all locations |
| GET | `/api/locations/provinces` | Get provinces only |
| POST | `/api/locations/parent` | Create province |

### Stadiums
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stadiums/all` | Get all stadiums |
| POST | `/api/stadiums/save` | Create stadium |
| DELETE | `/api/stadiums/delete/{id}` | Delete stadium |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/all` | Get all events |
| GET | `/api/events/{id}` | Get event by ID |
| GET | `/api/events/search?name=` | Search events by name |
| POST | `/api/events/save` | Create event |
| DELETE | `/api/events/delete/{id}` | Delete event |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/all` | Get all bookings (Admin) |
| GET | `/api/bookings/by-user/{id}` | Get bookings by user |
| POST | `/api/bookings/save` | Create booking |
| DELETE | `/api/bookings/delete/{id}` | Delete booking |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets/all` | Get all tickets |
| GET | `/api/tickets/by-booking/{id}` | Get tickets by booking |
| POST | `/api/tickets/save` | Create ticket |
| DELETE | `/api/tickets/delete/{id}` | Delete ticket |

---

## 🎨 Design Patterns

### 1. Repository Pattern
Every entity has a dedicated repository interface extending `JpaRepository<T, ID>`. The Service layer depends only on these interfaces — never on concrete database implementations. This means:
- Services can be unit tested by mocking repositories
- The database engine can be swapped without changing business logic

### 2. MVC Pattern
- **Model** — JPA Entity classes (User, Event, Booking, Ticket, Stadium, Location)
- **View** — React page components (EventsPage, BookingPage, AdminPage)
- **Controller** — Spring Boot REST Controllers that receive HTTP requests and return JSON

---

## ✨ Features

**Customer:**
- Register and login with JWT authentication
- Browse and search all upcoming events
- Filter events by category, availability, date
- Interactive stadium seating map with section selection
- Book tickets with live order summary and total calculation
- View digital tickets with unique reference codes (AMA-YEAR-XXXXX)

**Admin:**
- Role-protected dashboard (ADMIN role only)
- KPI overview: active events, tickets sold, revenue, registered users
- Full CRUD management for Events, Stadiums, Bookings, Tickets, Users
- Recent bookings panel and tickets-by-event bar chart

**Security:**
- JWT token authentication on all protected endpoints
- Role-based access control (ADMIN / CUSTOMER / STAFF)
- Protected React routes redirect unauthenticated users to login
- Admin routes redirect non-admin users to home

---

## 🧪 Test Plan

See [testplan.md](./testplan.md) for the full software test plan including:
- 26 test cases covering all API endpoints
- Frontend auth and routing tests
- Docker deployment tests
- Tools: Postman, Browser DevTools, React DevTools, Docker Desktop

---

## 👤 Default Login Credentials (Seeded Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@amahoro.rw | password123 |
| Customer | cedric@amahoro.rw | password123 |

---

## 📄 License

This project was developed for academic purposes at the Adventist University of Central Africa (AUCA), Faculty of Information Technology, Department of Software Engineering.
---

## 📁 Project Structure
