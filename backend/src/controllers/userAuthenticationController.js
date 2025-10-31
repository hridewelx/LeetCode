import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import validateInformation from "../utils/validator.js";
import redisClient from "../config/redisDB.js";
import Submission from "../models/submissionSchema.js";

const register = async(req, res) => {
    try {
        validateInformation(req.body);
        const {firstName, emailId, password, confirmPassword} = req.body;
        if (!validator.isEmail(emailId)) {
            return res.status(400).json({message: "Invalid email"});
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: "Invalid password"});
        }
        if (password !== confirmPassword) {
            return res.status(400).json({message: "Passwords do not match"});
        }

        req.body.role = "user";
        req.body.password = await bcrypt.hash(password, 11);
        
        const user = await User.create(req.body);
        // const token = jwt.sign(req.body, process.env.JWT_SECRET_KEY, {expiresIn: 60*60});
        const token = jwt.sign({ _id: user._id, role: user.role, emailId: user.emailId }, process.env.JWT_SECRET_KEY, {expiresIn: 60*60});
        res.cookie("token", token, {httpOnly: true}, {maxAge: 60*60*1000});

        const reply = {
            _id: user._id,
            firstName: user.firstName,
            emailId: user.emailId,
        }
        res.status(200).json({
            user: reply,
            message: "Registration successful"
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({message: "Registration failed"});
    }
}

const login = async(req, res) => {
    try {
        const {emailId, password} = req.body;
        if (!validator.isEmail(emailId)) {
            return res.status(400).json({message: "Invalid email"});
        }
    
        const user = await User.findOne({emailId});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
    
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({ _id: user._id, role: user.role, emailId: user.emailId }, process.env.JWT_SECRET_KEY, {expiresIn: 60*60});
        res.cookie("token", token, {httpOnly: true}, {maxAge: 60*60*1000});
        
        const reply = {
            _id: user._id,
            firstName: user.firstName,
            emailId: user.emailId,
        }
        res.status(200).json({
            user: reply,
            message: "Login successful"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Login failed"});
    }
}    

const logout = async(req, res) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(400).json({message: "Token not found"});
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, {expires: new Date(Date.now())});
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Logout failed"});
    }
}

const getProfiles = async(req, res) => {
    try {
        const profiles = await User.find();
        res.status(200).send(profiles);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "Profiles fetch failed"});
    }
}

const setAdmin = async(req, res) => {
    try {
        validateInformation(req.body);
        const user = await User.findOne({emailId: req.body.emailId});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({message: "Invalid password"});
        }

        // if (user.role === "admin") {
        //     return res.status(400).json({message: "User is already an admin"});
        // }
        user.role = req.body.role;
        await user.save();
        res.status(200).json({message: `User role: ${user.role} updated successfully`});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "User role update failed"});
    }
}

const deleteUser = async(req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({message: "User not found"});
        }

        await User.findByIdAndDelete(userId);
        await Submission.deleteMany({userId});
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "User delete failed"});
    }
}

const checkAuthenticatedUser = (req, res) => {
    try {
        const reply = {
            _id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user?.lastName || "",
            emailId: req.user.emailId,
            role: req.user.role
        }
        res.status(200).json({
            user: reply,
            message: "User is authenticated"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "User authentication failed"});
    }
}

export {register, login, logout, getProfiles, setAdmin, deleteUser, checkAuthenticatedUser};