import express from "express";
import { submitProblem, runProblem } from "../controllers/problemSubmissionController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import submitCodeRateLimiter from "../middlewares/submitCodeRatelimiter.js";

const problemSubmissionRoutes = express.Router();

problemSubmissionRoutes.post("/run", userMiddleware, runProblem);
problemSubmissionRoutes.post("/:problemId", userMiddleware, submitCodeRateLimiter, submitProblem);

export default problemSubmissionRoutes;