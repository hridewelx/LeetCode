import mongoose from "mongoose";
import { Schema } from "mongoose";
import Submission from "./submissionSchema.js";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, "First name must be at least 3 characters"],
        maxlength: [30, "First name cannot exceed 30 characters"],
        trim: true
    },
    lastName: {
        type: String,
        minlength: [3, "Last name must be at least 3 characters"],
        maxlength: [30, "Last name cannot exceed 30 characters"],
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    age: {
        type: Number,
        min: 5,
        max: 80,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemsSolved: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'problem'
            }
        ],
        default: [],
        unique: true
    },
    password: {
        type: String,
        // minLength: 8,
        // maxLength: 100,
        required: true
    }
}, {
    timestamps: true
})

userSchema.post("findOneAndDelete", async (userInfo) => {
    await Submission.deleteMany({ userId: userInfo._id }).exec();
})

const User = mongoose.model('user', userSchema);
export default User;