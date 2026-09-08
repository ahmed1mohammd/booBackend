# booBackend

Enterprise REST API Backend for **BOO Automotive & Spare Parts Platform** built with Node.js, Express, MongoDB (Mongoose), Cloudinary, and Fawaterk Payment Gateway integration.

## Features
- **Authentication & Roles**: Admin JWT authentication and secure session management.
- **Products & Spare Parts Management**: CRUD operations with categories, specifications, image gallery, and inventory tracking.
- **Vehicle Showroom API**: Car listings, technical specs, import request handling.
- **Maintenance Booking**: Service scheduling and status tracking.
- **Orders & Checkout**: Cart processing, order management, and Fawaterk payment integration.
- **Contact & Inquiries**: Customer leads and inquiries pipeline.

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Database Seeding (Optional)
```bash
npm run seed
```
