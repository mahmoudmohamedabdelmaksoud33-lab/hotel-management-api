# Hotel Management & Room Booking System (Backend API)

A robust, enterprise-ready backend RESTful API built with Node.js, Express, TypeScript, and PostgreSQL (TypeORM). This system is designed to handle hotel operations, user authentication, automated dynamic pricing (including weekend surge rates), room status management, and complete booking workflows from creation to check-out.

---

## Project Architecture & Directory Structure

The project follows a clean, modular architecture organized inside the `src` directory to maintain separation of concerns:

- **config/**: Contains database initialization and TypeORM configuration (`database.ts`).
- **constants/**: Stores global constants, application roles, and enums (`roles.ts`).
- **controllers/**: Contains the core business logic handlers for HTTP requests (`authController.ts`, `bookingController.ts`, `roomController.ts`).
- **dtos/**: Data Transfer Objects used for validating incoming request payloads (`auth.dto.ts`).
- **entities/**: TypeORM database models defining tables, columns, constraints, and relations (`booking.ts`, `room.ts`, `user.ts`).
- **middlewares/**: Custom Express middleware functions for JWT verification and role-based access control (`authMiddleware.ts`).
- **repositories/**: Custom database query handlers and repository extensions (`userRepository.ts`).
- **routes/**: Defines API endpoint routes and maps them to their respective controllers (`authRoutes.ts`, `bookingRoutes.ts`, `roomRoutes.ts`).
- **services/**: Handles underlying business logic operations, such as authentication processing (`authService.ts`).
- **utils/**: Helper functions and utilities, such as JWT token generation (`generateToken.ts`).
- **tests/**: Automated unit and integration testing files (`auth.test.ts`).

---

## Core Features & Workflow

1. **Authentication & Authorization**:
   - Secure user registration and login using bcrypt for password hashing and JSON Web Tokens (JWT) for session management.
   - Protected routes using custom authentication middleware.

2. **Automated Dynamic Pricing Engine**:
   - When creating a booking, the system loops through the stay duration day-by-day.
   - Automatically detects weekend rates for Thursdays and Fridays and applies the designated weekend price per night.

3. **Room Lifecycle Management**:
   - Rooms transition states automatically. When a room is booked, its status shifts from `AVAILABLE` to `BOOKED`.
   - Upon successful check-out, the room status automatically reverts back to `AVAILABLE` for future guests.

4. **Comprehensive Booking Workflows**:
   - Supports multiple payment methods (InstaPay, Vodafone Cash, Cash on Arrival) with reference tracking.
   - Tracks booking states (`PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).
   - Secure check-out endpoint that finalizes the stay and frees up the room.

---

## Getting Started & Installation

### Prerequisites

- Node.js installed on your machine
- PostgreSQL database instance (local or cloud-hosted via Neon)

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hotel-management-api
   Install dependencies:
   ```

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory based on .env.example and populate your credentials:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret_key
Run the Application:

Bash

# Development mode with hot-reload

npm run dev

# Production build and start

npm run build
npm start
API Endpoints Documentation

1. Authentication (/api/auth)
   POST /api/auth/register: Register a new user (Staff or Customer).

POST /api/auth/login: Authenticate user credentials and return a JWT access token.

2. Rooms (/api/rooms)
   GET /api/rooms: Retrieve a list of all hotel rooms and their current availability status.

POST /api/rooms: Add a new room to the system (Admin/Staff only).

3. Bookings & Workflows (/api/bookings)
   POST /api/bookings: Create a new booking (Automatically calculates dynamic pricing, sets initial status, and marks the room as BOOKED). Requires Bearer Token.

GET /api/bookings: Retrieve all system bookings with nested user and room relations. Requires Bearer Token.

PATCH /api/bookings/:id/checkout: Perform a check-out operation, update the booking status to CHECKED_OUT, and free up the room back to AVAILABLE. Requires Bearer Token.
