import { useState } from "react";

const TestCasesPanel = ({ 
  problem, 
  testResults, 
  activeTestCaseIndex, 
  setActiveTestCaseIndex, 
  splitY 
}) => {
  // console.log("TestCasesPanel - problem:", problem); // Debug log
  // console.log("TestCasesPanel - testResults:", testResults); // Debug log
  
  return (
    <div className="flex flex-col flex-shrink-0 min-h-0" style={{ height: `${100 - splitY}%` }}>
      <TestCasesHeader testResults={testResults} />
      <TestCasesContent
        problem={problem}
        testResults={testResults}
        activeTestCaseIndex={activeTestCaseIndex}
        setActiveTestCaseIndex={setActiveTestCaseIndex}
      />
    </div>
  );
};

const TestCasesHeader = ({ testResults }) => (
  <div className="flex items-center justify-between p-2 bg-slate-800/70 border-b border-slate-700/50 flex-shrink-0">
    <h3 className="text-sm font-semibold text-white">
      {testResults ? "Test Results" : "Test Cases"}
    </h3>
    {testResults && <StatusBadge status={testResults.submissionResult?.status} />}
  </div>
);

const StatusBadge = ({ status }) => (
  <div className={`px-2 py-1 rounded text-xs font-medium ${
    status === "Accepted" 
      ? "bg-green-600/20 text-green-400 border border-green-600/40"
      : status === "Wrong Answer"
      ? "bg-red-600/20 text-red-400 border border-red-600/40"
      : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40"
  }`}>
    {status || "Running"}
  </div>
);

const TestCasesContent = ({ problem, testResults, activeTestCaseIndex, setActiveTestCaseIndex }) => (
  <div className="flex-1 overflow-hidden">
    <TestCasesNavigation
      problem={problem}
      testResults={testResults}
      activeTestCaseIndex={activeTestCaseIndex}
      setActiveTestCaseIndex={setActiveTestCaseIndex}
    />
    <TestCasesBody
      problem={problem}
      testResults={testResults}
      activeTestCaseIndex={activeTestCaseIndex}
    />
  </div>
);

const TestCasesNavigation = ({ problem, testResults, activeTestCaseIndex, setActiveTestCaseIndex }) => {
  // If no problem data, show loading state
  if (!problem) {
    return (
      <div className="flex items-center px-4 bg-slate-900 border-b border-slate-700/50 py-2">
        <div className="text-slate-400 text-sm">Loading test cases...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center px-4 bg-slate-900 border-b border-slate-700/50">
      {!testResults ? (
        // Regular test case tabs when no results
        problem?.visibleTestCases?.map((testCase, index) => (
          <button
            key={testCase._id || index}
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
          {testResults && (
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
          )}
        </div>
      )}
    </div>
  );
};

const TestCasesBody = ({ problem, testResults, activeTestCaseIndex }) => {
  // If no problem data, show loading state
  if (!problem) {
    return (
      <div className="h-full overflow-y-auto p-4 bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading test cases...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-slate-900">
      {testResults ? (
        // Show individual test case results
        testResults.testCaseResults && testResults.testCaseResults[activeTestCaseIndex] ? (
          <TestCaseResultDetail 
            testCase={testResults.testCaseResults[activeTestCaseIndex]} 
            index={activeTestCaseIndex}
          />
        ) : (
          // Fallback when no individual test case results
          <DefaultResultView testResults={testResults} />
        )
      ) : (
        // Show regular test case input/output when no results
        problem?.visibleTestCases && problem.visibleTestCases[activeTestCaseIndex] ? (
          <RegularTestCaseView testCase={problem.visibleTestCases[activeTestCaseIndex]} />
        ) : (
          <div className="text-slate-400 text-center py-8">
            No test cases available
          </div>
        )
      )}
    </div>
  );
};

const TestCaseResultDetail = ({ testCase, index }) => (
  <div className="space-y-4">
    {/* Test Case Status */}
    <div className={`p-3 rounded-lg border ${
      testCase.passed
        ? "bg-green-600/10 border-green-600/30"
        : "bg-red-600/10 border-red-600/30"
    }`}>
      <div className="flex items-center gap-2">
        {testCase.passed ? (
          <>
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-green-400">Test Case {index + 1} Passed</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-red-400">Test Case {index + 1} Failed</span>
          </>
        )}
      </div>
    </div>

    {/* Input */}
    <div className="space-y-2">
      <p className="text-slate-400 font-medium text-sm">Input:</p>
      <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
        {testCase.input || "No input provided"}
      </pre>
    </div>

    {/* Expected vs Actual Output */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Expected Output */}
      <div className="space-y-2">
        <p className="text-slate-400 font-medium text-sm">Expected Output:</p>
        <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
          {testCase.expectedOutput || "No expected output"}
        </pre>
      </div>

      {/* Actual Output */}
      <div className="space-y-2">
        <p className="text-slate-400 font-medium text-sm">Your Output:</p>
        <pre className={`p-3 rounded text-sm border whitespace-pre-wrap ${
          testCase.passed
            ? "bg-green-600/10 text-green-400 border-green-600/30"
            : "bg-red-600/10 text-red-400 border-red-600/30"
        }`}>
          {testCase.actualOutput || "No output"}
        </pre>
      </div>
    </div>

    {/* Error Message (if any) */}
    {testCase.error && (
      <div className="space-y-2">
        <p className="text-slate-400 font-medium text-sm">Error:</p>
        <pre className="bg-red-600/10 p-3 rounded text-sm text-red-400 border border-red-600/30 whitespace-pre-wrap">
          {testCase.error}
        </pre>
      </div>
    )}

    {/* Runtime Info */}
    {testCase.runtime && (
      <div className="text-xs text-slate-400">
        Runtime: <span className="text-white">{testCase.runtime}s</span>
        {testCase.memory && (
          <> | Memory: <span className="text-white">{testCase.memory}KB</span></>
        )}
      </div>
    )}
  </div>
);

const DefaultResultView = ({ testResults }) => (
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
);

const RegularTestCaseView = ({ testCase }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <p className="text-slate-400 font-medium text-sm">Input:</p>
      <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
        {testCase.input || "No input provided"}
      </pre>
    </div>
    <div className="space-y-2">
      <p className="text-slate-400 font-medium text-sm">Output:</p>
      <pre className="bg-slate-800/50 p-3 rounded text-sm text-slate-200 border border-slate-700/50 whitespace-pre-wrap">
        {testCase.output || "No output provided"}
      </pre>
    </div>
  </div>
);

export default TestCasesPanel;