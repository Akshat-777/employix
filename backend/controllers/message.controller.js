import Message from "../models/message.model.js";
import path from "path";
import fs from "fs";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, jobId, content } = req.body;
    console.log("Incoming message:", { senderId, receiverId, jobId, content });

    let mediaUrl = null;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    const message = new Message({
      senderId,
      receiverId,
      jobId,
      content,
      mediaUrl,
    });

    await message.save()
      .then(saved => {
        console.log("Message saved successfully:", saved);
        return res.status(200).json({ success: true, message: "Message sent", data: saved });
      })
      .catch(error => {
        console.error("Save error (validation or MongoDB):", error.message);
        return res.status(500).json({ success: false, message: "Failed to save message", error: error.message });
      });
  } catch (error) {
    console.error("Unexpected server error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId, jobId } = req.query;

    const messages = await Message.find({
      jobId,
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

