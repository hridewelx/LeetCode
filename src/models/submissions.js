import mongoose from "mongoose";
import { Schema } from "mongoose";

const submissionSchema = new Schema ({
    userId: {
        type: Schema.type.ObjectId,
        required: true,
        trim: true
    },
    problemId: {
        type: Schema.type.ObjectId,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        trim: true,
        enum: ["c", "c++", "java", "javascript", "python"]
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ["Accepted", "Pending", "Rejected", "Running", "Compiling", "Error", "TimeLimitExceeded", "MemoryLimitExceeded", "RuntimeError", "CompilationError"]
    },
    runTime: {
        type: Number,
        // required: true,
        trim: true,
        default: 0
    },
    memory: {
        type: Number,
        // required: true,
        trim: true,
        default: 0
    },
    errorMessage: {
        type: String,
        default: "",
        trim: true
    },
    testCasePassed: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    // testCaseFailed: {
    //     type: Number,
    //     required: true,
    //     trim: true,
    //     default: 0
    // },
    totalTestCases: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    }

}, {timestamps: true});

const Submission = mongoose.model("submission", submissionSchema);
export default Submission;