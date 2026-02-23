# 🌿 Digital Wellness Recommendation Engine

A full-stack **Digital Wellness Recommendation Engine** web application that helps users monitor and improve their daily wellness activities such as screen time, study hours, sleep, and exercise.

---

## 🚀 Features

- 🔐 User Registration and Login with JWT Authentication  
- 🛡 JWT-only authentication flow (no password hashing)  
- 📊 Track daily wellness activities  
- 📈 Visual analytics using Chart.js graphs  
- 🧠 Dashboard with wellness score and recommendations  
- 💾 Persistent data storage using MongoDB  
- 💻 Responsive modern user interface  

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- React.js
- Chart.js

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication & Security
- JWT (JSON Web Token)

---

## 🏗 Architecture

```
Frontend (React.js)
        │
        ▼
Backend API (Node.js + Express.js)
        │
        ▼
Database (MongoDB)
        │
        ▼
Authentication & Security (JWT only)
```

---

## 📂 Project Structure

```
Digital_Wellness/
│
├── client/          # React frontend
├── server/          # Node.js backend
├── test_api.js      # API test file
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/ANBU2006/Digital_Wellness.git
cd Digital_Wellness
```

### 2. Backend Setup

```
cd server
npm install
npm run dev
```

### 3. Frontend Setup

```
cd client
npm install
npm ren dev
```

---

## 🔐 Environment Variables

Create `.env` file inside server folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
---

## 👨‍💻 Author

**Salai Anbarasan S**

GitHub: https://github.com/ANBU2006

---
