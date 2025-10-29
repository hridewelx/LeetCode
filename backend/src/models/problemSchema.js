import mongoose from "mongoose";
import { Schema } from "mongoose";

const problemSchema = new Schema(
  {
    title: {
      type: String,
      min: 3,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      min: 5,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      required: true,
      trim: true,
      enum: ["Easy", "Medium", "Hard"],
    },

    tags: {
      type: [String],
      required: true,
      trim: true,
      enum: [
        "Array",
        "String",
        "Hash Table",
        "Math",
        "Dynamic Programming",
        "Sorting",
        "Greedy",
        "Depth-First Search",
        "Binary Search",
        "Database",
        "Matrix",
        "Bit Manipulation",
        "Tree",
        "Breadth-First Search",
        "Two Pointers",
        "Prefix Sum",
        "Heap (Priority Queue)",
        "Simulation",
        "Counting",
        "Graph",
        "Binary Tree",
        "Stack",
        "Sliding Window",
        "Design",
        "Enumeration",
        "Backtracking",
        "Union Find",
        "Number Theory",
        "Linked List",
        "Ordered Set",
        "Monotonic Stack",
        "Segment Tree",
        "Trie",
        "Combinatorics",
        "Divide and Conquer",
        "Bitmask",
        "Queue",
        "Recursion",
        "Geometry",
        "Binary Indexed Tree",
        "Memoization",
        "Hash Function",
        "Binary Search Tree",
        "Shortest Path",
        "String Matching",
        "Topological Sort",
        "Rolling Hash",
        "Game Theory",
        "Interactive",
        "Data Stream",
        "Monotonic Queue",
        "Brainteaser",
        "Doubly-Linked List",
        "Randomized",
        "Merge Sort",
        "Counting Sort",
        "Iterator",
        "Concurrency",
        "Line Sweep",
        "Probability and Statistics",
        "Quickselect",
        "Suffix Array",
        "Minimum Spanning Tree",
        "Bucket Sort",
        "Shell",
        "Reservoir Sampling",
        "Strongly Connected Component",
        "Eulerian Circuit",
        "Radix Sort",
        "Rejection Sampling",
        "Biconnected Component",
      ],
    },
    visibleTestCases: [
      {
        input: {
          type: String,
          required: true,
          trim: true,
        },
        output: {
          type: String,
          required: true,
          trim: true,
        },
        explanation: {
          type: String,
          required: true,
        },
      },
    ],

    hiddenTestCases: {
      type: [
        {
          input: {
            type: String,
            required: true,
            trim: true,
          },
          output: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      validate: {
        validator: function (value) {
          return value.length > 0; // At least one hidden test case required
        },
        message: "At least one hidden test case is required",
      },
    },

    boilerplateCode: [
      {
        language: {
          type: String,
          required: true,
          trim: true,
        },
        code: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    problemCreator: {
      // type: mongoose.Schema.Types.ObjectId,
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    referenceSolution: [
      {
        language: {
          type: String,
          required: true,
          trim: true,
        },
        code: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Problem = mongoose.model("problem", problemSchema);
export default Problem;
