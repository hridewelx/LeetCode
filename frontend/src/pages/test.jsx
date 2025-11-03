import { useState, useEffect, useRef } from "react";
import { useParams, NavLink } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { toast, Toaster } from "react-hot-toast";
import Editor from "@monaco-editor/react";

const SolveProblem = () => {
  const { problemId } = useParams();
  const { user } = useSelector((state) => state.authentication);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [language, setLanguage] = useState("python");
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  
  // Clock/Timer States
  const [showClockMenu, setShowClockMenu] = useState(false);
  const [clockMode, setClockMode] = useState(null); // null, 'stopwatch', 'timer'
  const [timeValue, setTimeValue] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25 * 60); // 25 minutes default
  const clockRef = useRef(null);
  
  // Notes State
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  
  // Resizable Split States
  const [splitX, setSplitX] = useState(40);
  const [splitY, setSplitY] = useState(70);
  const [isDraggingX, setIsDraggingX] = useState(false);
  const [isDraggingY, setIsDraggingY] = useState(false);

  // Submission Results
  const [submissionResults, setSubmissionResults] = useState(null);
const [showResultsTab, setShowResultsTab] = useState(false);

  const splitXRef = useRef(null);
  const splitYRef = useRef(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosClient.get(
          `/problems/problemfetchbyid/${problemId}`
        );
        setProblem(data.problem);
        toast.success("Problem loaded successfully");
        
        const boilerplate = data.problem.boilerplateCode?.find(
          (bp) => bp.language === language
        );
        console.log(boilerplate);
        setCode(boilerplate?.code || `// Write your code in ${language}`);
      } catch (error) {
        console.error("Error fetching problem:", error);
        toast.error("Failed to load problem");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const boilerplate = problem.boilerplateCode?.find(
        (bp) => bp.language === language
      );
      console.log(boilerplate);
      setCode(boilerplate?.code || `// Write your code in ${language}`);
    }
  }, [language, problem]);

  // Clock/Timer Logic
  useEffect(() => {
    if (isClockRunning && clockMode) {
      clockRef.current = setInterval(() => {
        setTimeValue((prev) => {
          if (clockMode === "timer") {
            return prev > 0 ? prev - 1 : 0;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (clockRef.current) {
        clearInterval(clockRef.current);
      }
    }

    return () => {
      if (clockRef.current) {
        clearInterval(clockRef.current);
      }
    };
  }, [isClockRunning, clockMode]);

  const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds);
    const hours = Math.floor(absSeconds / 3600);
    const mins = Math.floor((absSeconds % 3600) / 60);
    const secs = absSeconds % 60;

    let timeString = `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
    if (hours > 0) {
      timeString = `${hours.toString().padStart(2, "0")}:${timeString}`;
    }
    return timeString;
  };

  const handleClockModeSelect = (mode) => {
    setClockMode(mode);
    setShowClockMenu(false);
    if (mode === "timer") {
      setTimeValue(timerDuration);
    } else {
      setTimeValue(0);
    }
  };

  const handleClockReset = () => {
    setIsClockRunning(false);
    if (clockMode === "timer") {
      setTimeValue(timerDuration);
    } else {
      setTimeValue(0);
    }
  };

  const handleTimerDurationChange = (minutes) => {
    const newDuration = Math.max(1, minutes) * 60;
    setTimerDuration(newDuration);
    if (clockMode === "timer") {
      setTimeValue(newDuration);
    }
  };

  // Mouse event handlers for resizable splits
useEffect(() => {
  const handleMouseMoveX = (e) => {
    if (!isDraggingX) return;
    
    // Prevent text selection and default behavior
    e.preventDefault();
    
    const container = splitXRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newSplitX = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitX(Math.min(Math.max(newSplitX, 25), 75));
  };

  const handleMouseMoveY = (e) => {
    if (!isDraggingY) return;
    
    // Prevent text selection and default behavior
    e.preventDefault();
    
    const container = splitYRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newSplitY = ((e.clientY - rect.top) / rect.height) * 100;
    setSplitY(Math.min(Math.max(newSplitY, 20), 80));
  };

  const handleMouseUp = () => {
    setIsDraggingX(false);
    setIsDraggingY(false);
    
    // Re-enable text selection
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = 'auto';
  };

  if (isDraggingX || isDraggingY) {
    // Disable text selection during drag
    document.body.style.userSelect = 'none';
    
    document.addEventListener("mousemove", isDraggingX ? handleMouseMoveX : handleMouseMoveY);
    document.addEventListener("mouseup", handleMouseUp);
  }

  return () => {
    document.removeEventListener("mousemove", handleMouseMoveX);
    document.removeEventListener("mousemove", handleMouseMoveY);
    document.removeEventListener("mouseup", handleMouseUp);
    
    // Ensure text selection is re-enabled
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = 'auto';
  };
}, [isDraggingX, isDraggingY]);

  const handleRunTests = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before running test cases");
      return;
    }
    console.log(language);
    setIsRunning(true);
    try {
      const { data } = await axiosClient.post(`/submissions/run/${problemId}`, {
        code,
        language,
      });

      setTestResults(data);
      console.log(data);
      // const data = {
      //   message: "Submission successful",
      //   submissionResult: {
      //     code: "#include <iostream>\n#include <string> \nusing namespace std; \nint main() {\n    string s;\n    cin >> s;\n    for (int i = s.size() - 1; i >= 0; i--) {\n        cout << s[i];\n    }\n    return 0; \n}";
      //     createdAt: "2025-10-30T06:15:24.524Z",
      //     errorMessage: null,
      //     language: "c++",
      //     memory: 1060,
      //     problemId: "68f462e43047967b7e51752b",
      //     runTime: 0.006,
      //     status: "Accepted",
      //     testCasePassed: 3,
      //     totalTestCases: 3,
      //     updatedAt: "2025-10-30T06:15:24.524Z",
      //     userId: "69023b797f7085ce2b6aae21",
      //     __v: 0,
      //     _id: "6903027cb40b33a3ced8e3e4",
      //   }
      // }


      if (data?.submissionResult?.status === "Accepted") {
        toast.success("All test cases passed!");
      } else {
        toast.error("Some test cases failed");
      }
    } catch (error) {
      console.error("Test run error:", error);
      toast.error(error.response?.data?.message || "Test run failed");
    } finally {
      setIsRunning(false);
    }
  };

 const handleSubmit = async () => {
  if (!code.trim()) {
    toast.error("Please write some code before submitting");
    return;
  }

  setIsSubmitting(true);
  try {
    const { data } = await axiosClient.post(`/submissions/submit/${problemId}`, {
      code,
      language,
    });

    setSubmissionResults(data);
    setShowResultsTab(true);
    setActiveTab("results");
    
    if (data?.submissionResult?.status === "Accepted") {
      toast.success("All test cases passed! 🎉");
    } else {
      toast.error("Some test cases failed");
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.response?.data?.message || "Submission failed");
  } finally {
    setIsSubmitting(false);
  }
};

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-600/20 text-green-400 border-green-600/40 rounded-full";
      case "medium":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/40 rounded-full";
      case "hard":
        return "bg-red-600/20 text-red-400 border-red-600/40 rounded-full";
      default:
        return "bg-slate-600/20 text-slate-400 border-slate-600/40 rounded-full";
    }
  };

  const getStatusColor = (passed) => {
    return passed ? "text-green-400" : "text-red-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Toaster position="top-right" reverseOrder={true} />
      {/* Top Header */}
      <div className="h-[50px] bg-slate-800 border-b border-slate-700/50 flex items-center justify-between px-4 text-white">
        {/* Left Section (AlgoForge Logo) */}
        <div className="flex items-center">
          <NavLink to="/">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
          </NavLink>
        </div>

        {/* Left Section (Navigation) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <NavLink
            to="/problemset"
            className="text-lg font-semibold text-blue-400 hover:text-blue-500 transition-colors"
          >
            Problem Set
          </NavLink>
        </div>

        {/* Center Section (Run, Submit, Notes) */}
        <div className="flex items-center gap-4 justify-center flex-grow">
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border border-slate-600/50"
          >
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              {isRunning ? "Running" : "Run Code"}
            </span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border border-yellow-700/50"
          >
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5" 
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>

              {isSubmitting ? "Submitting" : "Submit"}
            </span>
          </button>

          <button
            onClick={() => setShowStickyNotes(!showStickyNotes)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors duration-200 font-medium text-sm border border-slate-600/50"
            title="Toggle Sticky Notes"
          >
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Notes
            </span>
          </button>
        </div>

        {/* Right Section (Clock, User) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Clock Feature */}
          <div className="relative">
            {!clockMode ? (
              // Initial clock button
              <button
                onClick={() => setShowClockMenu(!showClockMenu)}
                className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-slate-300 font-mono text-sm">Clock</span>
              </button>
            ) : (
              // Active clock display
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    clockMode === "timer" ? "text-yellow-400" : "text-blue-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {clockMode === "timer" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>

                <span
                  className={`text-slate-300 font-mono text-sm w-16 text-center ${
                    clockMode === "timer" && timeValue <= 60
                      ? "text-red-400 font-bold"
                      : ""
                  }`}
                >
                  {formatTime(timeValue)}
                </span>

                <button
                  onClick={() => setIsClockRunning(!isClockRunning)}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                  title={isClockRunning ? "Pause" : "Start"}
                >
                  {isClockRunning ? "⏸" : "▶"}
                </button>
                <button
                  onClick={handleClockReset}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                  title="Reset"
                >
                  🔄
                </button>

                {clockMode === "timer" && (
                  <input
                    type="number"
                    value={timerDuration / 60}
                    onChange={(e) =>
                      handleTimerDurationChange(parseInt(e.target.value) || 1)
                    }
                    disabled={isClockRunning}
                    min="1"
                    className="w-10 bg-slate-700/50 border border-slate-600 text-white rounded px-1 text-xs text-center"
                    title="Set duration in minutes"
                  />
                )}

                <button
                  onClick={() => {
                    setClockMode(null);
                    setIsClockRunning(false);
                    setTimeValue(0);
                  }}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                  title="Close Clock"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Clock Mode Selection Menu */}
            {showClockMenu && !clockMode && (
              <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-10 min-w-[120px]">
                <button
                  onClick={() => handleClockModeSelect("stopwatch")}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Stopwatch
                </button>
                <button
                  onClick={() => handleClockModeSelect("timer")}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Timer
                </button>
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-slate-700"></div>

          {/* User Avatar */}
          <button className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a1.534 1.534 0 01-.387-.722c.15-.311.458-.62.809-.888C7.076 17.5 9.47 16.5 12 16.5s4.924 1 7.076 2.008c.351.268.659.577.809.888a1.534 1.534 0 01-.387.722A2.083 2.083 0 0112 20.25a2.083 2.083 0 01-7.499-.132z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content with Resizable Splits */}
      <div
        ref={splitXRef}
        className="flex h-[calc(100vh-50px)]"
        style={{ cursor: isDraggingX ? "col-resize" : "default" }}
      >
        {/* Left Panel - Problem Description/Tabs */}
        <div
          className="h-full overflow-hidden flex flex-col bg-slate-900 border-r border-slate-700/50"
          style={{ width: `${splitX}%` }}
        >
          {/* Tabs Area */}
          <div className="border-b border-slate-700/50 flex-shrink-0">
            <div className="flex px-4">
              {["description", "editorial", "solutions", "submissions"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 capitalize ${
                      activeTab === tab
                        ? "border-yellow-500 text-yellow-400"
                        : "border-transparent text-slate-400 hover:text-slate-300"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                )
              )}

              {/* Notes Tab */}
              <button
                className={`ml-auto px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  showStickyNotes
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
                onClick={() => setShowStickyNotes(!showStickyNotes)}
              >
                Notes {showStickyNotes && "✕"}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "description" && (
              <div className="p-6 text-slate-300">
                <div className="prose prose-invert max-w-none">
                  {/* Problem Title and Tags */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h1 className="text-2xl font-bold text-white leading-tight">
                        {problem.title}
                      </h1>
                      <span
                        className={`px-2 py-0.5 border rounded text-sm font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {problem.tags?.map((tag, index) => (
                        <div
                          key={index}
                          className="px-2 py-0.5 bg-slate-700/50 border border-slate-600/50 rounded text-slate-400 text-xs font-medium"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-base leading-relaxed whitespace-pre-line">
                      {problem.description}
                    </p>
                  </div>

                  {/* Examples (Visible Test Cases) */}
                  <div className="mb-6 space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Examples
                    </h3>
                    {problem.visibleTestCases?.map((testCase, index) => (
                      <div
                        key={testCase._id}
                        className="space-y-3 p-4 bg-slate-800 rounded-lg border border-slate-700"
                      >
                        <p className="text-white font-semibold mb-2">
                          Example {index + 1}:
                        </p>

                        <div>
                          <p className="text-slate-400 font-medium text-sm mb-1">
                            Input:
                          </p>
                          <pre className="bg-slate-900 p-3 rounded-lg text-sm text-slate-200 border border-slate-700/50">
                            {testCase.input}
                          </pre>
                        </div>

                        <div>
                          <p className="text-slate-400 font-medium text-sm mb-1">
                            Output:
                          </p>
                          <pre className="bg-slate-900 p-3 rounded-lg text-sm text-slate-200 border border-slate-700/50">
                            {testCase.output}
                          </pre>
                        </div>

                        {testCase.explanation && (
                          <div>
                            <p className="text-slate-400 font-medium text-sm mb-1">
                              Explanation:
                            </p>
                            <p className="text-slate-300 text-sm">
                              {testCase.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Constraints
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 pl-4">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="text-sm">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes Panel */}
            {showStickyNotes && (
              <div className="p-6 text-slate-300 h-full">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 h-full">
                  <textarea
                    placeholder="Write your notes here..."
                    className="w-full h-full bg-transparent border-none text-slate-300 resize-none focus:outline-none"
                    onChange={(e) => {
                      // Auto-save to localStorage or handle note saving
                      localStorage.setItem(
                        `notes_${problemId}`,
                        e.target.value
                      );
                    }}
                    defaultValue={
                      localStorage.getItem(`notes_${problemId}`) || ""
                    }
                  />
                </div>
              </div>
            )}

            {/* Other Tabs */}
            {(activeTab === "editorial" ||
              activeTab === "solutions" ||
              activeTab === "submissions") &&
              !showStickyNotes && (
                <div className="p-6 text-slate-300">
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-slate-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                      Coming Soon
                    </h3>
                    <p className="text-slate-400">
                      We're working on adding this content.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Vertical Resize Handle */}
       <div
  className="w-1 bg-slate-700/50 hover:bg-yellow-500 cursor-col-resize flex items-center justify-center transition-colors duration-150 flex-shrink-0"
  onMouseDown={(e) => {
    e.preventDefault();
    setIsDraggingX(true);
  }}
>
  <div className="w-1 h-full"></div>
</div>


        {/* Right Panel - Code Editor and Test Cases */}
        <div
          className="h-full flex flex-col bg-slate-900"
          style={{ width: `${100 - splitX}%` }}
          ref={splitYRef}
        >
          {/* Code Editor Section */}
          <div
            className="flex flex-col border-b border-slate-700/50 min-h-0"
            style={{ height: `${splitY}%` }}
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between p-2 bg-slate-800/70 border-b border-slate-700/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Code</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python3</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript" disabled>TypeScript</option>
                  <option value="rust" disabled>Rust</option>
                </select>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <button title="Settings" className="hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.44a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: "off",
                }}
              />
            </div>
          </div>

          {/* Horizontal Resize Handle */}
          <div
  className="h-1 bg-slate-700/50 hover:bg-yellow-500 cursor-row-resize flex items-center justify-center transition-colors duration-150 flex-shrink-0"
  onMouseDown={(e) => {
    e.preventDefault();
    setIsDraggingY(true);
  }}
>
  <div className="h-1 w-full"></div>
</div>

          {/* Test Cases Section */}
          {/* Test Cases Section */}
<div
  className="flex flex-col flex-shrink-0 min-h-0"
  style={{ height: `${100 - splitY}%` }}
>
  {/* Test Case Header/Tabs */}
  <div className="flex items-center justify-between p-2 bg-slate-800/70 border-b border-slate-700/50 flex-shrink-0">
    <h3 className="text-sm font-semibold text-white">
      {testResults ? "Test Results" : "Test Cases"}
    </h3>
    
    {/* Show overall status when test results are available */}
    {testResults && (
      <div className={`px-2 py-1 rounded text-xs font-medium ${
        testResults.submissionResult?.status === "Accepted" 
          ? "bg-green-600/20 text-green-400 border border-green-600/40"
          : testResults.submissionResult?.status === "Wrong Answer"
          ? "bg-red-600/20 text-red-400 border border-red-600/40"
          : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40"
      }`}>
        {testResults.submissionResult?.status || "Running"}
      </div>
    )}
  </div>

  <div className="flex-1 overflow-hidden">
    {/* Test Case Navigation */}
    <div className="flex items-center px-4 bg-slate-900 border-b border-slate-700/50">
      {!testResults ? (
        // Regular test case tabs when no results
        problem.visibleTestCases?.map((testCase, index) => (
          <button
            key={testCase._id}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTestCaseIndex === index
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
            onClick={() => setActiveTestCaseIndex(index)}
          >
            Case {index + 1}
          </button>
        ))
      ) : (
        // Test result tabs showing pass/fail status
        <div className="flex items-center gap-1 py-2">
          {testResults.testCaseResults?.map((testCase, index) => (
            <button
              key={index}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center gap-1 ${
                activeTestCaseIndex === index
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
              onClick={() => setActiveTestCaseIndex(index)}
            >
              Case {index + 1}
              {testCase.passed ? (
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
          
          {/* Summary Stats */}
          <div className="ml-auto flex items-center gap-4 text-xs text-slate-400">
            <span>
              Passed: <span className="text-green-400 font-medium">{testResults.submissionResult?.testCasePassed || 0}</span> / {testResults.submissionResult?.totalTestCases || 0}
            </span>
            <span>
              Runtime: <span className="text-white font-medium">{testResults.submissionResult?.runTime ? `${testResults.submissionResult.runTime}s` : 'N/A'}</span>
            </span>
            <span>
              Memory: <span className="text-white font-medium">{testResults.submissionResult?.memory ? `${testResults.submissionResult.memory}KB` : 'N/A'}</span>
            </span>
          </div>
        </div>
      )}
    </div>

    <div className="h-full overflow-y-auto p-4 bg-slate-900">
      {testResults ? (
        // Show individual test case results
        testResults.testCaseResults && testResults.testCaseResults[activeTestCaseIndex] ? (
          <div className="space-y-4">
            {/* Test Case Status */}
            <div className={`p-3 rounded-lg border ${
              testResults.testCaseResults[activeTestCaseIndex].passed
                ? "bg-green-600/10 border-green-600/30"
                : "bg-red-600/10 border-red-600/30"
            }`}>
              <div className="flex items-center gap-2">
                {testResults.testCaseResults[activeTestCaseIndex].passed ? (
                  <>
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-400">Test Case {activeTestCaseIndex + 1} Passed</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-red-400">Test Case {activeTestCaseIndex + 1} Failed</span>
                  </>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <p className="text-slate-400 font-medium text-sm">Input:</p>
              <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
                {testResults.testCaseResults[activeTestCaseIndex].input}
              </pre>
            </div>

            {/* Expected vs Actual Output */}
            <div className="grid grid-cols-2 gap-4">
              {/* Expected Output */}
              <div className="space-y-2">
                <p className="text-slate-400 font-medium text-sm">Expected Output:</p>
                <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
                  {testResults.testCaseResults[activeTestCaseIndex].expectedOutput}
                </pre>
              </div>

              {/* Actual Output */}
              <div className="space-y-2">
                <p className="text-slate-400 font-medium text-sm">Your Output:</p>
                <pre className={`p-3 rounded text-sm border whitespace-pre-wrap ${
                  testResults.testCaseResults[activeTestCaseIndex].passed
                    ? "bg-green-600/10 text-green-400 border-green-600/30"
                    : "bg-red-600/10 text-red-400 border-red-600/30"
                }`}>
                  {testResults.testCaseResults[activeTestCaseIndex].actualOutput}
                </pre>
              </div>
            </div>

            {/* Error Message (if any) */}
            {testResults.testCaseResults[activeTestCaseIndex].error && (
              <div className="space-y-2">
                <p className="text-slate-400 font-medium text-sm">Error:</p>
                <pre className="bg-red-600/10 p-3 rounded text-sm text-red-400 border border-red-600/30 whitespace-pre-wrap">
                  {testResults.testCaseResults[activeTestCaseIndex].error}
                </pre>
              </div>
            )}

            {/* Runtime Info */}
            {testResults.testCaseResults[activeTestCaseIndex].runtime && (
              <div className="text-xs text-slate-400">
                Runtime: <span className="text-white">{testResults.testCaseResults[activeTestCaseIndex].runtime}s</span>
              </div>
            )}
          </div>
        ) : (
          // Fallback when no individual test case results
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              testResults.submissionResult?.status === "Accepted"
                ? "bg-green-600/10 border-green-600/30 text-green-400"
                : "bg-red-600/10 border-red-600/30 text-red-400"
            }`}>
              <div className="flex items-center gap-2">
                {testResults.submissionResult?.status === "Accepted" ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">All test cases passed!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Some test cases failed</span>
                  </>
                )}
              </div>
              {testResults.submissionResult?.errorMessage && (
                <div className="mt-3 p-3 bg-slate-800 rounded text-sm">
                  <p className="text-slate-300 font-medium mb-1">Error:</p>
                  <pre className="text-red-400 whitespace-pre-wrap">{testResults.submissionResult.errorMessage}</pre>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        // Show regular test case input/output when no results
        problem.visibleTestCases &&
        problem.visibleTestCases[activeTestCaseIndex] && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-slate-400 font-medium text-sm">Input:</p>
              <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
                {problem.visibleTestCases[activeTestCaseIndex].input}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium text-sm">Output:</p>
              <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
                {problem.visibleTestCases[activeTestCaseIndex].output}
              </pre>
            </div>
            {problem.visibleTestCases[activeTestCaseIndex].explanation && (
              <div className="space-y-2">
                <p className="text-slate-400 font-medium text-sm">Explanation:</p>
                <p className="text-slate-300 text-sm">
                  {problem.visibleTestCases[activeTestCaseIndex].explanation}
                </p>
              </div>
            )}
          </div>
        )
      )}
    </div> 
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default SolveProblem;


