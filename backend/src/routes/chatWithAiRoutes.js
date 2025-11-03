import express from "express";
import userMiddleware from "../middlewares/userMiddleware.js";
import chatWithAi from "../controllers/chatWithAiControllers.js";


const chatWithAiRoutes = express.Router();

chatWithAiRoutes.post("/chat", userMiddleware, chatWithAi);

export default chatWithAiRoutes;