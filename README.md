# 📝 Blog-API — Full-Stack Blogging Platform

A modern blogging platform built with **Node.js**, **React**, **Express**, **Prisma**, and **PostgreSQL**. Features an admin dashboard for managing posts and comments, plus a public blog interface for readers.

**Quick Links:** [Features](#-features) | [Setup](#-installation) | [API Docs](#-api-documentation) | [Learnings](#-what-ive-learned)

---

## ✨ Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with secure JWT-based authentication
- **Role-Based Access Control** (AUTHOR & USER roles)
- **Protected Routes** ensuring only authenticated users can access specific features
- **Secure Password Hashing** using bcrypt

### 📝 Blog Management

- **Create & Edit Posts** with rich content support
- **Publish/Unpublish** posts with one-click toggle
- **Delete Posts** with cascading comment removal
- **View Author-Specific Posts** in admin dashboard
- **Manage Post Metadata** (title, content, published status)

### 💬 Comments System

- **Add Comments** to published posts
- **View Comments** with commenter information
- **Delete Comments** (by comment owner or post author)
- **Comment Moderation** for post owners

### 🎨 User Interface

- **Admin Dashboard** with post management interface
- **Public Blog Page** showcasing published posts
- **Login Page** with session management
- **Responsive Design** built with Tailwind CSS
- **Smooth Navigation** using React Router v7
- **Real-Time UI Updates** without page reloads


---

## 🛠 Tech Stack

### Backend

- **Node.js & Express.js** — Server runtime and framework
- **Prisma ORM** — Type-safe database access
- **PostgreSQL** — Relational database
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcrypt** — Password hashing
- **Nodemon** — Development server auto-reload

### Frontend (Admin)

- **React 19** — UI library
- **React Router v7** — Client-side routing
- **Tailwind CSS v4** — Utility-first styling
- **Vite** — Fast build tool
- **ESLint** — Code quality

### Frontend (Client)

- **React 19** — UI library
- **React Router v7** — Navigation
- **Tailwind CSS v4** — Styling
- **Vite** — Build system

### Database Schema

```prisma
User (id, username, email, password, role, posts[], comments[])
Post (id, title, content, published, authorId, author, comments[], createdAt, updatedAt)
Comment (id, content, postId, post, userId, user, createdAt, editedAt)
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### Step 1: Clone & Setup

```bash
cd Blog-API
```

### Step 2: Install Dependencies

#### Backend

```bash
cd api
npm install
```

#### Admin Frontend

```bash
cd ../admin
npm install
```

#### Client Frontend

```bash
cd ../client
npm install
```

### Step 3: Configure Environment

Create `.env` file in the `api` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

### Step 4: Database Setup

Initialize Prisma and run migrations:

```bash
cd api
npx prisma migrate dev --name init
npm run seed  # Populate with demo data
```

### Step 5: Run Development Servers

**Terminal 1 — Backend API**

```bash
cd api
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Admin Dashboard**

```bash
cd admin
npm run dev
# Runs on http://localhost:5173
```

**Terminal 3 — Client Blog**

```bash
cd client
npm run dev
# Runs on http://localhost:5174
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "AUTHOR"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: { token: "jwt-token", username, role }
```

### Post Endpoints

#### Get All Public Posts

```http
GET /posts
Authorization: Bearer {token} (optional)
```

#### Get Author's Posts

```http
GET /posts/my-posts
Authorization: Bearer {token}
```

#### Create Post

```http
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content...",
  "published": true
}
```

#### Update Post

```http
PUT /posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true
}
```

#### Toggle Publish Status

```http
PATCH /posts/:id/publish
Authorization: Bearer {token}
```

#### Delete Post

```http
DELETE /posts/:id
Authorization: Bearer {token}
```

### Comment Endpoints

#### Get All Comments

```http
GET /comments
```

#### Add Comment

```http
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great post!",
  "postId": 1
}
```

#### Delete Comment

```http
DELETE /comments/:id
Authorization: Bearer {token}
```

---

## 📁 Project Structure

```
Blog-API/
├── api/                          # Backend server
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── postController.js     # Post CRUD operations
│   │   └── commentController.js  # Comment management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── optionalAuthMiddleware.js
│   │   └── roleMiddleware.js     # Role-based access
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   ├── lib/
│   │   └── prisma.js             # Prisma client setup
│   ├── scripts/
│   │   └── seed.js               # Demo data seeding
│   ├── app.js                    # Express app configuration
│   └── package.json
│
├── admin/                        # Admin dashboard (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreatePost.jsx    # Create post form
│   │   │   ├── EditPost.jsx      # Edit post form
│   │   │   ├── MyPosts.jsx       # Dashboard with posts & comments
│   │   │   └── LoginPage.jsx     # Admin login
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── client/                       # Client blog (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx
│   │   │   └── PostsPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🎬 Demo

Add screenshots and video links here.

---

## 📖 What I've Learned

- ✅ **Express & Middleware** — Request/response pipeline, error handling
- ✅ **Prisma ORM** — Database queries, relationships, transactions
- ✅ **JWT Authentication** — Token generation and validation
- ✅ **Role-Based Access Control** — Permission management
- ✅ **React Hooks** — useState, useEffect, custom hooks
- ✅ **React Router v7** — Client-side routing and navigation
- ✅ **Fetch API** — HTTP requests with proper headers
- ✅ **Tailwind CSS** — Responsive design and utility classes
- ✅ **Form Handling** — Controlled components and validation
- ✅ **State Management** — Lifting state and functional updates

---

## 🔒 Security

- JWT tokens stored in localStorage
- Passwords hashed with bcrypt
- Role-based access control on all endpoints
- Input validation on client and server
- SQL injection protection via Prisma ORM

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License

---

## 🎓 Created By

**Mohamed Mosilhy** — Full-Stack Developer

---

<div align="center">

**Built with ❤️ using Node.js, React, and PostgreSQL**

</div>
