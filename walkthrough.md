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

## 🚀 Vercel Deployment Walkthrough

This section outlines how to deploy both the Express Backend and Vite Frontend on Vercel from your GitHub repository.

### 🏗️ 1. Architecture Setup
Because your project is a Monorepo structured with separate subdirectories (`/backend` and `/frontend`), you will deploy them as **two separate projects** in Vercel. Both projects will link to the same GitHub repository, but each will use a different **Root Directory**.

```
                    ┌─────────────────────────┐
                    │    GitHub Repository    │
                    │   (kenzo4k/sharabia)    │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌──────────────────┐            ┌──────────────────┐
       │ Vercel Project 1 │            │ Vercel Project 2 │
       │     (Backend)    │            │    (Frontend)    │
       └──────────────────┘            └──────────────────┘
```

---

### 💾 2. Prerequisites & Database Setup
Before initiating deployment on Vercel:
1. **MongoDB Atlas IP Whitelisting**:
   - Because Vercel Serverless Functions use dynamic IP addresses, you **must allow connections from anywhere** on your database cluster.
   - Go to your **MongoDB Atlas Console** ➡️ **Network Access** ➡️ Click **Add IP Address** ➡️ Choose **Allow Access From Anywhere** (`0.0.0.0/0`) and save.
2. **Stripe API Keys**:
   - Go to your **Stripe Dashboard** (in developer/test mode) and locate your **Publishable Key** (`pk_test_...`) and **Secret Key** (`sk_test_...`).

---

### 🚀 3. Step-by-Step Backend Deployment
Your backend repository already contains a custom `backend/vercel.json` file configuring Vercel Serverless rules.

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** ➡️ **Project**.
3. Import your GitHub repository (`kenzo4k/sharabia`).
4. In the configuration options, set:
   * **Project Name**: `sharabia-backend` (or a custom name)
   * **Framework Preset**: Choose **Other**
   * **Root Directory**: Click *Edit* and select the **`backend`** folder.
5. **Environment Variables**: Expand this section and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` | Your production MongoDB connection URI. |
| `JWT_SECRET` | *(Any secure random string)* | Used for generating JSON Web Tokens. |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Your Stripe Secret Key. |
| `CLIENT_URL` | `http://localhost:5173` | *(Temporary)* We will update this to your final Frontend URL in Step 5. |

6. Click **Deploy**.
7. Once deployment is complete, copy the generated deployment domain (e.g., `https://sharabia-backend.vercel.app`).

---

### 🎨 4. Step-by-Step Frontend Deployment
The frontend has a `frontend/vercel.json` configuration handling page refresh rewrites.

1. Go back to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** ➡️ **Project**.
3. Import the same repository (`kenzo4k/sharabia`).
4. Configure the options:
   * **Project Name**: `sharabia-store` (or a custom name)
   * **Framework Preset**: **Vite** (Vercel should auto-detect this)
   * **Root Directory**: Click *Edit* and select the **`frontend`** folder.
   * **Build & Development Settings**: Keep defaults (Build Command: `npm run build`, Output Directory: `dist`).
5. **Environment Variables**: Add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.vercel.app/api` | The URL of your backend project (from Step 3) **followed by `/api`**. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Your Stripe Publishable Key. |

6. Click **Deploy**.
7. Once complete, copy your production frontend URL (e.g., `https://sharabia-store.vercel.app`).

---

### 🔒 5. Finalize Webhooks & CORS (Resolving Circular Dependencies)
Now that both the backend and frontend are running, configure the secure links between them.

#### A. Update CORS Allowed Origin in Backend
1. Go to your **Backend Project** in Vercel.
2. Select **Settings** ➡️ **Environment Variables**.
3. Edit the `CLIENT_URL` variable, replacing the temporary local URL with your final Frontend Vercel URL (e.g., `https://sharabia-store.vercel.app`).
4. Click **Save**.
5. Re-trigger a build so the new environment variables take effect: Go to **Deployments** ➡️ Click the triple-dots (`...`) on your latest deployment ➡️ Choose **Redeploy**.

#### B. Configure Stripe Webhooks
To handle purchases, order confirmations, and stock updates automatically:
1. Go to **Stripe Dashboard** ➡️ **Developers** ➡️ **Webhooks**.
2. Click **Add Endpoint**.
3. In the Endpoint URL field, enter: `https://your-backend-url.vercel.app/api/payments/webhook`
4. Choose the following events to listen to:
   * `payment_intent.succeeded`
   * `payment_intent.payment_failed`
5. Click **Add endpoint**.
6. Copy the displayed **Signing Secret** (starts with `whsec_...`).
7. Go back to your **Vercel Backend Project** Environment Variables.
8. Add a new variable:
   * **Key**: `STRIPE_WEBHOOK_SECRET`
   * **Value**: *(Your Stripe signing secret `whsec_...`)*
9. Redeploy your backend again.
