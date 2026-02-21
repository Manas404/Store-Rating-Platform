# ⭐ Store Rating Platform

A full-stack, role-based web application that allows users to discover and rate local stores, enables store owners to monitor real-time analytics, and provides administrators with complete control over platform management.

---

## 🚀 Features

The platform implements **Role-Based Access Control (RBAC)** supporting three user roles:

---

### 👑 System Administrator (`ADMIN`)
- View platform statistics (Total Users, Stores, Ratings).
- **Manage Users**
  - Register new users.
  - Assign roles (`ADMIN`, `STORE_OWNER`, `USER`).
- **Manage Stores**
  - Create storefronts.
  - Assign stores to specific owners.

---

### 🏪 Store Owner (`STORE_OWNER`)
- Access a dedicated analytics dashboard.
- Monitor business performance using KPIs:
  - Average Rating
  - Total Reviews
- View a chronological feed of customer ratings and feedback.

---

### 👤 Normal User (`USER`)
- Browse all registered stores.
- Search stores by **name** or **address**.
- Submit, view, and update **1–5 star ratings**.

---

## 🧰 Tech Stack

### **Frontend**
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API (`AuthContext`)
- **HTTP Client:** Axios with centralized interceptors

---

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT + bcrypt (Password Hashing)
- **Database:** MySQL (`mysql2/promise` for async queries)

---

## 📋 Prerequisites

Make sure the following are installed:

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)

---

## 🗄️ Database Setup

1. Open your MySQL client.
2. Create a database:

```sql
CREATE DATABASE store_rating_db;
USE store_rating_db;