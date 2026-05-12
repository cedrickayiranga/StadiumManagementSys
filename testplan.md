# Software Test Plan — Stadium Management System
**Course:** Best Programming Practices and Design Patterns  
**Institution:** Adventist University of Central Africa (AUCA)  
**Department:** Software Engineering  

## 1. Introduction
The Stadium Management System is a full-stack web application for managing stadium events,
bookings, and ticketing at Amahoro Stadium, Kigali Rwanda. This test plan defines the
testing strategy, scope, and test cases to verify the system works correctly.

## 2. Scope
Testing covers:
- All REST API endpoints (Spring Boot backend)
- Frontend user flows (React)
- Authentication and role-based access control
- Booking and ticket generation flow
- Admin dashboard operations

## 3. Test Items
1. Location API (Province/District hierarchy)
2. User API (CRUD + authentication)
3. User Profile API
4. Stadium API
5. Event API
6. Booking API
7. Ticket API
8. Frontend Auth Flow
9. Frontend Booking Flow
10. Admin Dashboard

## 4. Test Cases

| Test ID | Feature | Method | Endpoint | Input | Expected Output | Status |
|---------|---------|--------|----------|-------|-----------------|--------|
| TC01 | Create Province | POST | /api/locations/parent | {name:"Kigali City", code:"KGL"} | 201 Created, location object | Pass |
| TC02 | Get All Locations | GET | /api/locations/all | none | 200, array of locations | Pass |
| TC03 | Get Provinces | GET | /api/locations/provinces | none | 200, top-level locations only | Pass |
| TC04 | Create User | POST | /api/users/save | {name, email, password, role:"CUSTOMER"} | 201 Created, user object | Pass |
| TC05 | Get User by ID | GET | /api/users/{id} | valid id | 200, user object | Pass |
| TC06 | Get Users by Province | GET | /api/users/by-province-name?name=Kigali City | none | 200, filtered users | Pass |
| TC07 | Create Stadium | POST | /api/stadiums/save | {name:"Amahoro", capacity:60000} | 201 Created | Pass |
| TC08 | Create Event | POST | /api/events/save | {name, date, stadium:{id:1}} | 201 Created, event object | Pass |
| TC09 | Search Events by Name | GET | /api/events/search?name=Amavubi | none | 200, matching events | Pass |
| TC10 | Get Paginated Events | GET | /api/events/paginated?page=0&size=5 | none | 200, paginated response | Pass |
| TC11 | Create Booking | POST | /api/bookings/save | {user:{id:1}, event:{id:1}} | 201 Created, booking object | Pass |
| TC12 | Duplicate Booking Prevention | POST | /api/bookings/save | same user+event again | 409 Conflict or error | Pass |
| TC13 | Get Bookings by User | GET | /api/bookings/by-user/1 | none | 200, user's bookings | Pass |
| TC14 | Create Ticket | POST | /api/tickets/save | {booking:{id:1}, event:{id:1}} | 201 Created | Pass |
| TC15 | Get Tickets by Booking | GET | /api/tickets/by-booking/1 | none | 200, tickets list | Pass |
| TC16 | Delete Event | DELETE | /api/events/delete/{id} | valid id | 200 or 204 success | Pass |
| TC17 | Login with valid credentials | POST | /api/auth/login | {email, password} | 200, JWT token + user | Pass |
| TC18 | Login with wrong password | POST | /api/auth/login | {email, wrongPassword} | 401 Unauthorized | Pass |
| TC19 | Access /admin as CUSTOMER | Frontend route | /admin | logged in as CUSTOMER | Redirect to / | Pass |
| TC20 | Access protected route unauthenticated | Frontend route | /my-tickets | no token | Redirect to /login | Pass |

## 5. Testing Tools
- **Postman:** API endpoint testing, collection of all 40+ endpoints
- **Browser DevTools:** Frontend network inspection, console errors
- **React DevTools:** Component state and context inspection

## 6. Pass/Fail Criteria
**Pass:** Response matches expected HTTP status code and response body structure  
**Fail:** Wrong status code, missing fields, server error 500, or incorrect data returned  
A feature is considered tested when all its related test cases pass.
