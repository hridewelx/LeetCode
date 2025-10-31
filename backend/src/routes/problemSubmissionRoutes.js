import express from "express";
import { submitProblem, runProblem } from "../controllers/problemSubmissionController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import submitCodeRateLimiter from "../middlewares/submitCodeRatelimiter.js";

const problemSubmissionRoutes = express.Router();

problemSubmissionRoutes.post("/run/:problemId", userMiddleware, runProblem);
problemSubmissionRoutes.post("/submit/:problemId", userMiddleware, submitCodeRateLimiter, submitProblem);

export default problemSubmissionRoutes;