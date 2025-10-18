import express from "express";
import { register, login, logout, getProfiles, setAdmin } from "../controllers/userAuthenticationController.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";


const authenticationRouter = express.Router();

authenticationRouter.post("/register", register);
authenticationRouter.post("/login", login);
authenticationRouter.post("/logout", userMiddleware, logout);
authenticationRouter.get("/getprofiles", userMiddleware, getProfiles);
authenticationRouter.post("/admin/register", adminMiddleware, setAdmin);

export default authenticationRouter;