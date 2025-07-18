---

# 🛠️ Acme Corp Backend (`backend-acme`)

This is the backend service for the **Acme Corp Patient Dashboard**, designed to support patient management, weight tracking, shipment monitoring, and secure user authentication for the GLP-1 weight-loss program.

---

## 🚀 Features

* 🔐 **JWT-based Authentication**
* 🧑‍⚕️ **User Profile & Health Data Management**
* 📦 **Shipment and Medication Tracking**
* 📉 **Weight Entries & Progress Calculation**
* 📊 **RESTful API with OpenAPI Docs**
* 📈 **Scalable Architecture with PostgreSQL + Prisma**

---

## ⚙️ Tech Stack

| Layer      | Tech                      |
| ---------- | ------------------------- |
| Runtime    | Node.js (v18+)            |
| Framework  | Express.js                |
| ORM        | Prisma                    |
| Database   | PostgreSQL                |
| Auth       | JWT with Refresh Tokens   |
| Docs       | Swagger / OpenAPI         |
| Deployment | Docker, AWS (proposed)    |
| Monitoring | AWS CloudWatch (proposed) |

---

## 🧾 Folder Structure

```
backend-acme/
│
├── prisma/               # Prisma schema & migrations
├── src/
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Auth, error handling, validation
│   ├── models/           # Database models via Prisma
│   ├── routes/           # API endpoints
│   ├── utils/            # Helpers and utilities
│   ├── config/           # App, DB, and JWT configs
│   └── index.ts          # Server entry point
├── .env
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication Flow

* JWT Access & Refresh Tokens
* Refresh token rotation with expiry
* Session security via `httpOnly` cookies
* Role-based access control (RBAC-ready)

---

## 🔗 API Endpoints

```
# Auth
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

# User
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/dashboard-stats

# Weight Entries
GET    /api/weight-entries
POST   /api/weight-entries
PUT    /api/weight-entries/:id
DELETE /api/weight-entries/:id

# Shipments
GET    /api/shipments
GET    /api/shipments/:id
POST   /api/shipments
PUT    /api/shipments/:id

# Medications
GET    /api/medications
```

📘 *Auto-generated Swagger docs available at:*
`http://localhost:8000/api-docs`

---

## 🧪 Environment Variables (`.env`)

```env
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
TOKEN_EXPIRY=15m
REFRESH_EXPIRY=7d
```

---

## 🧱 Database Schema

Handled via **Prisma**, including:

* `users`
* `weight_entries`
* `medications`
* `shipments`

Run migrations:

```bash
npx prisma migrate dev
```

---

## 🧪 Testing (Optional Setup)

Use tools like:

* Jest for unit testing
* Supertest for API testing
* Postman or Thunder Client for manual testing

---

## ⚙️ Development Setup

### 1. Install Dependencies

```bash
cd backend-acme
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root using the sample above.

### 3. Start the Server

```bash
npm run dev
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed Data (Optional)

```bash
npx prisma db seed
```

---

## 🐳 Docker Support

```bash
# Build image
docker build -t acme-backend .

# Run container
docker run -p 8000:8000 acme-backend
```

---

## 🛡 Security Practices

* Passwords hashed using `bcrypt`
* JWT stored in `httpOnly` cookies
* Input validation via middleware
* Role-based access control (future)
* HTTPS, WAF & secrets management (AWS, proposed)

---

## 🧭 Future Enhancements

* 🔔 WebSocket-based real-time shipment updates
* 📱 Integration with mobile app backend
* 🧠 Health insights with ML
* 📅 Appointment scheduling APIs
* 🔒 2FA for added user security

---

## 📝 License

This backend is part of a take-home challenge and is intended for demonstration purposes only.

---

## 👥 Contact

For backend-related queries or code walkthroughs, feel free to reach out.

---

**Built with ❤️ for Acme Corp Take-Home Challenge**
