import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5002";
//const FLASK_URL = "http://127.0.0.1:5002";
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const formData = new FormData();
        formData.append("resume", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        
        const response = await axios.post(
            `${FLASK_URL}/upload-resume`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
                withCredentials: true,
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error forwarding to Flask server:", error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.data.error || "Internal error from NLP server",
                details: error.response.data,
            });
        } else {
            res.status(500).json({ error: "Failed to communicate with NLP server" });
        }
    }
});

export default router;
