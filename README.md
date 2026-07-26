# 🛒 Spring Boot + React E-Commerce Product Management

A full-stack E-Commerce Product Management application built using **Spring Boot** and **React**. The application allows users to manage products, upload product images, search products, and perform complete CRUD operations through REST APIs.

---

## 🚀 Features

- Create, Read, Update and Delete Products
- Upload and display product images
- Search products by keyword
- Category management
- Inventory quantity tracking
- Product availability status
- Responsive React frontend
- RESTful API architecture

---

## 🛠 Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend
- React
- Axios
- Bootstrap
- Vite

---

## 📷 Screenshots

> Add screenshots here

- Home Page
- Product Details
- Add Product
- Update Product
- Search Products

---

## 📂 Project Structure

```
Spring Boot
│
├── Controller
├── Service
├── Repository
├── Entity
└── REST APIs

React
│
├── Components
├── Pages
├── CSS
└── Axios API Calls
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/springboot-react-ecommerce.git
```

### Backend

```bash
cd backend
```

Update your database configuration inside

```
application.properties
```

Run

```bash
mvn spring-boot:run
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/{id} | Get product by ID |
| POST | /api/products | Add product |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |
| GET | /api/products/search | Search products |
| GET | /api/product/{id}/image | Get product image |

---

## Future Improvements

- Spring Security
- JWT Authentication
- Shopping Cart
- User Authentication
- Order Management
- Payment Integration

---

## Author

Ansh Zamde
