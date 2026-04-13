# Employix - Premium Job Portal 🚀

**Employix** is a high-performance, full-stack recruitment platform designed to bridge the gap between top talent and world-class companies. Built with a modern microservices architecture, it features real-time communication, AI-driven resume analysis, and a stunning, premium user interface.

---

## ✨ Key Features

### 👤 For Candidates (Students)
- **Advanced Job Discovery**: Multi-parameter filtering (Title, Location, Salary in LPA).
- **Interactive Profile**: Dynamic resume management and real-time application tracking.
- **Save for Later**: Keep track of high-interest roles with a dedicated "Saved Jobs" dashboard.
- **Smart Chat**: Real-time direct messaging with recruiters, featuring persistent file sharing and **image previews**.

### 💼 For Recruiters
- **Company Branding**: Register and manage professional company profiles.
- **Robust Job Management**: Post, edit, and track job listings with detailed salary insights.
- **Applicant Insights**: View candidate profiles and download resumes with a single click.

### 🧠 AI-Powered Resume Analysis
- **NLP Parsing**: Automatically Extracts skills and experience from PDF resumes via a specialized Python/Flask microservice.
- **Skill Alignment**: AI-driven matching engine that identifies the overlap between candidate resumes and job descriptions.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.steveney.com/) (Premium Toasts)

### Backend
- **Core API**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Real-time**: [Socket.io](https://socket.io/)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (Resume, Profiles, Chat Media)

### AI Service
- **Microservice**: [Flask](https://flask.palletsprojects.com/) (Python)
- **NLP**: [spaCy](https://spacy.io/) & [PyMuPDF](https://pymupdf.readthedocs.io/)

---

## 📂 Project Architecture

```text
employix/
├── backend/            # Express.js API
│   ├── controllers/    # Business Logic
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Layer
│   └── python_logic/   # Flask NLP Microservice
└── frontend/           # Next.js UI
    ├── src/app/        # Pages & Layouts
    ├── components/     # Reusable UI
    └── redux/          # Global State
```

---

## 🔧 Environment Configuration

To run this project locally, configure the following:

### Backend `.env`
```env
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:3000
FLASK_URL=http://localhost:5000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📄 License
This project is licensed under the **ISC License**. Built with ❤️ by the Employix Team.
