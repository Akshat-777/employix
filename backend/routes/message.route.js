import express from "express";
import multer from "multer";
import path from "path";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.post("/sendMessage", upload.single("media"), sendMessage);
router.get("/getMessages", getMessages);

export default router;
