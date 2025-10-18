import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import redisClient from "../config/redisDB.js";

const userMiddleware = async(req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).json({message: "Token not found"});
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {_id} = payload;
        if(!_id) {
            return res.status(401).json({message: "Invalid token"});
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({message: "User not found"});
        }
        
        // Check if user is blocked in Redis
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({message: "User is blocked"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "User authentication failed"});
    }
}

export default userMiddleware;