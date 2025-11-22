import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../../utilities/axiosClient";
import { useState, useEffect } from "react";
import ResizableTextarea from "../ResizableTextarea";

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
        language: z.enum(["c", "cpp", "java", "javascript", "python"]),
        code: z.string().min(1, "Code is required"),
      })
    )
    .min(5, "At least 5 boilerplate codes required"),
  referenceSolution: z.array(
    z.object({
      language: z.enum(["c", "cpp", "java", "javascript", "python"]),
      code: z.string().min(1, "Code is required"),
    })
  ),
});

function QuestionUpdation() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [problemData, setProblemData] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null); // 'updating', 'success', 'error'

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitting, isDirty },
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
        { language: "c", code: "" },
        { language: "cpp", code: "" },
        { language: "java", code: "" },
        { language: "javascript", code: "" },
        { language: "python", code: "" },
      ],
      referenceSolution: [
        { language: "c", code: "" },
        { language: "cpp", code: "" },
        { language: "java", code: "" },
        { language: "javascript", code: "" },
        { language: "python", code: "" },
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

  // Fetch problem data on component mount
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(
          `/problems/admin/problemfetchbyid/${problemId}`
        );
        console.log("response", response);
        const problem = response.data.problem;
        setProblemData(problem);

        reset({
          title: problem.title || "",
          description: problem.description || "",
          difficulty: problem.difficulty || "Easy",
          tags: problem.tags || [],
          visibleTestCases:
            problem.visibleTestCases?.length > 0
              ? problem.visibleTestCases
              : [{ input: "", output: "", explanation: "" }],
          hiddenTestCases:
            problem.hiddenTestCases?.length > 0
              ? problem.hiddenTestCases
              : [{ input: "", output: "" }],
          boilerplateCode:
            problem.boilerplateCode?.length > 0
              ? problem.boilerplateCode
              : [
                  { language: "c", code: "" },
                  { language: "cpp", code: "" },
                  { language: "java", code: "" },
                  { language: "javascript", code: "" },
                  { language: "python", code: "" },
                ],
          referenceSolution:
            problem.referenceSolution?.length > 0
              ? problem.referenceSolution
              : [
                  { language: "c", code: "" },
                  { language: "cpp", code: "" },
                  { language: "java", code: "" },
                  { language: "javascript", code: "" },
                  { language: "python", code: "" },
                ],
        });
      } catch (error) {
        console.error("Error fetching problem:", error);
        setUpdateStatus('error');
        setTimeout(() => setUpdateStatus(null), 3000);
        navigate("/admin/questions");
      } finally {
        setIsLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId, reset, navigate]);

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
    setUpdateStatus('updating');
    try {
      await axiosClient.put(`/problems/update/${problemId}`, data);
      setUpdateStatus('success');
      setTimeout(() => {
        navigate("/admin/questions");
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus(null), 3000);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = await trigger();
    
    if (isValid) {
      const formData = getValues();
      await onSubmit(formData);
    }
  };

  const programmingLanguages = ["c", "cpp", "java", "javascript", "python"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading problem data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      {/* Status Notification */}
      {updateStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ${
          updateStatus === 'updating' 
            ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
            : updateStatus === 'success' 
            ? 'bg-green-500/20 border-green-400/30 text-green-300'
            : 'bg-red-500/20 border-red-400/30 text-red-300'
        }`}>
          <div className="flex items-center gap-3">
            {updateStatus === 'updating' && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            )}
            {updateStatus === 'success' && (
              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            )}
            {updateStatus === 'error' && (
              <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            )}
            <span className="font-medium">
              {updateStatus === 'updating' && 'Updating problem...'}
              {updateStatus === 'success' && 'Problem updated successfully!'}
              {updateStatus === 'error' && 'Update failed. Please try again.'}
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              AlgoForge Question Update Panel
            </h1>
          </div>
          <p className="text-slate-400 font-semibold">
            Update existing coding challenge:{" "}
            <span className="text-amber-400">{problemData?.title}</span>
          </p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl shadow-black/30 p-6">
          <form onSubmit={handleFormSubmit} className="space-y-8">
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter problem title"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-400">
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
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
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-400 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-amber-300 transition-colors duration-200"
                      >
                        ×
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
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : "bg-slate-600/50 text-slate-300 hover:bg-slate-500/50 hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {errors.tags && (
                  <p className="mt-2 text-sm text-red-400">
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
                disabled={isSubmitting || !isDirty || updateStatus === 'updating'}
                className={`flex-1 py-4 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-bold text-lg transition-all duration-200 relative overflow-hidden ${
                  isSubmitting || !isDirty || updateStatus === 'updating'
                    ? "opacity-50 cursor-not-allowed"
                    : "shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                }`} 
              >
                {updateStatus === 'updating' ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Updating Problem...
                  </div>
                ) : isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  "Update Problem"
                )}
                
                {/* Progress bar for updating state */}
                {updateStatus === 'updating' && (
                  <div className="absolute bottom-0 left-0 h-1 bg-amber-400 animate-pulse w-full"></div>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/questions")}
                disabled={updateStatus === 'updating'}
                className={`px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 border border-slate-600 ${
                  updateStatus === 'updating' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => reset()}
                disabled={!isDirty || updateStatus === 'updating'}
                className={`px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors duration-200 border border-slate-600 ${
                  !isDirty || updateStatus === 'updating' ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Reset Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuestionUpdation;