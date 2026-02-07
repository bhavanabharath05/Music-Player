# 🎵 Music Player (MERN Stack)

A full-stack music player application built using the MERN stack.  
Users can explore music, manage favourites, and maintain profiles with secure authentication.

---

## 🚀 Features

- User authentication (Signup / Login)
- Forgot & Reset Password (Email-based)
- Browse music using Jamendo API
- Play songs with a built-in audio player
- Add / Remove songs from favourites
- Update user profile and avatar
- Secure JWT-based authentication

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Mailtrap)
- ImageKit

---

## 📁 Project Structure
Music-Player/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── index.js
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── index.html
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/bhavanabharath05/Music-Player.git
cd Music-Player
cd backend
npm install
npm run dev
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
JAMENDO_CLIENT_ID=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
MAILTRAP_HOST=
MAILTRAP_PORT=
MAILTRAP_USER=
MAILTRAP_PASS=
FRONTEND_URL=http://localhost:5173
cd frontend
npm install
npm run dev



