import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 30,
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

const User = mongoose.model('user', userSchema);
export default User;