# AFS ACADEMY

**AFS Academy** is a comprehensive educational platform designed to streamline course management, student engagement, and administrative operations. The system comprises a robust backend server, a modern web dashboard for administration, and a mobile application for students.

## 🚀 Technology Stack

### **Server (Backend)**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (via Sequelize ORM)
- **Authentication:** JWT & bcryptjs
- **Key Dependencies:** `axios`, `dotenv`, `cors`, `helmet`, `multer` (for file uploads), `nodemailer` (emails).

### **Web (Admin Dashboard)**
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State/Data:** Axios for API calls
- **Language:** TypeScript/JavaScript

### **Mobile (Student App)**
- **Framework:** Flutter (Dart)
- **Features:** Course viewing, profile management, and more.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server
- Flutter SDK (for mobile app)
- Git

### 1. clone the Repository
```bash
git clone https://github.com/allumnova/AFS-ACADEMY.git
cd AFS-ACADEMY
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

**Environment Variables:**
Create a `.env` file in the `server` directory with the following keys (example):
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=afs_academy
JWT_SECRET=your_jwt_secret
```

**Run the Server:**
```bash
# Development mode
npm run dev

# Production
npm start
```

### 3. Web Dashboard Setup
Navigate to the web directory and install dependencies:
```bash
cd ../web
npm install
```

**Run the Web App:**
```bash
# Development server
npm run dev

# Build for production
npm run build
npm start
```

### 4. Mobile App Setup
Navigate to the mobile directory:
```bash
cd ../mobile
flutter pub get
```

**Run the Mobile App:**
```bash
flutter run
```

---

## 📂 Project Structure

```
AFS-ACADEMY/
├── server/         # Node.js/Express Backend
│   ├── models/     # Sequelize Database Models
│   ├── routes/     # API Routes
│   ├── app.js      # Entry point
│   └── ...
├── web/            # Next.js Frontend
│   ├── app/        # App Router pages
│   ├── components/ # Reusable UI components
│   └── ...
├── mobile/         # Flutter Mobile Code
│   ├── lib/        # Dart source code
│   └── ...
└── README.md       # Project Documentation
```

## 🤝 Contribution
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.