# 🏛️ Unified HRMS for Municipal Corporation of Delhi (MVP)

A centralized Human Resource Management System (HRMS) designed to efficiently manage recruitment, employee records, attendance, payroll, transfers, grievance redressal, and inter-department coordination for the Municipal Corporation of Delhi (MCD).  
This repository represents an **MVP implementation** focused on security, scalability, and governance.

---

## 🎯 Problem Statement

The Municipal Corporation of Delhi manages thousands of employees across multiple departments and zones. Existing systems are fragmented, manual, and lack transparency, leading to delays, inefficiencies, and poor inter-department coordination.

---

## 💡 Solution Overview

This HRMS provides a **single digital platform** to manage the complete employee lifecycle using:

- Centralized employee records
- Role-based access control
- Attendance-driven payroll
- Controlled transfers
- Transparent grievance redressal

The system is designed with a **government-compliant authorization model** and is scalable beyond the MVP.

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** MongoDB
- **Database Adapter:** MongoDB Adapter
- **Authentication:** better-auth
- **Authorization:** Role-Based Access Control (RBAC)
- **Architecture:** Server-side authorization with secure sessions

---

## 🔐 Authentication & Authorization Model

### Key Principles

- ❌ No public sign-up
- ❌ No self-created accounts
- ✅ Accounts are created only by authorized users
- ✅ One predefined Admin exists at system setup

### Role Hierarchy

## Admin → HR → Employee

### Who Can Create Accounts

- **Admin:** Can create HR and Employee accounts (any department)
- **HR:** Can create Employee accounts (own department only)
- **Employee:** Cannot create accounts

The initial Admin account is **predefined (bootstrapped)** during deployment via database seeding or environment configuration.

---

## 🔄 Application Flow (End-to-End)

### Phase 0: System Bootstrap (One-Time)

- A predefined Admin account exists
- No registration page is exposed
- System is locked and secure from first use

---

### Phase 1: Login & Access

1. User logs in using Employee ID and password
2. next-auth authenticates the user
3. A secure session is created containing:
   - User ID
   - Role (ADMIN / HR / EMPLOYEE)
   - Department ID
4. User is redirected to a role-based dashboard

---

### Phase 2: Account Creation

- Admin logs in and creates HR accounts
- HR logs in and creates Employee accounts for their department
- Employees only log in; they never register

---

### Phase 3: Employee Management

- HR/Admin manages employee profiles
- Each profile includes:
  - Department
  - Designation
  - Joining details
  - Employment status
- Employee profile acts as the **single source of truth**

---

### Phase 4: Daily Operations

- Employees mark attendance
- Employees submit leave requests
- HR/Admin approves leave
- Attendance data is stored daily

---

### Phase 5: Payroll

- HR/Admin runs payroll
- System calculates salary using:
  - Fixed salary structure
  - Attendance data
- Salary slips are generated automatically
- Employees can view and download salary slips

---

### Phase 6: Transfers

- HR/Admin initiates transfer requests
- Transfers follow controlled approval
- Employee department is updated
- Transfer history is maintained for audit

---

### Phase 7: Grievance Redressal

- Employees submit grievances
- Grievances are assigned to authorities
- Status flow:
