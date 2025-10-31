import Problem from "../models/problemSchema.js";
import Submission from "../models/submissionSchema.js";
import {
  getLanguageId,
  submitBatch,
  submitToken,
} from "../utils/problemUtility.js";
import processSubmissionResults from "../utils/submissionUtils.js";

const runProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;
    
    if (!userId || !problemId) {
      return res.status(400).json({ message: "User id and problem id are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const { language, code } = req.body;
    const languageId = getLanguageId(language);
    
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const submissionResult = await Submission.create({
      userId,
      problemId,
      language,
      code,
      status: "Pending",
      runTime: 0,
      memory: 0,
      totalTestCases: problem.visibleTestCases.length,
    });

    // Only run visible test cases
    const createSubmissionBatch = problem.visibleTestCases.map((element) => ({
      source_code: code,
      language_id: languageId,
      stdin: element.input,
      expected_output: element.output,
    }));

    const response = await submitBatch(createSubmissionBatch);
    const responseTokenData = response.map((element) => element.token);
    const getSubmissionBatch = await submitToken(responseTokenData);

    // Process results using common function
    const {
      testCasePassed,
      runTime,
      memory,
      status,
      errorMessage,
      testCaseResults,
      overallAccepted
    } = processSubmissionResults(getSubmissionBatch, problem, true);

    // Update submission record
    submissionResult.status = status;
    submissionResult.runTime = runTime;
    submissionResult.memory = memory;
    submissionResult.testCasePassed = testCasePassed;
    submissionResult.errorMessage = errorMessage;
    await submissionResult.save();

    // Update user's solved problems if accepted
    if (!req.user.problemsSolved.includes(problemId) && overallAccepted) {
      req.user.problemsSolved.push(problemId);
      await req.user.save();
    }

    return res.status(200).json({
      message: "Run successful",
      submissionResult,
      testCaseResults,
    });
  } catch (error) {
    console.log("Run error:", error);
    return res.status(500).json({ message: "Run failed" });
  }
};

const submitProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;
    
    if (!userId || !problemId) {
      return res.status(400).json({ message: "User id and problem id are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const { language, code } = req.body;
    const languageId = getLanguageId(language);
    
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const submissionResult = await Submission.create({
      userId,
      problemId,
      language,
      code,
      status: "Pending",
      runTime: 0,
      memory: 0,
      totalTestCases: problem.visibleTestCases.length + (problem.hiddenTestCases?.length || 0),
    });

    // Run both visible and hidden test cases for submission
    const createSubmissionBatch = [
      ...problem.visibleTestCases.map((element) => ({
        source_code: code,
        language_id: languageId,
        stdin: element.input,
        expected_output: element.output,
      })),
      ...(problem.hiddenTestCases?.map((element) => ({
        source_code: code,
        language_id: languageId,
        stdin: element.input,
        expected_output: element.output,
      })) || []),
    ];

    const response = await submitBatch(createSubmissionBatch);
    const responseTokenData = response.map((element) => element.token);
    const getSubmissionBatch = await submitToken(responseTokenData);

    // Process results using common function
    const {
      testCasePassed,
      runTime,
      memory,
      status,
      errorMessage,
      testCaseResults,
      overallAccepted
    } = processSubmissionResults(getSubmissionBatch, problem, false);

    // Update submission record
    submissionResult.status = status;
    submissionResult.runTime = runTime;
    submissionResult.memory = memory;
    submissionResult.testCasePassed = testCasePassed;
    submissionResult.errorMessage = errorMessage;
    await submissionResult.save();

    // Update user's solved problems if accepted
    if (!req.user.problemsSolved.includes(problemId) && overallAccepted) {
      req.user.problemsSolved.push(problemId);
      await req.user.save();
    }

    // Calculate performance metrics
    const performanceMetrics = {
      totalTestCases: testCaseResults.length,
      passedTestCases: testCasePassed,
      successRate: Math.round((testCasePassed / testCaseResults.length) * 100),
      averageRuntime: runTime / testCaseResults.length,
      maxMemory: memory,
      visibleTestCases: {
        total: problem.visibleTestCases.length,
        passed: testCaseResults.filter((tc, index) => tc.passed && index < problem.visibleTestCases.length).length
      },
      hiddenTestCases: {
        total: problem.hiddenTestCases?.length || 0,
        passed: testCaseResults.filter((tc, index) => tc.passed && index >= problem.visibleTestCases.length).length
      }
    };

    return res.status(200).json({
      message: "Submission successful",
      submissionResult,
      testCaseResults: testCaseResults.map((tc, index) => ({
        ...tc,
        testCaseNumber: index + 1,
        isHidden: index >= problem.visibleTestCases.length
      })),
      performanceMetrics
    });
  } catch (error) {
    console.log("Submit error:", error);
    return res.status(500).json({ message: "Submission failed" });
  }
};

export { runProblem, submitProblem };