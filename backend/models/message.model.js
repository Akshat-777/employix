import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }, 
    content: { type: String, default: "" },
    mediaUrl: { type: String, default: null },
  },
  { timestamps: true }
);


export default mongoose.model("Message", messageSchema);
