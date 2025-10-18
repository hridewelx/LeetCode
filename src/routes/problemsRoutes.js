import express from "express"; 
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { createProblem } from "../controllers/problemRoutesController.js";

const problemRoutes = express.Router();

problemRoutes.post("/createproblems", adminMiddleware, createProblem);
// problemRoutes.put("/problems/:id", adminMiddleware, updateProblem);
// problemRoutes.delete("/problems/:id", adminMiddleware, deleteProblem);

// problemRoutes.get("/problemset", getAllProblems);
// problemRoutes.get("/problems/:id", getProblemById);
// problemRoutes.get("/problems/solved", getSolvedProblemsByUser);


export default problemRoutes;