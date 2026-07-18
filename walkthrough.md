# Sharabia Store — Walkthrough & Implementation Report

A production-ready kitchenware e-commerce MVP has been built and configured. Both frontend and backend services are active and running locally on your system.

---

## 🏗️ Architectural Overview

### 1. Technology Stack
*   **Frontend:** React.js (v18.3.1) initialized with **Vite** for optimized build times and fast hot module replacement (HMR).
*   **Styling:** **Tailwind CSS v4** featuring the modern `@tailwindcss/vite` plugin (CSS-first config, zero config files), alongside customized compound components (Button, Input, Sheet, Card, etc.).
*   **State Management:** React Context API + `useReducer` for global cart state, synced automatically with `localStorage` (persists on page reloads).
*   **Backend:** Node.js + Express.js (ES6 module syntax) with strict input validation, security headers, rate-limiting, and error-handling middleware.
*   **Database:** MongoDB local connection using Mongoose ODM.
*   **Payments:** Stripe SDK and Stripe Elements `CardElement` integration.

---

## 📁 File Structure Created

All project files are organized inside `c:\Users\kenzo1\Desktop\store`:

```
store/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Product.js                     # Product Schema
│   │   │   └── Order.js                       # Order Schema
│   │   ├── routes/
│   │   │   ├── productRoutes.js               # Product routes
│   │   │   ├── orderRoutes.js                 # Order routes
│   │   │   └── paymentRoutes.js               # Payment routes
│   │   ├── controllers/
│   │   │   ├── productController.js           # Filtering & sorting logic
│   │   │   ├── orderController.js             # Server-side total calculation & Zod validation
│   │   │   └── paymentController.js           # Stripe intent & Webhook updates
│   │   ├── middleware/
│   │   │   ├── errorHandler.js                # Global error responder
│   │   │   └── validation.js                  # Zod validation middleware wrapper
│   │   ├── utils/
│   │   │   ├── generateOrderNumber.js         # SHR-YYMMDD-XXXXX order generator
│   │   │   ├── stripe.js                      # Stripe SDK initializer
│   │   │   └── seed.js                        # Kitchenware database seed script
│   │   └── server.js                          # Express entrypoint
│   ├── package.json
│   └── .env                                   # Port & Local DB variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx                 # Sticky logo, navigation & mobile sheet menu
    │   │   │   └── Footer.jsx                 # Mock newsletter subscription & copyright info
    │   │   ├── product/
    │   │   │   ├── ProductCard.jsx            # Dynamic hover card + quick cart add
    │   │   │   ├── ProductGrid.jsx            # Responsive layout columns & skeletons
    │   │   │   ├── ProductFilters.jsx         # Category, price range, and sort dropdowns
    │   │   │   └── ProductImageGallery.jsx    # Primary display + active thumbnail strip
    │   │   ├── cart/
    │   │   │   ├── CartItem.jsx               # Line-item quantity adjuster & subtotal
    │   │   │   └── CartSummary.jsx            # Subtotal, 8% tax calculation & Stripe CTA
    │   │   └── shared/
    │   │       ├── Loader.jsx                 # Center spinning logo loading screen
    │   │       ├── Toast.jsx                  # Custom Sonner notifications
    │   │       ├── ErrorBoundary.jsx          # Crash catcher component
    │   │       └── NotFoundPage.jsx           # 404 path not found fallback page
    │   ├── pages/
    │   │   ├── HomePage.jsx                   # Hero showcase, categories quick link, featured grid
    │   │   ├── ShopPage.jsx                   # Full catalog browsing, sidebar/drawer filters
    │   │   ├── ProductDetailPage.jsx          # Full description, capacity, finish options, quantity selector, related items
    │   │   ├── CartPage.jsx                   # Cart editor table + checkout routing
    │   │   ├── CheckoutPage.jsx               # Form validation (Zod) + Stripe payment elements
    │   │   └── OrderSuccessPage.jsx           # confirmation details, invoice layout, cart clearing
    │   ├── context/
    │   │   ├── CartContext.jsx                # Shopping cart hooks, totals, and toast notifications
    │   │   └── CartReducer.js                 # Cart mutating action states
    │   ├── services/
    │   │   ├── api.js                         # Axios wrapper with response error interceptors
    │   │   └── stripe.js                      # Stripe publishable loader promise
    │   ├── hooks/
    │   │   └── useToast.js                    # Sonner toast methods wrapper
    │   ├── App.jsx                            # Front routing mappings
    │   └── main.jsx                           # Application entry wrappers
    ├── index.html                             # Favicon icon, Font, and SEO metadata
    ├── package.json
    ├── jsconfig.json                          # IDE path mapping alias
    ├── components.json                        # shadcn configuration template
    └── .env                                   # API and Stripe credentials config
```

---

## 🛠️ Security Hardening Implemented

1.  **CORS Restrictions:** Express only allows connections matching the configuration `CLIENT_URL` (usually `http://localhost:5173`).
2.  **HTTP Headers (Helmet):** Configured to secure Express apps by setting various security-related HTTP headers.
3.  **Mongo Injection Sanitization (`express-mongo-sanitize`):** Prevents NoSQL query injection by stripping characters starting with `$` and `.` from user-supplied query fields.
4.  **API Rate Limiting:** Restricts each IP to 100 requests per 15 minutes across all API routes to safeguard resources.
5.  **Secure Server-Side Calculation:** Order subtotals, tax rates (8%), and totals are queried and calculated directly from the MongoDB database on the backend before creating Stripe PaymentIntents. This prevents client-side price modification.
6.  **Zod Schema Validation:** Data passed to `POST /api/orders` and `CheckoutPage` shipping forms are strictly verified against schema patterns.
7.  **Environment Variables:** Sensitive parameters (database URIs, Stripe Secret keys) are isolated inside backend `.env` configuration files and never exposed to the client.

---

## 🎯 Verification Steps (Manual Testing Guide)

Both backend and frontend services are currently active on your system. You can verify them manually:

### 1. Browse the Storefront
*   Open your browser and navigate to `http://localhost:5173/`.
*   Ensure the **Sharabia Store** logo (flame icon + text), hero banners, categories quick links (Cookware, Bakeware, Kitchen Tools), and featured products load.

### 2. Shop Page & Filtering
*   Click **Shop All** or **Shop Collection**.
*   Test checking/unchecking categories, entering min/max price thresholds, and altering the sorting filters. The product grid will update instantly.

### 3. Add Items & Persist
*   Go to a product detail page (e.g. `http://localhost:5173/product/professional-copper-skillet`).
*   Select capacity/finish options, adjust quantity using the `-` and `+` buttons, and click **Add to Cart**.
*   Check that a toast message pops up confirming the add. The cart badge in the top navbar should increment.
*   Refresh the page. Verify the items remain in your cart (verifying local storage synchronization).

### 4. Checkout and Payments
*   Click on the cart icon and choose **Proceed to Checkout**.
*   Fill in the shipping fields. Ensure Zod triggers validation errors (e.g., leaving a field empty or entering an invalid email).
*   Toggle shipping methods (Standard vs Express) and watch the summary total adjust by $10.
*   Once Stripe keys are set, input the Stripe Test Card (`4242 4242 4242 4242` with any valid expiration date and CVC) and click **Place Order**.
*   Confirm you are redirected to the **Order Success Page** showing details of your purchase. The shopping cart should be cleared.

---

## 🚀 Vercel Deployment Walkthrough (Unified Project Setup)

This section outlines how to deploy both the Express Backend and Vite Frontend on Vercel as a **single unified project** using the root `vercel.json` file.

This setup is highly recommended because:
1. **No CORS errors**: Both frontend and backend share the same origin, so cookie credentials and headers work out-of-the-box.
2. **Simplified URL setup**: You don't have to manage different URLs for frontend and backend in production environment variables.

---

### 💾 1. Prerequisites & Database Setup
Before initiating deployment on Vercel:
1. **MongoDB Atlas IP Whitelisting**:
   - Because Vercel Serverless Functions use dynamic IP addresses, you **must allow connections from anywhere** on your database cluster.
   - Go to your **MongoDB Atlas Console** ➡️ **Network Access** ➡️ Click **Add IP Address** ➡️ Choose **Allow Access From Anywhere** (`0.0.0.0/0`) and save.
2. **Stripe API Keys**:
   - Go to your **Stripe Dashboard** (in developer/test mode) and locate your **Publishable Key** (`pk_test_...`) and **Secret Key** (`sk_test_...`).

---

### 🚀 2. Step-by-Step Vercel Deployment
We have created a `vercel.json` file in your root workspace. This file maps all requests under `/api/*` to the backend serverless endpoints and all other requests to the compiled frontend static files.

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** ➡️ **Project**.
3. Import your GitHub repository (`kenzo4k/sharabia`).
4. In the configuration options, set:
   * **Project Name**: `sharabia-store` (or a custom name)
   * **Framework Preset**: Choose **Other** (since it is a custom root-level workspace config)
   * **Root Directory**: Select the **root folder of the workspace** (`.`) — do *not* select `frontend` or `backend`.
   * **Build Command**: Set to `npm run build` (runs the frontend Vite build from root).
   * **Output Directory**: Set to `frontend/dist`.
5. **Environment Variables**: Expand this section and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Your production MongoDB connection URI. |
| `JWT_SECRET` | *(Any secure random string)* | Used for generating JSON Web Tokens. |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Your Stripe Secret Key. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Your Stripe Publishable Key. |
| `CLIENT_URL` | `https://your-domain.vercel.app` | Set this to your actual deployed website domain. |
| `VITE_API_URL` | `/api` | Forces the Vite API client to use relative routing on the same origin (avoids CORS issues!). |

6. Click **Deploy**. Vercel will install the dependencies, download the native Linux binaries, compile your frontend into `frontend/dist`, and configure the API handlers.
7. Once deployment is complete, copy the generated deployment URL (e.g., `https://sharabia-store.vercel.app`).

---

### 🔒 3. Configure Stripe Webhooks
To handle purchases and stock changes in production:
1. Go to your **Stripe Dashboard** ➡️ **Developers** ➡️ **Webhooks**.
2. Click **Add Endpoint**.
3. In the Endpoint URL field, enter your deployed website domain: `https://your-domain.vercel.app/api/payments/webhook`
4. Choose the following events to listen to:
   * `payment_intent.succeeded`
   * `payment_intent.payment_failed`
5. Click **Add endpoint**.
6. Copy the displayed **Signing Secret** (starts with `whsec_...`).
7. Go back to your **Vercel Project** ➡️ **Settings** ➡️ **Environment Variables**.
8. Add a new variable:
   * **Key**: `STRIPE_WEBHOOK_SECRET`
   * **Value**: *(Your Stripe signing secret `whsec_...`)*
9. Redeploy your project from the Vercel dashboard for this secret to take effect.

