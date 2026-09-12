# Anima Home

A production-ready **full-stack company website and e-commerce platform** built with Next.js, designed for a Persian RTL audience.

🔗 **Live:** https://anima-home.ir

## 🚀 About the Project

Anima Home is a real-world web application combining a corporate website with an e-commerce platform.

The project covers the complete flow from product management and authentication to shopping cart, checkout, orders, and customer account management.

## ✨ Key Features

- 🏢 Corporate website with Projects, Services, Materials and Blog sections
- 🛍️ Product catalog with variants, pricing, discounts and stock management
- 🛒 Shopping cart and checkout flow
- 📦 Order creation and order management
- 👤 Customer account and order history
- 🔐 Authentication with email/password and phone OTP
- 👨‍💼 Admin dashboard for products, projects, users, orders and coupons
- 📁 Secure image, PDF and video uploads
- 🔎 SEO-friendly dynamic routes and sitemap
- 📱 Responsive Persian RTL UI
- ⚡ Server Actions with server-side validation and authorization

## 🛠️ Tech Stack

**Frontend**

- Next.js 16 — App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- React Hook Form

**Backend & Database**

- Next.js Server Actions & Route Handlers
- Drizzle ORM
- PostgreSQL
- Zod
- Better Auth

**Infrastructure**

- Chabokan PaaS
- Arvan Cloud Object Storage
- S3-compatible storage

## 🔐 Security

Security was considered throughout the application:

- Server-side authentication and authorization
- Protected admin and customer routes
- Role-based admin access
- Zod validation for user input
- Rate limiting for sensitive operations
- HTTP-only secure cookies
- Resource ownership checks
- Security headers and Content Security Policy
- Restricted upload MIME types and file sizes

## 📁 Architecture

```text
app/
├── (auth)/          # Authentication pages
├── (root)/          # Public website & shop
├── admin/           # Admin dashboard
└── api/             # API route handlers

components/          # Reusable UI components
db/                  # Drizzle schema & migrations
lib/
├── actions/         # Server Actions
├── auth/            # Authentication & authorization
├── queries/         # Database queries
└── validations/     # Zod schemas
```

## 💡 What This Project Demonstrates

This project demonstrates practical experience with:

- Building full-stack applications with **Next.js App Router**
- Designing database schemas with **PostgreSQL + Drizzle ORM**
- Implementing authentication and authorization
- Building reusable and responsive UI components
- Working with Server Actions and server-side data fetching
- Form handling and validation
- E-commerce business logic
- File storage and upload security
- SEO and performance considerations
- Deploying and maintaining a production web application

## 📌 Development Focus

The project is intentionally kept **simple, maintainable and practical**, avoiding unnecessary abstractions and over-engineering.

---

**Built with Next.js, TypeScript and PostgreSQL.**
