from flask import Flask, request, jsonify
from flask_cors import CORS

import fitz  
import spacy  

from pymongo import MongoClient 
from bson import ObjectId 

from dotenv import load_dotenv  
import os 
import traceback  


load_dotenv()


app = Flask(__name__)


FRONTEND_URL = os.getenv("FRONTEND_URL")
CORS(app, origins=[FRONTEND_URL], supports_credentials=True)


print(" Loading spaCy model...")
nlp = spacy.load("en_core_web_sm")
print(" spaCy model loaded.")


mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise Exception("MONGO_URI not set in environment variables")

print(" Connecting to MongoDB...")
client = MongoClient(mongo_uri)
db = client["test"]
jobs_collection = db["jobs"]
print(" Connected to MongoDB.")


def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    return "".join(page.get_text() for page in doc)

def extract_tokens(text):
    doc = nlp(text)
    return [token.text.lower() for token in doc if not token.is_stop and not token.is_punct]

def clean_document(doc):
    if isinstance(doc, list):
        return [clean_document(item) for item in doc]
    elif isinstance(doc, dict):
        return {k: clean_document(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc

def match_jobs(extracted_skills):
    print(" Matching jobs...")
    matched_jobs = []
    extracted_skills_set = set(extracted_skills)

    for job in jobs_collection.find():
        requirements = job.get("requirements", [])
        if not isinstance(requirements, list):
            continue

        job_skills = set(skill.lower() for skill in requirements)
        intersection = job_skills & extracted_skills_set
        union = job_skills | extracted_skills_set
        match_score = len(intersection) / len(union) if union else 0

        if match_score > 0:
            job["match_score"] = match_score
            job["skills"] = requirements
            matched_jobs.append(clean_document(job))

    matched_jobs.sort(key=lambda j: j["match_score"], reverse=True)
    print(f" Found {len(matched_jobs)} matched jobs.")
    return matched_jobs[:5]


@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    print(" Received upload request")
    if "resume" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["resume"]
    print(f" File received: {file.filename}")
    try:
        print(" Extracting text from resume...")
        text = extract_text_from_pdf(file)

        print(" Extracting tokens from resume...")
        raw_tokens = extract_tokens(text)

        print(" Fetching master skills from DB...")
        master_skills = set()
        for job in jobs_collection.find({}, {"requirements": 1}):
            for skill in job.get("requirements", []):
                master_skills.add(skill.lower())

        filtered_skills = sorted(set(token for token in raw_tokens if token in master_skills))
        print(" Extracted skills:", filtered_skills)

        recommended_jobs = match_jobs(filtered_skills)

        return jsonify({
            "extracted_skills": filtered_skills,
            "recommended_jobs": recommended_jobs
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    PORT = int(os.getenv("FLASK_PORT", 5002))
    print(f" Starting Flask server at http://0.0.0.0:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
