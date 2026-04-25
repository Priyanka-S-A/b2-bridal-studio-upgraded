# Luxury Beauty Parlor Management System

A comprehensive, full-stack management system designed for a luxury beauty parlor. This application features a premium gold, black, and white design theme. It includes a public-facing website for showcasing services, courses, and products, along with a secure, role-based backend for administrative management.

## Features

### Public Website
*   **Premium Design:** A modern, visually stunning user interface with a luxury aesthetic (Gold, Black, White).
*   **Service Catalog:** Browse available beauty services, treatments, and pricing.
*   **Course Enrollment:** View details and enroll in beauty and wellness courses.
*   **Product Store:** Explore and purchase premium beauty products.
*   **WhatsApp Integration:** Seamless billing and enrollment flow directly integrated with WhatsApp.

### Admin/Owner Panel
*   **Role-Based Access Control:** Secure login for Admins and Owners with distinct permissions.
*   **Staff Management:** Add, edit, and manage staff members and their schedules.
*   **Inventory Tracking:** Keep track of product stock levels, usage, and reordering needs.
*   **Revenue & Analytics:** View business operations, track revenue, and monitor performance.

## Tech Stack

### Frontend
*   **Framework:** React 19
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS 4
*   **Routing:** React Router DOM
*   **Icons:** Lucide React
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express 5
*   **Database:** MongoDB with Mongoose
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Environment Variables:** dotenv
*   **Middleware:** CORS

## Project Structure

The repository is divided into two main directories:
*   `frontend/`: Contains the React application.
*   `backend/`: Contains the Express server and API logic.

## Easy Setup (Run Everything Together)

We have created a single command system that installs and runs both the Frontend and the Backend at the same time!

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB instance (local or Atlas)

### Step 1: Install Dependencies
Open a terminal in the **root** of the project (`beauty-parlor`) and run:
```powershell
npm run install:all
```
*(This will automatically install both frontend and backend packages.)*

### Step 2: Configure Environment
Create a file named `.env` inside the `backend` folder and add your configuration variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beauty_parlor
JWT_SECRET=your_super_secret_jwt_key
```

### Step 3: Start the Application
In the **root** directory of the project (`beauty-parlor`), run:
```powershell
npm start
```
*(This will start both the backend server and the frontend application concurrently. The Frontend will be available at `http://localhost:5173` and the Backend will be at `http://localhost:5000`)*

## Manual Setup Steps (Alternative)

If you prefer to start them manually in separate terminals:

### Backend (Terminal 1)
1. `cd backend`
2. `npm install`
3. `npm start`

### Frontend (Terminal 2)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Development Notes

*   Ensure that CORS is properly configured in the backend to allow requests from the frontend development server.

## License
This project is licensed under the ISC License.
