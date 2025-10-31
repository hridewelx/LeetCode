const processSubmissionResults = (getSubmissionBatch, problem, isRun = false) => {
  let testCasePassed = 0;
  let runTime = 0;
  let memory = 0;
  let status = "Pending";
  let errorMessage = null;
  let overallAccepted = true;
  
  const submissionStatus = [
    "Wrong Answer",
    "Time Limit Exceeded", 
    "Compilation Error",
    "Runtime Error (SIGSEGV)",
    "Runtime Error (SIGXFSZ)",
    "Runtime Error (SIGFPE)", 
    "Runtime Error (SIGABRT)",
    "Runtime Error (NZEC)",
    "Runtime Error (Other)",
    "Internal Error",
    "Exec Format Error",
  ];

  const testCaseResults = [];
  const visibleTestCasesCount = problem.visibleTestCases.length;
  const hiddenTestCasesCount = problem.hiddenTestCases?.length || 0;

  for (let i = 0; i < getSubmissionBatch.length; i++) {
    const element = getSubmissionBatch[i];
    
    // Determine if this is a visible or hidden test case
    const isVisibleTestCase = i < visibleTestCasesCount;
    const testCase = isVisibleTestCase 
      ? problem.visibleTestCases[i]
      : problem.hiddenTestCases[i - visibleTestCasesCount];

    const testCaseResult = {
      passed: false,
      input: isRun || isVisibleTestCase ? testCase.input : "Hidden",
      expectedOutput: isRun || isVisibleTestCase ? testCase.output : "Hidden", 
      actualOutput: element.stdout || "",
      error: element.stderr || element.compile_output || "",
      runtime: Number(element.time) || 0,
      memory: Number(element.memory) || 0,
      status: "Pending",
      isVisible: isRun || isVisibleTestCase
    };

    if (element.status_id === 3) {
      // Accepted
      testCaseResult.passed = true;
      testCaseResult.status = "Accepted";
      testCaseResult.actualOutput = element.stdout || "";
      testCasePassed++;
      runTime += Number(element.time);
      memory = Math.max(memory, Number(element.memory));
    } else if (element.status_id === 4) {
      // Wrong Answer
      testCaseResult.passed = false;
      testCaseResult.status = "Wrong Answer";
      testCaseResult.actualOutput = element.stdout || "";
      if (isRun || isVisibleTestCase) {
        testCaseResult.error = `Expected: "${testCase.output}"\nGot: "${element.stdout || "No output"}"`;
      } else {
        testCaseResult.error = "Wrong Answer on hidden test case";
      }
      overallAccepted = false;
      if (!errorMessage) errorMessage = "Wrong Answer";
    } else if (element.status_id === 5) {
      // Time Limit Exceeded
      testCaseResult.passed = false;
      testCaseResult.status = "Time Limit Exceeded";
      testCaseResult.error = `Time Limit Exceeded (took ${element.time}s)`;
      overallAccepted = false;
      if (!errorMessage) errorMessage = "Time Limit Exceeded";
    } else if (element.status_id === 6) {
      // Compilation Error
      testCaseResult.passed = false;
      testCaseResult.status = "Compilation Error";
      testCaseResult.error = element.compile_output || "Compilation Error";
      overallAccepted = false;
      if (!errorMessage) errorMessage = "Compilation Error";
    } else if (element.status_id >= 7 && element.status_id <= 12) {
      // Runtime Errors
      testCaseResult.passed = false;
      testCaseResult.status = submissionStatus[element.status_id - 4];
      testCaseResult.error = element.stderr || submissionStatus[element.status_id - 4];
      overallAccepted = false;
      if (!errorMessage) errorMessage = submissionStatus[element.status_id - 4];
    } else if (element.status_id >= 13 && element.status_id <= 14) {
      // Other Judge0 errors
      testCaseResult.passed = false;
      testCaseResult.status = submissionStatus[element.status_id - 4];
      testCaseResult.error = submissionStatus[element.status_id - 4];
      overallAccepted = false;
      if (!errorMessage) errorMessage = submissionStatus[element.status_id - 4];
    } else {
      // Unknown errors
      testCaseResult.passed = false;
      testCaseResult.status = "Internal Error";
      testCaseResult.error = `Unknown status ID: ${element?.status_id}`;
      overallAccepted = false;
      if (!errorMessage) errorMessage = "Internal Error";
    }

    testCaseResults.push(testCaseResult);

    // For submit, break on first failure for hidden test cases
    if (!isRun && !testCaseResult.passed && !isVisibleTestCase) {
      break;
    }
  }

  if (overallAccepted) {
    status = "Accepted";
  } else {
    const firstFailed = testCaseResults.find((tc) => !tc.passed);
    status = firstFailed ? firstFailed.status : "Wrong Answer";
  }

  return {
    testCasePassed,
    runTime,
    memory,
    status,
    errorMessage,
    testCaseResults,
    overallAccepted
  };
};

export default processSubmissionResults;