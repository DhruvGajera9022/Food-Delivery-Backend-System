# Food Delivery Backend System

A comprehensive backend system for a food delivery service, built using **Node.js**, **Express.js**, and **MySQL**, with integrated authentication via **Passport.js** for Google and Facebook. This robust system supports key functionalities such as user management, product management, invoice generation, role-based access control (RBAC), payment integration, and more.

## 🚀 Features

### 1. 🔐 Authentication

- **User Registration:** Register via email/password.
- **Login:** Log in with email/password or through Google/Facebook OAuth.
- **Session Management:** Uses `express-session` with `session-file-store` for session persistence.
- **JWT Authentication:** Secures specific APIs with token-based authentication.

### 2. 👥 User Management

- **Admin Control:** Admins can view, add, edit, and delete user accounts.
- **Profile Management:** Users can view and update personal information, including address details.

### 3. 🛡️ Role-Based Access Control (RBAC)

- **Role Management:** Admins can create, modify, and delete user roles (e.g., Admin, User).
- **Role Assignment:** Grant specific access permissions based on assigned roles.

### 4. 📂 Category Management

- Manage product categories (add, edit, delete) for easy product organization.

### 5. 🍔 Product Management

- Add, edit, and delete items in the product catalog.
- Upload product images for better visual representation.

### 6. 💸 Discount Management

- Create, update, and delete discount schemes for promotional campaigns.

### 7. 📊 Dashboard

- A user-friendly dashboard for admins to monitor system activity and key metrics.

### 8. 🧾 Invoice Management

- Generate, view, and manage invoices linked to user transactions.

### 9. ⚙️ Settings Management

- Admins can configure and update global application settings.

### 10. 💳 Payment Integration

- Seamlessly handle checkout processes and payment transactions.
- Auto-generate invoices upon successful payment.

### 11. 🌐 RESTful API Endpoints

- Secure, well-structured endpoints with JWT protection for sensitive data.

## 🗒️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MySQL](https://www.mysql.com/) (for the database)

## ⚙️ Installation Guide

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/DhruvGajera9022/Food-Delivery-Backend-System.git
   cd Food-Delivery-Backend-System
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Create a `.env` file and set up the necessary environment variables.

4. **Database Setup:**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Start the Server:**
   ```bash
   npm start
   ```

6. **API Documentation:**
   - Access Swagger UI for API testing and documentation:
     ```bash
     http://localhost:3000/api-docs
     ```

## 📡 API Documentation

### 🔑 Authentication Endpoints

- `POST /api/login` - Log in with email/password
- `POST /api/register` - Register a new user

### 👤 Profile & Address Endpoints

- `GET /api/me` - Retrieve current user's details
- `PUT /api/editProfile` - Update user profile information
- `GET /api/address` - Fetch user addresses
- `PUT /api/address` - Edit address details
- `DELETE /api/delete/address/:id` - Delete an address

### 🗂️ Product & Category Endpoints

- `GET /api/category` - Retrieve all categories
- `GET /api/products` - Retrieve all products

### 🎯 Discount Management Endpoints

- `GET /api/discount` - View available discounts

### 📥 Invoice Management Endpoints

- `GET /api/invoices` - Fetch all invoices
- `POST /api/invoices` - Generate a new invoice

### 💳 Payment Endpoints

- `POST /api/checkout` - Process payments

## 🏗️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** Passport.js (Google, Facebook), JWT
- **API Documentation:** Swagger UI
- **Session Management:** Express-session with session-file-store

---

Built with ❤️ by Dhruv Gajera

