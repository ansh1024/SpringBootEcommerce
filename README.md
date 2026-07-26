# MegaCart — Full-Stack E-Commerce App

React (Vite) frontend + Spring Boot backend, using an in-memory H2 database.

## Project structure

```
ecom-project/
├── frontend/ecom-frontend/   → React app (Vite, port 5173)
└── backend/ecom-backend/ecom-webproj/  → Spring Boot API (port 8080)
```

## How to run

### 1. Backend (Spring Boot)

```bash
cd backend/ecom-backend/ecom-webproj
./mvnw spring-boot:run        # macOS/Linux
mvnw.cmd spring-boot:run      # Windows
```

- Runs on **http://localhost:8080**
- REST API base path: `http://localhost:8080/api`
- H2 console (optional, for inspecting data): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:telusko`, user: `sa`, no password
- Uses an **in-memory** database, so data resets every time you restart the app.

### 2. Frontend (React + Vite)

```bash
cd frontend/ecom-frontend
npm install
npm run dev
```

- Runs on **http://localhost:5173**
- Talks to the backend at `http://localhost:8080/api` — this is configured in one place:
  `frontend/ecom-frontend/src/config.js`. Change it there if your backend ever
  runs on a different host/port; every component reads from that one file.

**Start the backend first**, then the frontend — the app calls the API as soon
as it loads.

## What's implemented

- Browse products, filter by category, live search
- Product detail page with add-to-cart, update, and delete
- Add Product form (with image upload)
- Update Product form (with image preview/replace)
- Cart with quantity controls, persisted in `localStorage`
- Checkout flow that decrements stock on the backend
- Light/dark theme toggle (persisted)

## Notes on the merge

The frontend and backend were built somewhat independently, so a few things
were fixed to make them work together correctly:

- All API calls now go through **one** axios instance (`src/axios.jsx`) built
  on **one** config file (`src/config.js`) — no more hardcoded URLs scattered
  across components.
- Fixed a field-name collision where the cart's "quantity in cart" was
  overwriting the product's "stock quantity" from the backend, which broke
  quantity increments and checkout stock updates.
- Fixed cart endpoints that pointed at `/api/product/...` (singular) instead
  of the backend's actual `/api/products/...` (plural).
- Fixed a type-mismatch bug where deleting a product from its detail page
  didn't remove it from the cart (string vs. number id comparison).
- Adding a product now refreshes the home page list immediately instead of
  requiring a manual reload.

## CORS

The backend's `ProductController` allows requests from
`http://localhost:5173` and `http://localhost:5174` (Vite's default dev
ports). If you run the frontend on a different port, add it to the
`@CrossOrigin` origins list in
`backend/.../controller/ProductController.java`.
