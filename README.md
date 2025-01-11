### Food Delivery Backend System

A comprehensive backend system for a food delivery service, built using Node.js, Express.js, MySQL, and with integrated authentication (via Passport.js) for Google and Facebook. This system provides key features such as user management, product management, invoice generation, role-based access control (RBAC), and more, designed to support a food delivery platform.

## Features

# 1. Authentication

- **User Registration**: Allows users to register via email/password.
- **Login**: Users can log in with email/password or through Google/Facebook OAuth.
- **Session Management**: Uses express-session and stores sessions using session-file-store.
- **JWT Authentication**: Token-based authentication for certain APIs.

## 2. User Management

- **Admin Control**: Admins can view, add, edit, and delete user accounts.

## 3. Role-Based Access Control (RBAC)

- **Role Management**: Admins can manage user roles (e.g., Admin, User, etc.).
- **Role Assignment**: Users are assigned roles to access specific resources.

## 4. Category Management

Admins can manage product categories, including adding, editing, and deleting categories.

## 5. Product Management

Admins can manage products by adding, editing, and deleting items in the catalog.
Product image uploads for visual representation.

## 6. Discount Management

Admins can manage discount schemes, including creating, editing, and deleting discounts.

## 7. Profile Management

Users can view and edit their profile information, including updating address details.

## 8. Dashboard

The user dashboard displays key information, like user data and relevant navigation links.

## 9. Invoice Management

Admins can generate and manage invoices, linked to user transactions.

## 10. Settings Management

Admins can edit global application settings.

## 11. Payment Integration

Handles checkout and payment processing.
Generates invoices after successful payment.

## 12. API Endpoints

RESTful API endpoints for key actions like authentication, products, categories, and more.
JWT is required for certain routes, ensuring secure data access.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MySQL](https://www.mysql.com/) for database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DhruvGajera9022/Food-Delivery-Backend-System.git
   cd Food-Delivery-Backend-System
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables.

4. For create Database in MySql:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Run the Server:

   ```bash
   npm start
   ```

6. Access Swagger Documentation:
   ```bash
   http://localhost:3000/api-docs
   ```

## API Documentation

- **Authentication Endpoints**:
  - `/api/login` - Login via email/password
  - `/api/register` - Register new users
- **Profile & Address Endpoints**:
  - `/api/me`: View user's all details
  - `/api/editProfile`: Edit user's profile
  - `/api/address`: Get user's addresses
  - `/api/address`: Edit user's address
  - `/api/delete/address/:id`: Delete user's address
- **Product & Category Endpoints**:
  - `/api/category`: Get all categories
  - `/api/products`: Get all products
- **Discount Management**:
  - `/api/discount`: Get all discounts
- **Invoice Management**:
  - `/api/invoices`: Get all invoices
  - `/api/invoices`: Generate new invoice
- **Payment Endpoints**:
  - `/api/checkout`: Process a payment
