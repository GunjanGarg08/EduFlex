# EduFlex – Learning Management System (LMS)

## Overview

EduFlex is a full-stack Learning Management System (LMS) built to provide a seamless online learning experience for both students and educators. The platform enables educators to create and manage courses, while learners can browse, purchase, and access high-quality video-based learning content through a secure and scalable web application.

The project is designed with a modern production-style architecture using the MERN stack and integrates real-world services such as Clerk Authentication, Stripe Payments, Cloudinary Media Management, and cloud deployment platforms.

---

# Live Demo

### Frontend

Add your deployed Vercel link here:

```bash
https://edu-flex-black.vercel.app/
```

### Backend API

```bash
https://eduflex-backend-9unq.onrender.com
```

---

# Features

## Authentication & Authorization

* Secure authentication using Clerk
* Role-based access control for learners and educators
* Protected API routes and authenticated course access
* Persistent user sessions

## Student Features

* Browse available courses
* View course details and pricing
* Secure course purchase using Stripe
* Automatic enrollment after successful payment
* Access purchased courses
* Track enrolled courses and learning progress
* Rate purchased courses

## Educator Features

* Create and manage courses
* Upload course thumbnails and media
* Add lectures and structured course content
* Manage enrollments
* View published course information

## Payment Integration

* Stripe Checkout integration
* Stripe Webhooks for payment verification
* Automatic enrollment after payment success
* Payment status tracking in MongoDB

## Media Management

* Cloudinary integration for image and media handling
* Optimized content delivery
* Secure cloud-based media storage

## Deployment & Production Setup

* Frontend deployed on Vercel
* Backend deployed on Render
* Environment variable management
* Production-ready API integration
* Webhook configuration for Stripe and Clerk

---

# Tech Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* Clerk Authentication

## Payments

* Stripe API
* Stripe Webhooks

## Media Storage

* Cloudinary

## Deployment

* Vercel
* Render

---

# Environment Variables

## Frontend (.env)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=https://your-backend-url.com
VITE_CURRENCY=$
```

---

## Backend (.env)

```env
CURRENCY=USD
FRONTEND_URL=https://your-frontend-url.vercel.app

# MongoDB
MONGODB_URI=your_mongodb_uri

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret

# Clerk
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

# Installation & Setup

## Clone the Repository

```bash
git clone https://github.com/GunjanGarg08/EduFlex.git
cd EduFlex
```

---

## Install Frontend Dependencies

```bash
cd client
npm install
```

---

## Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# Running the Project Locally

## Start Backend Server

```bash
cd server
npm run server
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# Stripe Webhook Setup

## Local Development

Install Stripe CLI and run:

```bash
stripe listen --forward-to localhost:5000/stripe
```

Copy the generated webhook secret and add it to:

```env
STRIPE_WEBHOOK_SECRET=
```

---

## Production Webhook Endpoint

Configure Stripe webhook endpoint:

```bash
https://your-backend-url.com/stripe
```

Enable the following event:

```text
checkout.session.completed
```

---

# Deployment

## Frontend Deployment (Vercel)

* Deploy the `client` folder
* Framework Preset: Vite
* Build Command:

```bash
npm run build
```

* Output Directory:

```bash
dist
```

---

## Backend Deployment (Render)

* Deploy the `server` folder
* Add all backend environment variables
* Ensure Stripe and Clerk webhooks point to the deployed backend URL

---

# Test Payment Card

Use Stripe test mode card:

```text
4242 4242 4242 4242
```

Use:

* Any future expiry date
* Any 3-digit CVV
* Any ZIP code

---

# Future Improvements

* Course completion certificates
* Advanced analytics dashboard
* Video progress synchronization
* Wishlist and bookmarking
* Course search and filtering
* Admin dashboard
* Instructor revenue tracking
* AI-powered recommendations
* Real-time notifications

---

# Learning Outcomes

This project demonstrates practical implementation of:

* Full-stack web development
* REST API architecture
* Authentication and authorization
* Secure payment integration
* Webhook handling
* Cloud media storage
* Production deployment
* Environment variable management
* Database schema design
* Scalable application structure

---

# License

This project is developed for educational and portfolio purposes.
