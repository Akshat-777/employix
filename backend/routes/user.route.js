import express from "express";
import { login, logout, register, updateProfile, getUserById, updateProfilePhoto, toggleSaveJob} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile); 
router.route("/profile/photo/update").post(isAuthenticated,singleUpload,updateProfilePhoto); 
router.route("/profile/save-job/:jobId").post(isAuthenticated,toggleSaveJob); 
router.route("/:id").get(getUserById);
export default router;

