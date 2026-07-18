# 🏪 Sharabia Store — E-Commerce Platform

A premium, production-ready kitchenware e-commerce platform. It features a modern, responsive Arabic storefront, customer user accounts (registration, login, profile, and order history), a global cart system, cash-on-delivery checkouts routed to WhatsApp, and a secure administrator control panel for managing the product catalog and tracking orders.

---

## 🏗️ Architectural Overview

The application is structured as a decoupled monorepo:

1.  **Frontend (`/frontend`)**: A React (v18) Single Page Application initialized via Vite. Styled with Tailwind CSS v4, custom composite components, Cairo font, and Lucide icons.
2.  **Backend (`/backend`)**: A Node.js & Express.js REST API with mongoose ODM, connection caching for serverless environments, rate-limiting, CORS control, NoSQL query sanitization, and Zod validator middleware.
3.  **Database**: MongoDB Atlas cloud cluster (with local fallback for offline development).

---

## 🌟 Key Features

### 👤 Customer User Accounts
*   **Authentication**: Secure JWT-based customer registration (`POST /api/auth/register`) and login (`POST /api/auth/login`).
*   **User Profile**: Sleek profile page where customers can update their name, email, phone number, default shipping address, and password.
*   **Checkout Autofill**: If a customer is logged in, the checkout form auto-fills their shipping details (name, phone, address) to accelerate ordering.
*   **Order History**: Interactive, collapsible order logs in the user profile showing statuses (`Awaiting approval`, `Processing`, `Shipped`, `Delivered`, `Succeeded`, `Failed`), shipping parameters, and purchased items.

### 📦 Storefront & Cart
*   **Product Listings**: Beautiful Arabic-first design with price filtering, product sorting, and interactive search.
*   **Categories**: Strictly limited to three main groups: **بلدي** (Traditional cookware), **اطقم** (Cookware Sets), and **رفايع** (Kitchen Accessories).
*   **Shopping Cart**: Persisted in the browser's local storage and synced automatically.

### ⚙️ Order Approval & Operations Flow
1.  **Order Placement**: When a customer checkout is initiated, the order is saved in the database under a **`pending_approval`** (Awaiting approval) status.
2.  **Admin WhatsApp Coordination**: Admins do not process payments online. Instead, the Admin Dashboard provides a **Contact via WhatsApp** shortcut that triggers a pre-filled chat with the customer to coordinate payment outside the platform.
3.  **Order Decisions**: After contacting the customer, the admin can update the order status directly from the Admin Dashboard:
    *   **Approve Order**: Updates the order status to `processing` (Approved & preparing).
    *   **Succeeded (Succeeded)**: Marks the order as completed successfully and changes `paymentStatus` to `paid`.
    *   **Failed (Failed / Cancelled)**: Rejects or cancels the order and changes `paymentStatus` to `failed`.

---

## 🔐 Seeded Test Accounts

The database seed script generates the following test accounts:

### 👑 Administrator Account
*   **Email**: `admin@sharabia.com`
*   **Password**: `123456`

### 👥 Customer Accounts
All customer accounts share the password `123456`.

| Name | Email | Phone | Default Address |
| :--- | :--- | :--- | :--- |
| **أحمد محمد** | `ahmed@gmail.com` | `01090600301` | القاهرة، مصر الجديدة |
| **سارة علي** | `sara@gmail.com` | `01123456789` | الجيزة، الدقي |
| **محمود حسين** | `mahmoud@gmail.com` | `01222233344` | الإسكندرية، سموحة |
| **ياسمين مصطفى** | `yasmin@gmail.com` | `01511223344` | القليوبية، بنها |

---

## ⚙️ Environment Variables Setup

Create `.env` configuration files in both subdirectories before launching:

### Backend Configuration (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Development Setup

To run both services locally, follow these steps:

### 1. Database Seeding
Navigate to `/backend` and populate the database with the admin, customer accounts, products, and mock orders:
```bash
cd backend
npm install
npm run seed
```

### 2. Run the Backend API Server
Start the Express server with Nodemon (auto-reloads on file changes):
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Run the Frontend Storefront
Navigate to `/frontend`, install packages, and start the Vite dev server:
```bash
cd ../frontend
npm install
npm run dev
```
The storefront will run on `http://localhost:5173`. Open this URL in your browser to test.

---

## ☁️ Production Deployment (Vercel & Atlas)

### MongoDB Atlas Setup
Your cluster is fully configured. The seed script and backend routes are integrated with `MONGODB_URI` connection strings to Atlas.

### Vercel Serverless Deployment
*   **Backend Deployment**:
    *   Deploy the `/backend` folder as a serverless Node.js project on Vercel.
    *   Configure Vercel project environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
    *   *Note*: The backend already includes `vercel.json` routing rules mapping all pathways to our serverless Express handler.
*   **Frontend Deployment**:
    *   Deploy the `/frontend` folder to Vercel as a static Single Page Application.
    *   Set `VITE_API_URL` to point to your deployed backend Vercel domain (e.g., `https://your-backend-api.vercel.app/api`).
    *   Configure Vercel build settings: Build Command `npm run build` and Output Directory `dist`.
