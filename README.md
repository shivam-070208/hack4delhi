# Employee Management Portal

A modern full-stack employee management system built with [Next.js 13+ (App Router)](https://nextjs.org/docs/app), MongoDB, and Tailwind CSS. This platform is designed to streamline HR processes and empower both employees and HR staff through intuitive interfaces and robust features.

## Features

### For Employees

- **Dashboard:** View personal stats, recent activities, and attendance overview.
- **Attendance Management:** Mark daily attendance; view attendance records and monthly summary charts.
- **Leave Requests:** Apply for leave and view approval status.
- **Salary Slips:** Securely view and download salary slips.
- **Grievance Submission:** Submit grievances to HR and track their resolution process.

### For HR/Admin

- **Employee Directory:** View and manage all employee profiles.
- **Attendance Tracking:** Monitor employee attendance and statistics.
- **Leave Management:** Approve or reject leave requests.
- **Grievance Handling:** View and resolve employee grievances, assign HR staff, and provide feedback.

## Tech Stack

- **Frontend:** React (Next.js App Router), Tailwind CSS
- **Backend:** Next.js API routes, MongoDB (Mongoose ODM)
- **Authentication:** NextAuth.js (credentials & session management)
- **Other:** Server-side rendering, RESTful API design

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/employee-management-portal.git
   cd employee-management-portal
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file in the root directory and add:

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to access the application.

## Project Structure

- `src/app/` — All routes (pages and API) using Next.js App Router.
- `src/db/` — Mongoose models and database helpers.
- `src/lib/` — Auth utilities and supporting modules.
- `public/` — Static assets.
- `README.md` — Project documentation.

## Customization

- Update company branding/logos by replacing assets in `public/`.
- Modify color/theme via Tailwind config and utility classes.
- Extend features by adding new API routes and React components.

## Contributing

Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

Built with Next.js, MongoDB, and modern web best-practices.
