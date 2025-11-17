import express from "express";
import multer from "multer"; 
import isauth from "../middlewares/isauth.js";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js";

const userRouter = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

userRouter.get("/current", isauth, getCurrentUser);

userRouter.post(
  "/update",
  isauth,
  upload.single("assistantImage"),
  updateAssistant
);

userRouter.post("/asktoassistant", isauth, askToAssistant);

export default userRouter;