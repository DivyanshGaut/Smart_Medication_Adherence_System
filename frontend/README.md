# Elowen - Smart Medication Adherence Platform

A full-stack smart medication adherence platform featuring a **React + Vite** frontend and a **Java 17 + Spring Boot 3** backend with an **H2 database** and **JWT authentication**.

---

## 🚀 Architecture Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite.
  - Proxy configured in [vite.config.ts](file:///c:/Users/gdivy/Downloads/Smart%20Medication%20Adherence%20Dashboard/vite.config.ts) forwarding `/api` and `/h2-console` to the Spring Boot server.
  - Live client service in [src/api.ts](file:///c:/Users/gdivy/Downloads/Smart%20Medication%20Adherence%20Dashboard/src/api.ts).
  - Main connected UI in [src/App.tsx](file:///c:/Users/gdivy/Downloads/Smart%20Medication%20Adherence%20Dashboard/src/App.tsx).
- **Backend**: Spring Boot 3.2.5, Java 17, Spring Security with JJWT 0.12.5, Spring Data JPA, Hibernate ORM.
  - Located in the [`backend/`](file:///c:/Users/gdivy/Downloads/Smart%20Medication%20Adherence%20Dashboard/backend/) directory.
- **Database**: H2 Database with file persistence (`./data/adherence_db`).
  - Web console enabled at [http://localhost:8080/h2-console](http://localhost:8080/h2-console).
  - Pre-seeded with sample user, medications, 30 days of dose history, routines, and care circle members upon initial boot.

---

## 🔑 Demo Account Credentials

| Email | Password | Role |
|---|---|---|
| `alex@example.com` | `password123` | Demo Patient (Alex Morgan) |

*You can also click **"Sign in with Google (Demo)"** or switch to **"Create account"** to register a new user.*

---

## 🛠️ How to Run

### 1. Spring Boot Backend
The backend runs on **port 8080**.

```bash
# Navigate to backend directory
cd backend

# Option A: Run using Maven
mvn spring-boot:run

# Option B: Run the packaged jar directly
java -jar target/elowen-backend-0.0.1-SNAPSHOT.jar
```

### 2. Frontend Development Server
The frontend runs via Vite on **port 8443** (or `$PORT`):

```bash
npm run dev
# or
pnpm dev
```

---

## 🗄️ H2 Database Web Console

- **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:file:./data/adherence_db`
- **Driver Class**: `org.h2.Driver`
- **Username**: `sa`
- **Password**: *(empty)*

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account with hashed BCrypt password.
- `POST /api/auth/login` - Authenticate with email/password and obtain JWT Bearer token.
- `POST /api/auth/google` - One-click demo OAuth sign-in.
- `GET /api/auth/me` - Retrieve authenticated user profile with valid Bearer token.

### 📊 Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/overview` - Real-time computed adherence KPIs, streak tracking, today's schedule, score ring breakdown, 7-day trend chart, and 5-week consistency heatmap.

### 💊 Medications (`/api/medications`)
- `GET /api/medications` - Retrieve all medications for the authenticated user.
- `POST /api/medications` - Add a new medication (name, dosage, pill count, schedule time, etc.).
- `PUT /api/medications/{id}` - Update medication dosage or inventory.
- `DELETE /api/medications/{id}` - Delete medication.

### ⏱️ Doses & Action Logs (`/api/doses`)
- `POST /api/doses/action` - Record taking a dose (`TAKEN`), snoozing (`SNOOZED`), or missing (`MISSED`). Automatically decrements remaining pills in the database.
- `GET /api/doses/today` - Retrieve today's dose logs.
- `GET /api/doses/history` - Complete chronological history of dose confirmations.

### 🗓️ Schedules & NLP Engine (`/api/schedules`)
- `GET /api/schedules` - List all recurring routines.
- `POST /api/schedules` - Create a new routine schedule.
- `DELETE /api/schedules/{id}` - Remove a schedule.
- `POST /api/schedules/natural-language` - **Natural Language AI Scheduler**: Parses phrases like `"Remind me to take Metformin with dinner every weekday at 7:30 PM"` and automatically registers the schedule.

### 👥 Care Circle (`/api/care-circle`)
- `GET /api/care-circle` - List active caregivers, clinicians, and family members.
- `POST /api/care-circle` - Invite new caregiver with designated alert level.
- `DELETE /api/care-circle/{id}` - Revoke caregiver access.

### 💡 Insights & AI Coach (`/api/insights`)
- `GET /api/insights` - Adherence statistics, best adherence days, attention areas, and medication rankings.
- `POST /api/insights/refresh` - Recompute recommendations based on recent dose patterns.

### ⚙️ User Settings (`/api/user`)
- `GET /api/user/profile` - Current user details.
- `PUT /api/user/profile` - Update full name, email, or timezone.
- `PUT /api/user/notifications` - Update push reminders, weekly reports, and caregiver alerts.
