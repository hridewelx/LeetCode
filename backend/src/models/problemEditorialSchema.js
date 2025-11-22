import mongoose from "mongoose";
import { Schema } from "mongoose";

const problemEditorialSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    publicId: {
        type: String,
        required: true,
        unique: true
    },
    secureUrl: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    fileType: {
        type: String,
        enum: ['video', 'image'],
        default: 'video'
    }
}, {
    timestamps: true
})

const Editorial = mongoose.model('problemEditorial', problemEditorialSchema);
export default Editorial;