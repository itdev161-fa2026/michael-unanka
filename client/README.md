# Full-Stack Blog Application (React + Vite + Node + MongoDB)

This project is a full-stack blogging platform built as part of ITDEV-161.  
The application allows users to register, log in, create posts, edit posts, and delete posts with authentication and authorization. The frontend is built with **React + Vite**, and the backend uses **Node.js, Express, and MongoDB**.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and ESLint rules.

Two official plugins are available:

- **@vitejs/plugin-react** – Uses Babel/oxc and supports Fast Refresh  
- **@vitejs/plugin-react-swc** – Uses SWC for Fast Refresh

## React Compiler

The React Compiler is not enabled due to performance impact.  
Documentation: https://react.dev/learn/react-compiler/installation

## ESLint

If you are building a production app, TypeScript + type-aware lint rules are recommended:  
https://typescript-eslint.io

---

# 📘 Final Project Enhancement

## Enhancements Implemented

### ✅ 1. Toast Notifications (Easy Enhancement)
Replaced all `alert()` messages with modern, non-blocking toast notifications using **react-hot-toast**.  
Added toast feedback for:

- Logging in (success + error)
- Registering (success + error)
- Creating a post
- Editing a post
- Deleting a post
- API errors (invalid credentials, missing fields, etc.)

### ✅ 2. Date Formatting (Easy Enhancement)
Installed and used **date-fns** to show human-friendly timestamps across the app:

- Formatted post dates: `Nov 12, 2025 • 8:15 PM`
- Added relative times: `3 hours ago`
- Used consistent formatting on Post List + Post Detail pages

---

# 🎥 Video Demonstration

📌 **Video Link:** _Add your public video link here (YouTube, Loom, Google Drive)_

The video includes:

- Intro (name + enhancements)
- Demo of toast notifications across the app
- Demo of formatted timestamps
- Code highlight
- Summary of challenges + what was learned

---

# 🛠️ Features Added (Enhancement Summary)

### ⭐ Toast Notifications
- Added `<Toaster />` in the root (`main.jsx`)
- Integrated `toast.success()` and `toast.error()` in:
  - Login
  - Register
  - Post creation
  - Post editing
  - Post deletion
- Provides instant, clean UI feedback without blocking user actions

### ⭐ Date Formatting
- Implemented readable timestamps:
  - `format()` → formatted date/time
  - `formatDistanceToNow()` → "time ago" style
- Updated Post List and Post Detail components
- Improved clarity and professionalism of the UI

---

# 🔧 Technical Implementation Details

### Libraries Used
- **react-hot-toast** → toast notifications  
- **date-fns** → date/time formatting  
- **React (Vite)** → frontend  
- **Node + Express** → backend API  
- **MongoDB + Mongoose** → database  
- **JWT** → authentication  
- **bcryptjs** → password hashing  

### Key Files Updated
- `client/src/main.jsx` → added `<Toaster />`
- `client/src/pages/LoginPage.jsx` → toast success/error
- `client/src/pages/RegisterPage.jsx` → toast notifications
- `client/src/components/PostForm.jsx` → toast on create/edit
- `client/src/pages/PostList.jsx` → formatted dates
- `client/src/pages/PostDetail.jsx` → formatted dates

### Challenges Solved
- Replacing blocking alerts with async-friendly
