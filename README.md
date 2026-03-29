# Fuel Management System 🚗⛽

A comprehensive MERN (MongoDB, Express, React, Node.js) application for managing vehicle fuel quotas and dispensing. Admin users can manage vehicles and quotas, operators can dispense fuel, and regular users can track their vehicle information and fuel usage.

**🌐 Live Website**: [https://fuelpasssystemlive.netlify.app/](https://fuelpasssystemlive.netlify.app/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing Guide](#testing-guide)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure login/registration with NIC-based accounts
- ✅ **Role-Based Access Control** - Admin, Operator, and User roles
- ✅ **Vehicle Management** - Add, delete, and manage vehicles (one vehicle per user)
- ✅ **Fuel Quota System** - Set and manage weekly fuel quotas per vehicle type
- ✅ **QR Code Integration** - Generate and scan QR codes for vehicle verification
- ✅ **Operator Fuel Dispensing** - Dispense fuel with real-time quota validation
- ✅ **Admin Dashboard** - Search vehicles, update quotas, manage users
- ✅ **Automatic Weekly Reset** - Quota resets every Sunday at 00:00 UTC
- ✅ **Real-Time Validation** - Prevent duplicates, enforce data integrity
- ✅ **Responsive UI** - Works on desktop and mobile devices

### Advanced Features
- 📱 Mobile-optimized QR code scanner with camera access
- 🔐 JWT-based authentication with secure token handling
- 📊 Real-time vehicle quota progress visualization
- 🔍 Admin vehicle search with instant results
- 🌐 Full CRUD operations for vehicle management
- ⚡ Optimized performance with Vite bundler

---

## 🛠 Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **Vite** 8.0.1 - Build tool and dev server
- **Axios** - HTTP client with JWT interceptors
- **React Router** 7.13.2 - Client-side routing
- **jsQR** - QR code detection library
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express** 5.2.1 - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** 9.3.3 - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks
- **dotenv** - Environment variables

---

## 📁 Project Structure

```
Project 5 - Fuel Management System/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── AdminController.js    # Admin operations
│   │   ├── AuthController.js     # Authentication
│   │   ├── FuelController.js     # Fuel dispensing
│   │   ├── operatorController.js # Operator actions
│   │   ├── QRController.js       # QR code generation
│   │   ├── VehicleController.js  # Vehicle management
│   │   └── VerificationController.js # Vehicle verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Vehicle.js            # Vehicle schema
│   │   ├── FuelTransaction.js    # Transaction records
│   │   └── SystemSettings.js     # System configuration
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── fuelRoutes.js         # Fuel endpoints
│   │   ├── operatorRoutes.js     # Operator endpoints
│   │   ├── qrRoutes.js           # QR endpoints
│   │   ├── vehicleRoutes.js      # Vehicle endpoints
│   │   └── verificationRoutes.js # Verification endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role authorization
│   ├── utils/
│   │   ├── generateToken.js      # JWT token creation
│   │   ├── qrGenerator.js        # QR code generation
│   │   └── cronJobs.js           # Scheduled jobs
│   ├── cron/
│   │   └── quotaReset.js         # Weekly quota reset
│   ├── .env                      # Environment variables
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── adminApi.js       # Admin API calls
│   │   │   ├── authApi.js        # Auth API calls
│   │   │   ├── operatorApi.js    # Operator API calls
│   │   │   ├── vehicleApi.js     # Vehicle API calls
│   │   │   └── axios.js          # Axios configuration
│   │   ├── components/
│   │   │   ├── Layout.jsx        # App layout wrapper
│   │   │   └── QRScanner.jsx     # QR code scanner
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Home page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── UserDashboard.jsx # User dashboard
│   │   │   ├── OperatorDashboard.jsx # Operator dashboard
│   │   │   └── AdminDashboard.jsx    # Admin dashboard
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   ├── vite.config.js            # Vite configuration
│   ├── package.json
│   └── index.html                # HTML template
└── README.md                     # This file
```

---

## 📦 Installation Guide

### Prerequisites
- **Node.js** (v14.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas Account** - [Create Free Account](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Web Browser** - Chrome, Firefox, Safari, or Edge

### Step 1: Clone or Download the Project

```bash
# Clone from repository
git clone <repository-url>
cd "Project 5 - Fuel Management System"

# OR download as ZIP and extract
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Create `.env` File

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development
```

**How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new cluster (choose shared tier for free)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<database>` with your values

#### 2.3 Verify Backend Connection

```bash
npm start
```

Expected output:
```
📅 Quota reset scheduler initialized (runs every Sunday at 00:00 UTC)
Server running on port 5000
MongoDB Connected: <cluster-name>
```

Press `Ctrl+C` to stop the server temporarily.

### Step 3: Frontend Setup

#### 3.1 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Create `.env` File

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: For production deployment on Netlify, this is automatically configured to use the Railway backend URL.

#### 3.3 Verify Frontend Runs

```bash
npm run dev
```

Expected output:
```
VITE v8.0.3 ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Press `Ctrl+C` to stop the server temporarily.

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Express server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Default Fuel Quotas (per vehicle type)

These are set automatically on first run:
- **Car**: 50L per week
- **Bike**: 20L per week
- **Van**: 100L per week
- **Bus**: 150L per week
- **Three-wheel**: 30L per week

---

## 🌐 Live Deployment

### Backend (Railway)
- **URL**: https://fuelpasssystemlive-production.up.railway.app
- **Provider**: Railway
- **Database**: MongoDB Atlas

### Frontend (Netlify)
- **URL**: https://fuelpasssystemlive.netlify.app
- **Provider**: Netlify
- **Build**: Vite

---

## 🚀 Running the Application

### Option 1: Run Both Servers Locally (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

### Option 2: Production Build Locally

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Serve Backend in Production:**
```bash
cd backend
NODE_ENV=production npm start
```

---

## 🧪 Testing Guide

### Quick Start Test (5 minutes)

#### 1. Register a New Account
- Go to http://localhost:5173
- Click "Don't have an account? Register"
- Fill in the form:
  - **NIC**: `123456789V` (unique per user)
  - **First Name**: Your first name
  - **Last Name**: Your last name (optional)
  - **Mobile**: `9876543210` (exactly 10 digits)
  - **Address**: Your address
  - **Password**: Your password (min 6 chars)
- Click "Create Account"
- ✓ Should redirect to login page

#### 2. Login
- Enter NIC: `123456789V`
- Enter Password: Your password
- Click "Login"
- ✓ Should show User Dashboard

#### 3. Add a Vehicle
- On User Dashboard, click "Add New Vehicle"
- Fill in:
  - **Vehicle Number**: `ABC-1234` (unique)
  - **Vehicle Type**: Select from dropdown (Car, Bike, Van, Bus, Three-wheel)
  - Click "Add Vehicle"
- ✓ Vehicle should appear in the list below
- ✓ QR code should be displayed

#### 4. Test One-Vehicle Rule
- Try to add another vehicle
- ✓ Should show error: "User can only have one vehicle"

#### 5. Test QR Code
- Click on the QR code image
- ✓ QR code should open in new tab or download

#### 6. Test Vehicle Deletion
- Click "Delete Vehicle" button
- Confirm deletion
- ✓ Vehicle should be removed from list
- ✓ Form should show "No vehicles registered"

---

### Full Testing Checklist (15 minutes)

#### Authentication Tests
- [ ] Register with valid data → Success
- [ ] Register with duplicate NIC → Error: "NIC already registered"
- [ ] Register with duplicate mobile → Error: "Mobile number already registered"
- [ ] Register with invalid mobile (<10 digits) → Error: "Mobile number must be exactly 10 digits"
- [ ] Register with invalid mobile (non-numeric) → Error: "Mobile number must be exactly 10 digits"
- [ ] Register without last name → Success (last name is optional)
- [ ] Login with correct credentials → Success
- [ ] Login with wrong password → Error: "Invalid credentials"
- [ ] Access protected page without login → Redirect to login

#### Vehicle Management Tests (User)
- [ ] Add vehicle → Success
- [ ] Try to add second vehicle → Error: "User can only have one vehicle"
- [ ] Delete vehicle → Success with confirmation
- [ ] Add vehicle again → Success
- [ ] QR code displays correctly
- [ ] QR code is unique per vehicle

#### Operator Tests
- [ ] Login as operator account
- [ ] Scan QR code using camera
- [ ] Verify vehicle shows owner details
- [ ] Enter fuel amount within quota → Success
- [ ] Enter fuel amount exceeding quota → Error: "Exceeds available quota"
- [ ] Fuel transaction appears in history

#### Admin Tests
- [ ] Login as admin account
- [ ] View all users count
- [ ] View all vehicles count
- [ ] Search for vehicle by registration number
  - [ ] Enter "ABC-1234" → Vehicle appears
  - [ ] Enter non-existent vehicle → No results
  - [ ] Click "Clear" → Search results disappear
- [ ] Update vehicle quota from search results
  - [ ] Enter new quota value
  - [ ] Click "Update"
  - [ ] ✓ Quota updates in search results
  - [ ] ✓ Quota updates in vehicle list below
- [ ] Update vehicle quota from vehicle list
  - [ ] Enter new quota value
  - [ ] Click "Update"
  - [ ] ✓ Quota updates immediately

#### Feature Tests
- [ ] Weekly quota resets on Sunday at 00:00 UTC
- [ ] Fuel transactions recorded correctly
- [ ] Remaining quota decreases after fuel dispensing
- [ ] Page refresh maintains login session
- [ ] Mobile responsive layout works
- [ ] All forms show validation messages
- [ ] All API errors show user-friendly messages

#### Data Validation Tests
- [ ] Mobile number limited to 10 digits (no more input after 10)
- [ ] Mobile number shows character counter (X/10)
- [ ] Mobile number accepts only numeric input
- [ ] NIC field is unique
- [ ] Mobile field is unique
- [ ] Vehicle number is unique
- [ ] Passwords must match during registration

#### UI/UX Tests
- [ ] All buttons are clickable
- [ ] Loading states display correctly
- [ ] Error messages are clear and helpful
- [ ] Success messages appear after actions
- [ ] Layout is responsive on mobile (use browser DevTools)
- [ ] All links work correctly
- [ ] Forms clear after successful submission
- [ ] No console errors (press F12 to check)

---

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - Login user
```

### Vehicle Endpoints

```
POST   /api/vehicle/add             - Add new vehicle
GET    /api/vehicle/my-vehicles     - Get user's vehicles
DELETE /api/vehicle/:id             - Delete vehicle
```

### Operator Endpoints

```
POST   /api/operator/verify-vehicle - Verify vehicle
POST   /api/operator/fuel-vehicle   - Dispense fuel
```

### Admin Endpoints

```
GET    /api/admin/users             - Get all users
GET    /api/admin/vehicles          - Get all vehicles
GET    /api/admin/search            - Search vehicle
POST   /api/admin/update-quota      - Update fuel quota
```

### QR Code Endpoints

```
GET    /api/qr/vehicle/:id          - Generate QR code
```

---

## 👥 User Roles & Permissions

### Regular User
- ✅ Register and login
- ✅ Add/delete one vehicle
- ✅ View vehicle QR code
- ✅ View fuel transaction history
- ✅ View remaining quota

### Operator
- ✅ All User permissions
- ✅ Scan QR codes
- ✅ Verify vehicles
- ✅ Dispense fuel
- ✅ View transaction history

### Admin
- ✅ All Operator permissions
- ✅ View all users
- ✅ View all vehicles
- ✅ Search vehicles
- ✅ Update fuel quotas
- ✅ Manage system settings

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `Connection refused` or `ECONNREFUSED`

**Solution**:
1. Check MongoDB Atlas is accessible
2. Verify IP address is whitelisted (set to 0.0.0.0 for development)
3. Check connection string in `.env`:
   - Username and password are URL encoded
   - Database name is included
   - `?retryWrites=true&w=majority` is appended

```bash
# Test MongoDB URI in Node.js
node -e "console.log(require('url').format(process.env.MONGODB_URI))"
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Windows - Stop process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux - Stop process on port 5000
lsof -i :5000
kill -9 <PID>
```

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Ensure backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env` is correct
3. Backend has CORS enabled for `http://localhost:5173`

### Vite Not Starting

**Error**: `Port 5173 already in use` or build fails

**Solution**:
```bash
# Install dependencies again
cd frontend
npm install

# Clear cache
npm cache clean --force

# Start with specific port
npm run dev -- --port 3000
```

### JWT Token Expired

**Error**: `Token is not valid` or `Unauthorized`

**Solution**:
1. Clear browser localStorage: Open DevTools (F12) → Application → Clear localStorage
2. Logout and login again
3. Check JWT_SECRET is consistent between sessions

### QR Scanner Not Working

**Error**: `Camera access denied` or `NotAllowedError`

**Solution**:
1. Check browser permissions for camera access
2. Allow camera access in browser settings
3. Use HTTPS or localhost (some browsers require secure context for camera)
4. Use fallback mode - manually enter vehicle number instead of scanning

### Quota Reset Not Working

**Error**: Quota not resetting on Sunday

**Solution**:
1. Check server is running continuously
2. Verify cron job initialization message appears on startup
3. Check MongoDB has write permissions
4. Quota resets at **Sunday 00:00 UTC** (adjust timezone if needed)

### Cannot Register - Mobile Number Error

**Error**: `Mobile number must be exactly 10 digits`

**Solution**:
1. Enter exactly 10 numeric digits
2. No spaces, dashes, or special characters
3. Mobile field shows counter: X/10 digits
4. Field won't accept input after 10 digits

### Cannot Register - Duplicate NIC or Mobile

**Error**: `NIC already registered` or `Mobile number already registered`

**Solution**:
1. Use a unique NIC (not previously registered)
2. Use a unique mobile number (not previously registered)
3. Check with admin if account already exists
4. Use different registration details

---

## 📱 Testing on Mobile Device

### Setup
1. Find your computer's local IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.x.x)
   
   # Mac/Linux
   ifconfig
   ```

2. Start frontend with host exposed:
   ```bash
   cd frontend
   npm run dev -- --host
   ```

3. On mobile device, visit: `http://<your-ip>:5173`

4. Test QR code scanner with actual camera access

---

## 📊 Database Schema

### User Model
```javascript
{
  NIC: String (unique),
  firstName: String,
  lastName: String (optional),
  mobile: String (unique, length: 10),
  address: String,
  password: String (hashed),
  role: String (user/operator/admin),
  createdAt: Date
}
```

### Vehicle Model
```javascript
{
  vehicleNumber: String (unique),
  vehicleType: String (car/bike/van/bus/threewheel),
  weeklyQuota: Number,
  remainingQuota: Number,
  user: ObjectId (reference to User),
  qrCode: String,
  createdAt: Date
}
```

### FuelTransaction Model
```javascript
{
  vehicle: ObjectId,
  operator: ObjectId,
  amount: Number,
  previousQuota: Number,
  newQuota: Number,
  timestamp: Date
}
```

---

## 🤝 Contributing

To contribute to this project:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in browser console (F12)
3. Check backend logs for API errors
4. Verify all environment variables are set correctly

---

## 🎉 Ready to Test!

Your Fuel Management System is now ready for testing. Follow the **Testing Guide** section above to validate all features before deployment.

**Quick Command Reference:**
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# Open in browser
http://localhost:5173
```

Happy testing! 🚀
