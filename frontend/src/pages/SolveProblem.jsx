import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { toast, Toaster } from "react-hot-toast";

// Import components
import {
  Header,
  ProblemDescription,
  CodeEditor,
  TestCasesPanel,
  ResizableSplit,
  ResultsTab,
  NotesPanel,
  ComingSoonTab,
  ProblemNotFound,
  LoadingSpinner,
} from "../components/SolveProblem";

const SolveProblem = () => {
  const { problemId } = useParams();
  const { user } = useSelector((state) => state.authentication);
  // console.log("user", user);

  // State management
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [language, setLanguage] = useState("python");
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);

  // Feature states
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  const [submissionResults, setSubmissionResults] = useState(null);
  const [showResultsTab, setShowResultsTab] = useState(false);

  // Resizable splits
  const [splitX, setSplitX] = useState(40);
  const [splitY, setSplitY] = useState(70);
  const [isDraggingX, setIsDraggingX] = useState(false);
  const [isDraggingY, setIsDraggingY] = useState(false);

  // Clock states
  const [showClockMenu, setShowClockMenu] = useState(false);
  const [clockMode, setClockMode] = useState(null);
  const [timeValue, setTimeValue] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const clockRef = useRef(null);

  const splitXRef = useRef(null);
  const splitYRef = useRef(null);

  // Data fetching
  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      updateCodeFromBoilerplate();
    }
  }, [language, problem]);

  // Clock logic
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

  // Mouse event handlers for resizable splits
  useEffect(() => {
    const handleMouseMoveX = (e) => {
      // console.log("handleMouseMoveX",e);
      if (!isDraggingX) return;

      e.preventDefault();

      const container = splitXRef.current;
      // console.log("handleMouseMoveX container",container);
      if (!container) return;

      const rect = container.getBoundingClientRect();
      console.log("handleMouseMoveX rect", rect);
      const newSplitX = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitX(Math.min(Math.max(newSplitX, 25), 75));
    };

    const handleMouseMoveY = (e) => {
      if (!isDraggingY) return;

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

      document.body.style.userSelect = "auto";
      document.body.style.cursor = "auto";
    };

    if (isDraggingX || isDraggingY) {
      document.body.style.userSelect = "none";

      document.addEventListener(
        "mousemove",
        isDraggingX ? handleMouseMoveX : handleMouseMoveY
      );
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveX);
      document.removeEventListener("mousemove", handleMouseMoveY);
      document.removeEventListener("mouseup", handleMouseUp);

      document.body.style.userSelect = "auto";
      document.body.style.cursor = "auto";
    };
  }, [isDraggingX, isDraggingY]);

  const fetchProblem = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosClient.get(
        `/problems/problemfetchbyid/${problemId}`
      );
      setProblem(data.problem);
      // toast.success("Problem loaded successfully");
      updateCodeFromBoilerplate(data.problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("Failed to load problem");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCodeFromBoilerplate = (problemData = problem) => {
    const boilerplate = problemData?.boilerplateCode?.find(
      (bp) => bp.language === language
    );
    setCode(boilerplate?.code || `// Write your code in ${language}`);
  };

  const handleRunTests = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before running test cases");
      return;
    }

    setIsRunning(true);
    try {
      const { data } = await axiosClient.post(`/submissions/run/${problemId}`, {
        code,
        language,
      });

      setTestResults(data);

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
      const { data } = await axiosClient.post(
        `/submissions/submit/${problemId}`,
        {
          code,
          language,
        }
      );

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

  if (isLoading) return <LoadingSpinner />;
  if (!problem) return <ProblemNotFound />;

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Toaster position="top-right" reverseOrder={true} />

      <Header
        handleRunTests={handleRunTests}
        handleSubmit={handleSubmit}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        showStickyNotes={showStickyNotes}
        setShowStickyNotes={setShowStickyNotes}
        setActiveTab={setActiveTab}
        clockMode={clockMode}
        showClockMenu={showClockMenu}
        setShowClockMenu={setShowClockMenu}
        timeValue={timeValue}
        formatTime={formatTime}
        isClockRunning={isClockRunning}
        setIsClockRunning={setIsClockRunning}
        handleClockReset={handleClockReset}
        timerDuration={timerDuration}
        handleTimerDurationChange={handleTimerDurationChange}
        setClockMode={setClockMode}
        setTimeValue={setTimeValue}
        handleClockModeSelect={handleClockModeSelect}
      />

      <MainContent
        splitXRef={splitXRef}
        isDraggingX={isDraggingX}
        splitX={splitX}
        splitY={splitY}
        splitYRef={splitYRef}
        setIsDraggingX={setIsDraggingX}
        setIsDraggingY={setIsDraggingY}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showStickyNotes={showStickyNotes}
        setShowStickyNotes={setShowStickyNotes}
        problem={problem}
        getDifficultyColor={getDifficultyColor}
        submissionResults={submissionResults}
        showResultsTab={showResultsTab}
        setShowResultsTab={setShowResultsTab}
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
        testResults={testResults}
        activeTestCaseIndex={activeTestCaseIndex}
        setActiveTestCaseIndex={setActiveTestCaseIndex}
      />
    </div>
  );
};

const MainContent = ({
  splitXRef,
  isDraggingX,
  splitX,
  splitY,
  splitYRef,
  setIsDraggingX,
  setIsDraggingY,
  activeTab,
  setActiveTab,
  showStickyNotes,
  setShowStickyNotes,
  problem,
  getDifficultyColor,
  submissionResults,
  showResultsTab,
  setShowResultsTab,
  language,
  setLanguage,
  code,
  setCode,
  testResults,
  activeTestCaseIndex,
  setActiveTestCaseIndex,
}) => (
  <div
    ref={splitXRef}
    className="flex h-[calc(100vh-50px)]"
    style={{ cursor: isDraggingX ? "col-resize" : "default" }}
  >
    <LeftPanel
      splitX={splitX}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showStickyNotes={showStickyNotes}
      setShowStickyNotes={setShowStickyNotes}
      problem={problem}
      getDifficultyColor={getDifficultyColor}
      submissionResults={submissionResults}
      showResultsTab={showResultsTab}
      setShowResultsTab={setShowResultsTab}
    />

    <ResizableSplit
      direction="horizontal"
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDraggingX(true);
      }}
    />

    <RightPanel
      splitX={splitX}
      splitY={splitY}
      splitYRef={splitYRef}
      setIsDraggingY={setIsDraggingY}
      language={language}
      setLanguage={setLanguage}
      code={code}
      setCode={setCode}
      problem={problem} // Make sure this line exists
      testResults={testResults}
      activeTestCaseIndex={activeTestCaseIndex}
      setActiveTestCaseIndex={setActiveTestCaseIndex}
    />
  </div>
);

const LeftPanel = ({
  splitX,
  activeTab,
  setActiveTab,
  showStickyNotes,
  setShowStickyNotes,
  problem,
  getDifficultyColor,
  submissionResults,
  showResultsTab,
  setShowResultsTab,
}) => (
  <div
    className="h-full overflow-hidden flex flex-col bg-slate-900 border-r border-slate-700/50"
    style={{ width: `${splitX}%` }}
  >
    <div className="border-b border-slate-700/50 flex-shrink-0">
      <div className="flex px-4">
        {/* Regular Tabs */}
        {[
          "description",
          "editorial",
          "solutions",
          "submissions",
          ...(showResultsTab ? ["results"] : []),
        ].map((tab) => (
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
        ))}

        {/* Notes Tab - Only shown when active */}
        {showStickyNotes && (
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 flex items-center gap-1 ${
              activeTab === "notes"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStickyNotes(false);
                setActiveTab("description");
              }}
              className="text-slate-400 hover:text-white ml-1"
              title="Close Notes"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </button>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {activeTab === "description" && (
        <ProblemDescription
          problem={problem}
          getDifficultyColor={getDifficultyColor}
        />
      )}

      {activeTab === "results" && submissionResults && (
        <ResultsTab
          submissionResults={submissionResults}
          onClose={() => {
            setShowResultsTab(false);
            setActiveTab("description");
          }}
        />
      )}

      {activeTab === "notes" && showStickyNotes && (
        <NotesPanel
          problemId={problem._id}
          onClose={() => {
            setShowStickyNotes(false);
            setActiveTab("description");
          }}
        />
      )}

      {(activeTab === "editorial" ||
        activeTab === "solutions" ||
        activeTab === "submissions") &&
        !showStickyNotes &&
        activeTab !== "notes" && <ComingSoonTab tabName={activeTab} />}
    </div>
  </div>
);

const RightPanel = ({
  splitX,
  splitY,
  splitYRef,
  setIsDraggingY,
  language,
  setLanguage,
  code,
  setCode,
  problem,
  testResults,
  activeTestCaseIndex,
  setActiveTestCaseIndex,
}) => (
  <div
    className="h-full flex flex-col bg-slate-900"
    style={{ width: `${100 - splitX}%` }}
    ref={splitYRef}
  >
    <CodeEditor
      language={language}
      setLanguage={setLanguage}
      code={code}
      setCode={setCode}
      splitY={splitY}
    />

    <ResizableSplit
      direction="vertical"
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDraggingY(true);
      }}
    />

    <TestCasesPanel
      problem={problem}
      testResults={testResults}
      activeTestCaseIndex={activeTestCaseIndex}
      setActiveTestCaseIndex={setActiveTestCaseIndex}
      splitY={splitY}
    />
  </div>
);

export default SolveProblem;
