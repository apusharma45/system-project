# MedFlow

MedFlow is a healthcare workflow management system for patients, doctors, diagnostic centers, pharmacies, and administrators. It supports appointment booking, role-based dashboards, lab orders, prescription workflows, notifications, audit logs, and document uploads.

## Project Structure

```text
.
|-- backend/           # NestJS API, Prisma, PostgreSQL integration
|-- frontend-web/      # React + Vite web application
|-- frontend_mobile/   # Flutter mobile application
|-- compose.yml        # Local PostgreSQL and Adminer services
|-- images/            # Project images and assets
`-- report/            # Project report files
```

## Tech Stack

- Backend: NestJS, Prisma, PostgreSQL, JWT authentication, Socket.IO
- Web: React, TypeScript, Vite, React Query
- Mobile: Flutter, Dart
- Storage: Cloudinary for uploaded files
- Testing: Jest, Supertest, Vitest, Flutter test

## Prerequisites

- Node.js and npm
- Flutter SDK
- Docker Desktop
- PostgreSQL client tools, optional

## Environment Variables

Create a `.env` file inside `backend/`:

```env
DATABASE_URL="postgresql://medflow_user:password123@localhost:5433/medflow"
JWT_SECRET="replace-with-a-secure-secret"
FRONTEND_ORIGIN="http://localhost:5173"
PORT=3000

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

MAIL_PROVIDER="resend"
RESEND_API_KEY=""
MAIL_FROM="MedFlow <no-reply@example.com>"
```

Create a `.env` file inside `frontend-web/` if the API URL is different from the default:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

## Local Setup

Start the database:

```bash
docker compose -f compose.yml up -d
```

Install and run the backend:

```bash
cd backend
npm install
npm run prisma:generate
npx prisma migrate dev
npm run start:dev
```

Install and run the web app:

```bash
cd frontend-web
npm install
npm run dev
```

Run the mobile app:

```bash
cd frontend_mobile
flutter pub get
flutter run --dart-define=APP_API_BASE_URL=http://10.0.2.2:3000 --dart-define=APP_WS_BASE_URL=ws://10.0.2.2:3000
```

For a physical mobile device, replace `10.0.2.2` with the development machine's local network IP address.

## Useful Commands

Backend:

```bash
cd backend
npm run build
npm run test
npm run test:e2e
npm run lint
npm run db:seed
```

Web:

```bash
cd frontend-web
npm run build
npm run test
npm run lint
```

Mobile:

```bash
cd frontend_mobile
flutter test
flutter analyze
```

## Key Features

- JWT-based authentication
- Role-based access control for patient, doctor, diagnostic, pharmacy, and admin users
- Appointment lifecycle management
- Lab order and lab report workflow
- Prescription generation, signing, delivery, and dispensing
- Real-time and persistent notifications
- Audit logging for important workflow actions
- Profile and avatar management

## Database Tools

Adminer is available after starting Docker Compose:

```text
http://localhost:8080
```

Default local database credentials:

```text
System: PostgreSQL
Server: postgres
Database: medflow
Username: medflow_user
Password: password123
```

## License

This project is licensed under the terms included in the `LICENSE` file.
