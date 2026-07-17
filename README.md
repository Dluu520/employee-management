# Employee Management System



Live Demo: https://employees-management-platform.vercel.app/


A full-stack employee management platform built with **Next.js, TypeScript, Tailwind CSS, and MongoDB**.  

The application provides HR-focused tools for managing employees, tracking payroll information, and viewing workforce analytics through a modern dashboard interface.

---

## Features

### Employee Management
- Create, view, and delete employee records
- Manage employee profiles and personal information
- Assign roles and departments
- Track employment status and hire dates
- Search and filter employees by:
  - Name
  - Department
  - Position
  - Role
  - Status

### Payroll Management
- View employee salary information
- Calculate monthly payroll summaries
- Display:
  - Total employees
  - Monthly payroll expenses
  - Average salary
  - Salary distribution
  - Department payroll insights
- Search and filter payroll records

### Dashboard Analytics
- Employee growth tracking
- Workforce overview
- Department statistics
- HR performance metrics

### User Management
- Role-based access control:
  - Admin
  - Manager
  - Employee
- Permission management:
  - Edit employees
  - Delete employees
  - View payroll

### Data Management
- MongoDB database integration
- RESTful API architecture
- Seed script for generating realistic employee data
- Data validation using Mongoose schemas

---

# Tech Stack

## Frontend

- **Next.js 16**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Backend

- **Next.js API Routes**
- **Node.js**
- **MongoDB**
- **Mongoose**

## Development Tools

- Faker.js (mock employee data generation)
- Git / GitHub
- ESLint

---

# Screenshots

## Dashboard
https://employees-management-platform.vercel.app/
<img width="1915" height="825" alt="image" src="https://github.com/user-attachments/assets/7ffc6e9a-9300-4def-9f12-784961ef005a" />

---

## Employee Management
https://employees-management-platform.vercel.app/
<img width="1889" height="784" alt="image" src="https://github.com/user-attachments/assets/d4defdb5-e07f-4ca6-9385-4d9b0c785d2a" />


---

## Payroll Dashboard
1/2
<img width="1892" height="772" alt="image" src="https://github.com/user-attachments/assets/c8cb09c5-313c-4b1f-b03f-37019ac57956" />
2/2
<img width="1913" height="809" alt="image" src="https://github.com/user-attachments/assets/e6ff5468-7f0e-4ba3-9084-655fe5bf353f" />

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/Dluu520/employee-management-system.git

## 2. Install Dependencies
npm install
## 3. Configure Environment Variables

Create a .env.local file:

MONGODB_URI=your_mongodb_connection_string
## 4. Run Development Server
npm run dev

Open:

http://localhost:3000
```
| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | `/api/users`   | Retrieve employees    |
| POST   | `/api/users`   | Create employee       |
| PATCH  | `/api/users`   | Update employee       |
| DELETE | `/api/users`   | Remove employee       |
| GET    | `/api/payroll` | Retrieve payroll data |

Future Improvements
Authentication system with NextAuth
Employee profile pages
Payroll history tracking
Attendance management
Performance reviews
Export payroll reports (CSV/PDF)
Email notifications
Advanced analytics dashboard
Project Goals

This project was built to practice and demonstrate:

Full-stack application architecture
Database modeling
REST API development
TypeScript application design
Modern React patterns
Building business management software
