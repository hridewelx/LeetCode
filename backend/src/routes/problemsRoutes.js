import express from "express"; 
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { createProblem, updateProblem, deleteProblem, getAllProblems, getProblemById, getProblemByIdFetchedByAdmin, individualSolvedProblems, individualProblemSubmissions, individualProblemAllSubmissions } from "../controllers/problemRoutesController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const problemRoutes = express.Router();

problemRoutes.post("/create", adminMiddleware, createProblem);
problemRoutes.put("/update/:id", adminMiddleware, updateProblem);
problemRoutes.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRoutes.get("/problemset", getAllProblems);
problemRoutes.get("/problemfetchbyid/:id", getProblemById);
problemRoutes.get("/admin/problemfetchbyid/:id", adminMiddleware, getProblemByIdFetchedByAdmin);
// for a particular user
problemRoutes.get("/individualsolved", userMiddleware, individualSolvedProblems);
// for a particular problem submissions by a single user
problemRoutes.get("/individualsubmissions/:problemId", userMiddleware, individualProblemSubmissions);
// all submission history for a particular problem
problemRoutes.get("/submissions/:problemId", userMiddleware, individualProblemAllSubmissions);

export default problemRoutes;