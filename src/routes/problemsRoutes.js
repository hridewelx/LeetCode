import express from "express"; 
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { createProblem, updateProblem, deleteProblem, getAllProblems, getProblemById, getSolvedProblemsByUser } from "../controllers/problemRoutesController.js";

const problemRoutes = express.Router();

problemRoutes.post("/create", adminMiddleware, createProblem);
problemRoutes.put("/update/:id", adminMiddleware, updateProblem);
problemRoutes.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRoutes.get("/problemset", getAllProblems);
problemRoutes.get("/problemfetchbyid/:id", getProblemById);
problemRoutes.get("/problems/solved", getSolvedProblemsByUser);


export default problemRoutes;