import express from "express";
import { submitProblem } from "../controllers/problemSubmissionController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const problemSubmissionRoutes = express.Router();

problemSubmissionRoutes.post("/:problemId", userMiddleware, submitProblem);

export default problemSubmissionRoutes;