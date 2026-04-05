# Employix - Premium Job Portal

Employix is a modern, full-stack job portal designed to streamline the recruitment process for both students and recruiters. Built with high-performance technologies, it features real-time communication, a sophisticated admin dashboard, and a seamless user experience.

## 🚀 Features

### For Students
- **Smart Job Search**: Filter and browse jobs by categories and title.
- **Profile Management**: Upload resumes, update personal bio, and track applications.
- **Real-time Chat**: Direct communication with recruiters via integrated messaging.
- **Application Tracking**: Monitor the status of applied jobs in real-time.

### For Recruiters
- **Company Management**: Register and manage multiple company profiles.
- **Job Posting**: Create, update, and manage job listings with ease.
- **Applicant Tracking**: View applications, review resumes, and manage hiring statuses.
- **Real-time Communication**: Message potential candidates instantly.

### AI-Powered Analysis
- **Resume Parsing**: Automatically extracts skills and experience from PDF resumes using NLP.
- **Job Matching**: AI-driven recommendation engine that matches candidates to jobs based on skill overlap.
- **Skill Gap Analysis**: Identifies missing skills required for specific job roles to help students improve.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [Redux Toolkit](https://redux-toolkit.js.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/).
- **Backend (Node.js)**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) (Mongoose), [Socket.io](https://socket.io/).
- **AI/ML Logic (Python)**: [Flask](https://flask.palletsprojects.com/), [spaCy](https://spacy.io/) (NLP), [PyMuPDF](https://pymupdf.readthedocs.io/).
- **Storage/File Handling**: [Cloudinary](https://cloudinary.com/) for media, [Multer](https://github.com/expressjs/multer) for file uploads.
- **Communication**: [Nodemailer](https://nodemailer.com/) for email notifications, Socket.io for real-time chat.

## 📦 Installation & Setup

### Prerequisites
- Node.js & npm installed
- Python 3.9+ installed
- MongoDB account (Atlas)
- Cloudinary account

### Backend (Node.js) Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder (use `.env.example` as a template).

### Python AI Logic Setup
1. Navigate to the python logic directory:
   ```bash
   cd backend/python_logic
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```
4. Create a `.env` file in the `python_logic` folder:
   ```env
   MONGO_URI=your_mongodb_uri
   FRONTEND_URL=http://localhost:3000
   FLASK_PORT=5002
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
employix/
├── backend/          # Node.js Express server
│   ├── controllers/  # API logic
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   └── index.js      # Entry point
├── frontend/         # Next.js Application
│   ├── src/app/      # App router pages
│   ├── components/   # UI components
│   └── redux/        # State management
└── .gitignore        # Root level ignore
```

## 📄 License
This project is licensed under the ISC License.
