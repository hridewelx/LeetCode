import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { generateUploadSignature, saveFileMetadata, deleteFile, getEditorials } from "../controllers/problemEditorialControllers.js";

const problemEditorialRoutes = express.Router();

problemEditorialRoutes.get("/create/:problemId", adminMiddleware, generateUploadSignature);
problemEditorialRoutes.get("/fetch/:problemId", getEditorials);
problemEditorialRoutes.post("/save", adminMiddleware, saveFileMetadata);
problemEditorialRoutes.delete("/delete/:fileId", adminMiddleware, deleteFile);

export default problemEditorialRoutes;