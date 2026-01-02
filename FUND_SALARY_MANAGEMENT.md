# Fund & Salary Management System

## Overview

This document outlines the newly implemented Fund Requests and Salary Management system for the HR module.

## Features Implemented

### 1. **Fund Requests Page** (`/hr/funds`)

HR users can submit fund requests for their departments with the following features:

- **Request Form**: Submit fund amount and purpose
- **Status Tracking**: Track pending, approved, and rejected requests
- **Professional UI**: Beautiful, responsive cards with gradient designs
- **Real-time Updates**: Automatic refresh after successful submission

**Components:**

- `FundsRequestForm.jsx` - Form for submitting new requests
- `FundsRequestList.jsx` - List showing all user's requests with status badges

### 2. **Salary Management Page** (`/hr/salary`)

HR users can process employee salary payments with:

- **Employee List**: Display all active employees
- **Salary Processing**: Pay salaries with amount and month selection
- **Summary Cards**:
  - Total Employees count
  - Paid Salaries this month
  - Pending payments
- **Month Selection**: Choose month for salary processing
- **Automatic Wallet Updates**: Employee wallets automatically updated on payment

**Components:**

- `SalaryManagement.jsx` - Complete salary management interface

## API Endpoints

### Fund Management APIs

#### 1. Create Fund Request

```
POST /api/funds/request
Headers: Authentication required (HR role)
Body: {
  "amount": 50000,
  "purpose": "Office supplies and equipment"
}
Response: { _id, hrId, amount, purpose, status, createdAt, updatedAt }
```

#### 2. Get User's Fund Requests

```
GET /api/funds/my-requests
Headers: Authentication required (HR role)
Response: Array of fund requests
```

#### 3. Get All Fund Requests (Admin)

```
GET /api/funds
Headers: Authentication required (ADMIN role)
Response: Array of all fund requests
```

#### 4. Update Fund Request Status

```
PATCH /api/funds/[id]
Headers: Authentication required (ADMIN role)
Body: {
  "status": "APPROVED" | "REJECTED" | "PENDING"
}
Response: Updated fund request
```

### Salary Management APIs

#### 1. Process Salary Payment

```
POST /api/salary/pay
Headers: Authentication required (HR role)
Body: {
  "employeeId": "employee_id",
  "amount": 25000,
  "month": "2025-01"
}
Response: {
  "transaction": { _id, hrId, employeeId, amount, month, createdAt },
  "hrWallet": { ownerId, balance },
  "employeeWallet": { ownerId, balance }
}
```

**Process:**

1. Deducts amount from HR's wallet
2. Creates salary transaction record
3. Adds amount to employee's wallet
4. Returns both wallet states

#### 2. Get Salary Status

```
GET /api/salary/status?employeeId=<id>
Response: {
  "employeeId": "id",
  "totalPaid": 25000,
  "transactionCount": 1,
  "paidMonths": ["2025-01"],
  "lastTransaction": { ... }
}
```

#### 3. Get Salary Transactions

```
GET /api/salary/pay?month=<YYYY-MM>
Headers: Authentication required (HR role)
Response: Array of salary transactions (sorted by date)
```

## Custom Hooks

### `useFundRequests()`

Fetches user's fund requests with auto-refresh capability

```javascript
const { data, isLoading, isError, refetch } = useFundRequests();
```

### `useSalaryTransactions(month)`

Fetches salary transactions for a specific month

```javascript
const { data, isLoading, isError } = useSalaryTransactions("2025-01");
```

## Database Models

### FundRequest

```javascript
{
  hrId: ObjectId,           // Reference to HR user
  amount: Number,           // Fund amount requested
  purpose: String,          // Purpose of request
  status: String,           // PENDING, APPROVED, REJECTED
  createdAt: Date,
  updatedAt: Date
}
```

### SalaryTransaction

```javascript
{
  hrId: ObjectId,           // Reference to HR who processed payment
  employeeId: ObjectId,     // Reference to employee
  amount: Number,           // Salary amount paid
  month: String,            // Format: YYYY-MM
  createdAt: Date
}
```

### Wallet

```javascript
{
  ownerId: ObjectId,        // Reference to user (unique)
  balance: Number,          // Current balance (min: 0)
  updatedAt: Date
}
```

## UI/UX Features

### Professional Design

- **Gradient backgrounds** - Modern color schemes
- **Status badges** - Color-coded status indicators
  - Pending: Yellow
  - Approved: Green
  - Rejected: Red
- **Icons** - Lucide React icons for visual clarity
- **Responsive layout** - Works on mobile, tablet, and desktop
- **Smooth animations** - Hover effects and loading states
- **Empty states** - User-friendly messages when no data

### Form Validation

- Amount validation (must be > 0)
- Purpose field required
- Real-time error messages
- Success notifications
- Disabled states during processing

### Loading States

- Spinner animations during API calls
- Disabled buttons while processing
- Loading text indicators

## Navigation Updates

The HR sidebar has been updated with:

- **Fund Requests** link → `/hr/funds`
- **Salary Management** link → `/hr/salary`

Menu is accessible from `/app/(hr)/hr/components/Sidebar.jsx`

## Testing

### Manual Testing Steps

1. **Fund Request Flow:**
   - Navigate to `/hr/funds`
   - Fill in amount and purpose
   - Click "Submit Request"
   - Verify request appears in list with PENDING status
   - (Admin) Navigate to `/admin/funds` to approve/reject

2. **Salary Payment Flow:**
   - Navigate to `/hr/salary`
   - Select month for salary payment
   - Enter salary amount for employee
   - Click "Pay Salary"
   - Verify employee wallet is updated
   - Confirm transaction in salary transactions list

### API Testing

Test file: `/src/app/api/__tests__/funds-salary.test.js`

Run tests:

```bash
node src/app/api/__tests__/funds-salary.test.js
```

Tests include:

- Fund request creation
- Fund request retrieval (user and all)
- Status update authorization
- Salary payment processing
- Salary status tracking
- Salary transactions list

## Error Handling

All endpoints include error handling for:

- Missing authentication
- Invalid role authorization
- Invalid input data
- Database errors
- Non-existent resources

Common error responses:

```javascript
{
  error: "Forbidden";
} // 403 - No permission
{
  error: "Unauthorized";
} // 401 - No authentication
{
  error: "Invalid input";
} // 400 - Bad request
{
  error: "Employee not found";
} // 404 - Resource not found
{
  error: "Insufficient funds";
} // 400 - Payment failure
```

## Security Features

1. **Authentication Required** - All endpoints check for valid session
2. **Role-based Access Control**:
   - HR can create fund requests and process salaries
   - ADMIN can approve/reject fund requests
   - EMPLOYEE can only view their own data
3. **Wallet Validation** - Funds deducted only if HR has sufficient balance
4. **Data Isolation** - Users only see their own fund requests

## Future Enhancements

- [ ] Email notifications for fund request approvals
- [ ] Salary slip generation (PDF)
- [ ] Batch salary processing
- [ ] Payroll analytics and reports
- [ ] Recurring salary payments setup
- [ ] Fund request approval workflows
- [ ] Salary advance requests
- [ ] Tax deduction calculations

## Troubleshooting

### Fund Request Not Submitting

- Check authentication status
- Verify HR role is set correctly in session
- Check browser console for error messages

### Salary Payment Fails

- Ensure HR wallet has sufficient balance
- Verify employee exists and has EMPLOYEE role
- Check month format is YYYY-MM

### API Returns 403 Forbidden

- Verify you're logged in as the correct role
- Check session token is valid

## Code Structure

```
src/
├── app/
│   ├── (hr)/hr/
│   │   ├── funds/
│   │   │   └── page.js
│   │   ├── salary/
│   │   │   └── page.js
│   │   └── components/
│   │       ├── FundsRequestForm.jsx
│   │       ├── FundsRequestList.jsx
│   │       └── SalaryManagement.jsx
│   └── api/
│       ├── funds/
│       │   ├── request/route.js
│       │   ├── my-requests/route.js
│       │   └── [id]/route.js
│       └── salary/
│           ├── pay/route.js
│           └── status/route.js
├── hooks/
│   ├── useFundRequests.js
│   └── useSalaryTransactions.js
└── db/
    ├── FundRequest.js
    ├── SalaryTransaction.js
    └── Wallet.js
```

---

**Last Updated:** January 2, 2025
**Status:** ✅ Production Ready
