# Stadium Management System - Project Documentation & Viva Guide

## 1. Project Overview
This is a **Spring Boot** application built using **Java 17**, **Spring Data JPA**, and **PostgreSQL**. The project implements a complete management system for stadiums, events, bookings, and users with a complex hierarchical location system.

## 2. Architecture & Design Patterns
- **N-Tier Architecture**: 
  - **Controller Layer**: REST endpoints returning JSON responses.
  - **Service Layer**: Business logic, validations, and mapping.
  - **Repository Layer**: Data access using JpaRepository and custom JPQL.
  - **Domain Layer**: JPA Entities with UUID primary keys.
- **No Lombok Policy**: All getters, setters, and constructors are written explicitly to demonstrate POJO understanding.
- **Database Strategy**: Hibernate `ddl-auto=update` is used to automatically generate and maintain the PostgreSQL schema.

## 3. The Hierarchical Location System (Complex Logic)
Initially requested as a flat `Province` model, the system was upgraded to a hierarchical `Location` model.
- **ELocationType Enum**: Supports `PROVINCE`, `DISTRICT`, `SECTOR`, `CELL`, and `VILLAGE`.
- **Self-Referencing Entity**: The `Location` class has a `parent` field of type `Location`.
- **The "Province Query" Challenge**: To find all users in a Province when they are assigned to a Village, we implemented a complex JPQL query in `UserRepository.java`. It recursively checks up to 5 levels of parents to find the matching Province.

## 4. Entity Relationships
- **User ↔ Location**: `ManyToOne` (Users belong to a specific location level).
- **User ↔ UserProfile**: `OneToOne` (Detailed personal info).
- **User ↔ Event**: `ManyToMany` (Managed via `user_events` join table).
- **Stadium ↔ Event**: `OneToMany` (A stadium hosts multiple events).
- **Booking ↔ Ticket**: `OneToMany` (A booking can have multiple tickets).

## 5. Detailed Pagination & Sorting Guide
Pagination is implemented to handle large datasets efficiently. Instead of returning all records (which could crash the app if there are millions), we return small "pages".

### **How it works in Code:**
1. **Controller**: Receives `page`, `size`, and `sort` as `@RequestParam`.
2. **Service**: Creates a `Pageable` object: `PageRequest.of(page, size, Sort.by(sort))`.
3. **Repository**: Executes a SQL query with `LIMIT` and `OFFSET`.
4. **Response**: Returns a `Page<T>` object containing the data plus metadata (total elements, total pages, current page).

### **Postman Parameters:**
- `page`: The page number you want (starting from **0**).
- `size`: How many items per page (e.g., **5** or **10**).
- `sort`: The field name you want to sort by (e.g., **name**, **email**, **date**).

**Example Request:** `GET /api/users/paginated?page=0&size=5&sort=email`

---

## 6. Full Postman Testing Guide (All Endpoints)

### **Location Management**
- **Save Province**: `POST /api/locations/parent`
  ```json
  { "name": "Kigali", "code": "KGL", "type": "PROVINCE" }
  ```
- **Save District**: `POST /api/locations/child?parentCode=KGL`
  ```json
  { "name": "Nyarugenge", "code": "NYR", "type": "DISTRICT" }
  ```
- **Get All Locations**: `GET /api/locations/all`
- **Get Only Provinces**: `GET /api/locations/provinces`
- **Get Children of a Parent**: `GET /api/locations/parent/KGL`

### **User Management**
- **Save User**: `POST /api/users/save`
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "CUSTOMER",
    "location": { "id": "UUID-OF-LOCATION" }
  }
  ```
- **Get Users Paginated**: `GET /api/users/paginated?page=0&size=5&sort=name`
- **Search Users by Province Code**: `GET /api/users/by-province-code?code=KGL`
- **Search Users by Province Name**: `GET /api/users/by-province-name?name=Kigali`

### **Stadium & Event Management**
- **Save Stadium**: `POST /api/stadiums/save`
  ```json
  { "name": "Amahoro Stadium", "capacity": 25000, "location": "Remera" }
  ```
- **Save Event**: `POST /api/events/save`
  ```json
  {
    "name": "Local Cup",
    "date": "2026-05-20",
    "time": "15:00:00",
    "description": "Football match",
    "stadium": { "id": "UUID-OF-STADIUM" }
  }
  ```
- **Search Events (Paginated)**: `GET /api/events/search?name=cup&page=0&size=5`

### **Booking & Ticket Management**
- **Save Booking**: `POST /api/bookings/save`
  ```json
  {
    "bookingDate": "2026-03-08",
    "totalAmount": 5000,
    "status": "PENDING",
    "user": { "id": "UUID-OF-USER" },
    "event": { "id": "UUID-OF-EVENT" }
  }
  ```
- **Get Bookings by User**: `GET /api/bookings/by-user/{userId}`
- **Save Ticket**: `POST /api/tickets/save`
  ```json
  {
    "price": 1000,
    "status": "VALID",
    "booking": { "id": "UUID-OF-BOOKING" },
    "event": { "id": "UUID-OF-EVENT" }
  }
  ```

---

## 7. Viva Voce - Potential Questions & Answers
- **Q: Why use UUID instead of Long/Integer for IDs?**
  - **A**: UUIDs are globally unique, making them more secure (less predictable) and easier to merge across distributed systems.
- **Q: How does the location hierarchy work?**
  - **A**: It's a self-referencing relationship where each location points to its parent. A Province has no parent, while a District's parent is a Province.
- **Q: How do you handle validation in the service layer?**
  - **A**: Before saving, we check if related entities exist (e.g., checking if a Stadium exists before saving an Event) and ensure unique constraints (e.g., `existsByEmail`).

---

## 8. Final Compliance Checklist
- [x] Zero compilation errors.
- [x] No Lombok used anywhere.
- [x] Relationships properly mapped for PostgreSQL foreign keys.
- [x] All CRUD operations implemented.
- [x] Complex hierarchical queries functional.
- [x] Pagination & Sorting fully implemented.
