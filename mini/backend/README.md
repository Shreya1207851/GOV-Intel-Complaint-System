# Complaint Governance Backend

Production-ready Node.js/Express backend for the AI-driven Complaint Governance System.

## Stack
- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- bcrypt password hashing
- express-validator input validation

## Setup
1. Install dependencies
   ```bash
   # From the parent directory that contains both frontend/ and backend/
   cd backend
   npm install
   ```
2. Configure environment
   ```bash
   cp .env .env.local # or edit .env directly
   ```
   Set values:
   - `MONGO_URI=your_mongodb_url`
   - `JWT_SECRET=your_secret`
   - `PORT=5000`
3. Run in development
   ```bash
   npm run dev
   ```
4. Production start
   ```bash
   npm start
   ```

## API Overview
- Auth
  - POST `/api/auth/register`
  - POST `/api/auth/login`
- Complaints
  - POST `/api/complaints` (citizen)
  - GET `/api/complaints/department` (department/admin)
  - PUT `/api/complaints/:id/status` (department/admin)
  - PUT `/api/complaints/:id/assign` (department/admin)
- Members
  - POST `/api/members` (department/admin)
  - GET `/api/members` (department/admin)

## Roles & Isolation
- Departments only see complaints where `category` matches their department.
- Members belong to a single department; assignment enforces department match.

## Health Check
- GET `/health`

## Notes
- Uses modular architecture in `src/`.
- Errors return JSON with appropriate HTTP status codes.
