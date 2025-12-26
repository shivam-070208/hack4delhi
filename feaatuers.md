# 🏛️ Unified HRMS for Municipal Corporation of Delhi (MVP)

A centralized Human Resource Management System (HRMS) designed to digitize and streamline core HR operations of the Municipal Corporation of Delhi (MCD). This MVP focuses on essential employee lifecycle management while being scalable for future expansion.

---

## 🎯 Objective

To build a secure, role-based, and scalable HRMS MVP that efficiently manages:
- Employee records
- Attendance & leave
- Payroll
- Transfers
- Grievance redressal
- Inter-department visibility

---

## 🧱 Tech Stack

- **Frontend & Backend:** Next.js (App Router)
- **Database:** MongoDB
- **ORM / Adapter:** MongoDB Adapter
- **Authentication:** better-auth
- **Authorization:** Role-Based Access Control (RBAC)
- **Deployment Ready:** Serverless / Cloud-compatible

---

## 🔐 Authentication & Access Control (MVP)

### Pages
- `/login`
- `/unauthorized`

### Features
- Employee ID–based login
- Role-based access (Admin, HR, Employee)
- Department-based permissions
- Secure session handling

---

## 🏠 Role-Based Dashboards

### Pages
- `/dashboard/admin`
- `/dashboard/hr`
- `/dashboard/employee`

### Features
- Key statistics overview
- Pending approvals
- Notifications & alerts

---

## 🧑‍💼 Employee Management (Core Module)

### Pages
- `/employees`
- `/employees/add`
- `/employees/[id]`

### Features
- Add and view employees
- Department & designation mapping
- Active / inactive status
- Basic service history

---

## 🕒 Attendance & Leave Management

### Pages
- `/attendance`
- `/attendance/logs`
- `/attendance/leave-request`

### Features
- Manual or QR-based attendance
- Leave request & approval flow
- Daily attendance records

---

## 💰 Payroll Management (Simplified MVP)

### Pages
- `/payroll`
- `/payroll/run`
- `/payroll/slips`

### Features
- Fixed salary structure
- Attendance-based salary calculation
- Auto-generated salary slips (PDF)

---

## 🔁 Transfer Management

### Pages
- `/transfers`
- `/transfers/request`

### Features
- Transfer request submission
- Single-level approval
- Transfer history tracking

---

## 🗂️ Grievance Redressal System

### Pages
- `/grievances`
- `/grievances/new`
- `/grievances/[id]`

### Features
- Grievance filing by employees
- Status tracking (Open → Resolved)
- Assigned authority dashboard

---

## ⚙️ Admin & System Settings

### Pages
- `/admin/users`
- `/admin/departments`

### Features
- User role assignment
- Department management
- Basic audit logging

---

## 🔄 MVP Development Flow (Build Order)

1. Authentication & RBAC
2. Employee Management
3. Attendance & Leave
4. Payroll
5. Transfers
6. Grievance Redressal

---

## ✅ MVP Scope Summary

**Included**
- Secure login & roles
- Central employee database
- Attendance-driven payroll
- Basic transfers & grievances

**Excluded (Future Scope)**
- AI analytics
- Biometric hardware integration
- Multi-level approvals
- Performance appraisal system
- Mobile application

---

## 🚀 MVP Value Proposition

This MVP establishes a **single source of truth** for MCD’s workforce, demonstrating:
- Operational efficiency
- Transparency in governance
- Scalability for city-wide deployment

---

## 📌 Final Note

This HRMS MVP is designed to scale from a pilot deployment to a full-fledged municipal workforce platform covering thousands of employees across departments.

---
