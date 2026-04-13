import express from "express";
import multer from "multer";
import path from "path";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


router.post("/sendMessage", upload.single("media"), sendMessage);
router.get("/getMessages", getMessages);

export default router;
