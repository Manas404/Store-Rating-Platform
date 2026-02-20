#  Store Rating Platform

A full-stack, role-based web application that allows users to discover and rate local stores, provides store owners with real-time analytics, and gives administrators complete control over the platform.

## Features

The platform uses Role-Based Access Control (RBAC) to serve three distinct types of users:

*** System Administrator (`ADMIN`)**
- View high-level system statistics (Total Users, Stores, Ratings).
- **Manage Users:** Register new users and assign administrative or merchant roles.
- **Manage Stores:** Create new storefronts and assign them to specific `STORE_OWNER` accounts.

*** Store Owner (`STORE_OWNER`)**
- Access a private analytics dashboard for their assigned store.
- Track Key Performance Indicators (KPIs) like Average Rating and Total Reviews.
- View a chronological feed of recent customer reviews and ratings.

*** Normal User (`USER`)**
- Browse a comprehensive directory of registered stores.
- Search for stores by name or address.
- Submit, view, and update 1-5 star ratings for any store.

---

##  Tech Stack

**Frontend**
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4 (Modern CSS-first configuration)
- **State Management:** React Context API (`AuthContext`)
- **HTTP Client:** Axios (with centralized interceptors)

**Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT) & bcrypt (Password Hashing)
- **Database:** MySQL (using `mysql2/promise` for async queries)

---

##  Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/) (v8.0 or higher)

---

##  Database Setup

1. Open your MySQL client (e.g., MySQL Workbench, DBeaver, or CLI).
2. Create a new database:
   ```sql
   CREATE DATABASE store_rating_db;
   USE store_rating_db;