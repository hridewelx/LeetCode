import mongoose from "mongoose";
import { Schema } from "mongoose";

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    difficulty: {
        type: String,
        required: true,
        trim: true,
        enum: ["Easy", "Medium", "Hard"]
    },

    tags: {
        type: [String],
        required: true,
        trim: true,
        enum: ["Array", "LinkedList", "Graph", "Iteration", "DP", "Math", "Recursion", "Backtracking", "Sorting", "BinarySearch", "TwoPointers", "SlidingWindow", "Greedy", "BitManipulation", "String", "Matrix", "Heap", "Tree", "DFS", "BFS", "UnionFind", "Design", "TopologicalSort", "BinaryTree", "BinarySearch", "SegmentTree", "Trie", "BinaryIndexedTree", "MinHeap", "MaxHeap", "Counting", "Backtracking", "DP", "PrefixSum", "InfixToPostfix", "PostfixToInfix", "InfixToPrefix", "PrefixToInfix", "PrefixToPostfix", "PostfixToPrefix"]
    },

    visibleTestCases: [
        { 
            input: {
                type: String,
                required: true,
                trim: true
            },
            output: {
                type: String,
                required: true,
                trim: true
            },
            explanation: {
                type: String,
                required: true
            }            
        }
    ],

    hiddenTestCases: [
        { 
            input: {
                type: String,
                required: true,
                trim: true
            },
            output: {
                type: String,
                required: true,
                trim: true
            }        
        }
    ],
    
    boilerplateCode: [
        {
            language: {
                type: String,
                required: true,
                trim: true
            },
            code: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],

    problemCreator: {
        // type: mongoose.Schema.Types.ObjectId,
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    referenceSolution: [
        {
            language: {
                type: String,
                required: true,
                trim: true
            },
            code: {
                type: String,
                required: true,
                trim: true
            }
        }
    ]
}, {timestamps: true});

const Problem = mongoose.model("problem", problemSchema);
export default Problem;