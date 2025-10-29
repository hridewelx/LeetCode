import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../utilities/axiosClient";
import { useState } from "react";
import ResizableTextarea from "../components/ResizableTextarea";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  tags: z.array(z.string()).min(1, "At least one tag required"),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),

  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),

  boilerplateCode: z
    .array(
      z.object({
        language: z.enum(["C", "C++", "Java", "JavaScript", "Python"]),
        code: z.string().min(1, "Code is required"),
      })
    )
    .min(5, "At least 5 boilerplate codes required"),

  referenceSolution: z.array(
    z.object({
      language: z.enum(["C", "C++", "Java", "JavaScript", "Python"]),
      code: z.string().min(1, "Code is required"),
    })
  ),
});

function AdminPanel() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      tags: [],
      visibleTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],
      hiddenTestCases: [
        {
          input: "",
          output: "",
        },
      ],
      boilerplateCode: [
        { language: "C", code: "" },
        { language: "C++", code: "" },
        { language: "Java", code: "" },
        { language: "JavaScript", code: "" },
        { language: "Python", code: "" },
      ],
      referenceSolution: [
        { language: "C", code: "" },
        { language: "C++", code: "" },
        { language: "Java", code: "" },
        { language: "JavaScript", code: "" },
        { language: "Python", code: "" },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const allTags = [
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
  ];

  // Watch the tags value to sync with selectedTags state
  const currentTags = watch("tags");

  const handleTagSelect = (tag) => {
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    setValue("tags", newTags, { shouldValidate: true });
  };

  const removeTag = (tagToRemove) => {
    const newTags = currentTags.filter((tag) => tag !== tagToRemove);
    setValue("tags", newTags, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const programmingLanguages = ["C", "C++", "Java", "JavaScript", "Python"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">AlgoForge Admin</h1>
          </div>
          <p className="text-slate-400 font-semibold">
            Create new coding challenges for the community
          </p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl shadow-black/30 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-700/50 pb-2">
                Basic Information
              </h2>

              {/* Title and Difficulty in one row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter problem title"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    {...register("difficulty")}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="Easy" className="bg-slate-700 text-white">
                      Easy
                    </option>
                    <option value="Medium" className="bg-slate-700 text-white">
                      Medium
                    </option>
                    <option value="Hard" className="bg-slate-700 text-white">
                      Hard
                    </option>
                  </select>
                  {errors.difficulty && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <ResizableTextarea
                  register={register}
                  name="description"
                  placeholder="Enter problem description"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Tags - Full Width */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>

                {/* Selected Tags Display */}
                <div className="flex flex-wrap gap-2 mb-3 min-h-12 p-2 bg-slate-700/30 rounded border border-slate-600">
                  {currentTags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-400 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-300 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                  {(!currentTags || currentTags.length === 0) && (
                    <span className="text-slate-500 text-sm">
                      No tags selected
                    </span>
                  )}
                </div>

                {/* Tags Selection Grid */}
                <div className="max-h-48 overflow-y-auto p-3 bg-slate-700/30 rounded border border-slate-600">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                          currentTags?.includes(tag)
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-slate-600/50 text-slate-300 hover:bg-slate-500/50 hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {errors.tags && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.tags.message}
                  </p>
                )}
              </div>
            </div>

            {/* Test Cases Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-700/50 pb-2">
                Test Cases
              </h2>

              {/* Visible Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-300">
                    Visible Test Cases
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      appendVisible({ input: "", output: "", explanation: "" })
                    }
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-semibold"
                  >
                    Add Visible Case
                  </button>
                </div>
                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-slate-300 font-medium">
                          Test Case {index + 1}
                        </h4>
                        {visibleFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVisible(index)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors duration-200 font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Input
                          </label>
                          <ResizableTextarea
                            register={register}
                            name={`visibleTestCases.${index}.input`}
                            rows={10}
                            placeholder="e.g., [1,2,3]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Output
                          </label>
                          <ResizableTextarea
                            register={register}
                            name={`visibleTestCases.${index}.output`}
                            rows={10}
                            placeholder="e.g., 6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Explanation
                        </label>
                        <ResizableTextarea
                          register={register}
                          name={`visibleTestCases.${index}.explanation`}
                          rows={10}
                          placeholder="Explain the test case"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors.visibleTestCases && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.visibleTestCases.message}
                  </p>
                )}
              </div>

              {/* Hidden Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-300">
                    Hidden Test Cases
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: "", output: "" })}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-semibold"
                  >
                    Add Hidden Case
                  </button>
                </div>
                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-slate-300 font-medium">
                          Hidden Case {index + 1}
                        </h4>
                        {hiddenFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHidden(index)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors duration-200 font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Input
                          </label>
                          <ResizableTextarea
                            register={register}
                            name={`hiddenTestCases.${index}.input`}
                            rows={10}
                            placeholder="e.g., [1,2,3]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Output
                          </label>
                          <ResizableTextarea
                            register={register}
                            name={`hiddenTestCases.${index}.output`}
                            rows={10}
                            placeholder="e.g., 6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.hiddenTestCases && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.hiddenTestCases.message}
                  </p>
                )}
              </div>
            </div>

            {/* Code Sections */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-700/50 pb-2">
                Code Templates & Solutions
              </h2>

              {/* Boilerplate Code */}
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">
                  Boilerplate Code
                </h3>
                <div className="space-y-4">
                  {programmingLanguages.map((language, index) => (
                    <div
                      key={language}
                      className="group p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors duration-200"
                    >
                      <h4 className="text-slate-300 font-medium mb-3">
                        {language}
                      </h4>
                      <ResizableTextarea
                        register={register}
                        name={`boilerplateCode.${index}.code`}
                        rows={15}
                        placeholder={`Enter ${language} boilerplate code`}
                      />
                      <input
                        type="hidden"
                        {...register(`boilerplateCode.${index}.language`)}
                        value={language}
                      />
                    </div>
                  ))}
                </div>
                {errors.boilerplateCode && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.boilerplateCode.message}
                  </p>
                )}
              </div>

              {/* Reference Solution */}
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">
                  Reference Solution
                </h3>
                <div className="space-y-4">
                  {programmingLanguages.map((language, index) => (
                    <div
                      key={language}
                      className="group p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors duration-200"
                    >
                      <h4 className="text-slate-300 font-medium mb-3">
                        {language}
                      </h4>
                      <ResizableTextarea
                        register={register}
                        name={`referenceSolution.${index}.code`}
                        rows={15}
                        placeholder={`Enter ${language} solution code`}
                      />
                      <input
                        type="hidden"
                        {...register(`referenceSolution.${index}.language`)}
                        value={language}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-slate-700/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-lg transition-all duration-200 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Problem...
                  </div>
                ) : (
                  "Create Problem"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 border border-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
