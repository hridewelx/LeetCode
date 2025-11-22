import Problem from "../models/problemSchema.js";
import Submission from "../models/submissionSchema.js";
import User from "../models/userSchema.js";
import {
  getLanguageId,
  submitBatch,
  submitToken,
} from "../utils/problemUtility.js";

const validateReferenceSolutions = async (
  referenceSolution,
  visibleTestCases,
  hiddenTestCases
) => {
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
  for (const { language, code } of referenceSolution) {
    const languageId = getLanguageId(language);
    console.log("Visible Test Cases" ,visibleTestCases);
    console.log("Hidden Test Cases" ,hiddenTestCases);
    console.log("Code" ,code);
    console.log("Language" ,language);
    console.log("Language Id" ,languageId);

    // Create submission batch
    const createSubmissionBatch = visibleTestCases.map((element) => ({
      source_code: code,
      language_id: languageId,
      stdin: element.input,
      expected_output: element.output,
    }));

    createSubmissionBatch.push(
      ...hiddenTestCases.map((element) => ({
        source_code: code,
        language_id: languageId,
        stdin: element.input,
        expected_output: element.output,
      }))
    );

    const response = await submitBatch(createSubmissionBatch);
    // console.log("Response:", language, response);

    const responseTokenData = response.map((element) => {
      return element.token;
    });
    // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7", "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1", "5e5c7b3f-4c8d-4e0f-9b3b-7d3f8e3c9c4f"]
    // console.log("ResponseTokenData", responseTokenData);

    const getSubmissionBatch = await submitToken(responseTokenData);
    // console.log("GetSubmissionBatch", getSubmissionBatch);
    for (const element of getSubmissionBatch) {
      if (element.status_id > 3) {
        return submissionStatus[element.status_id - 4];
      }
    }
  }
  return null;
};

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    boilerplateCode,
    problemCreator,
    referenceSolution,
  } = req.body;

  try {
    const message = await validateReferenceSolutions(
      referenceSolution,
      visibleTestCases,
      hiddenTestCases
    );
    if (message) {
      // console.log("Submission Status", message);
      return res.status(400).json({ message });
    }
    await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      boilerplateCode,
      problemCreator,
      referenceSolution,
    });
    console.log("Problem is Accepted");
    return res
      .status(200)
      .json({ message: "Problem Stored in Database successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem creation failed" });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    boilerplateCode,
    problemCreator,
    referenceSolution,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Problem id is required" });
    }
    const dsaProblem = await Problem.findById(id);
    if (!dsaProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const message = await validateReferenceSolutions(
      referenceSolution,
      visibleTestCases,
      hiddenTestCases
    );
    if (message) {
      console.log("Submission Status", message);
      return res.status(400).json({ message });
    }
    const newUpdatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        boilerplateCode,
        problemCreator,
        referenceSolution,
      },
      { new: true }
    );

    if (!newUpdatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res
      .status(200)
      .json({ message: "Problem Updated Successfully", newUpdatedProblem });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem Updation Failed" });
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Problem id is required" });
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem deletion failed" });
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Problem id is required" });
    }
    // const problem = await Problem.findById(id).select("-referenceSolution -hiddenTestCases -problemCreator -__v");
    const problem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases hiddenTestCases boilerplateCode createdAt updatedAt"
    );
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res
      .status(200)
      .json({ message: "Problem fetched successfully", problem });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem fetch failed" });
  }
};

const getProblemByIdFetchedByAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Problem id is required" });
    }
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res
      .status(200)
      .json({ message: "Problem fetched successfully", problem });
  } catch (error) {
    console.log(error);
    if (error.message === "Problem not found") {
      return res.status(404).json({ message: "Problem not found" });
    } else {
      return res.status(400).json({ message: "Problem fetch failed" });
    } 
  }
}

const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).select("_id title difficulty tags");
    if (problems.length === 0) {
      return res.status(404).json({ message: "Problems not found" });
    }
    return res
      .status(200)
      .json({ message: "Problems fetched successfully", problems });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem fetch failed" });
  }
};

const individualSolvedProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    let problems = await User.findById(userId).populate({
      path: "problemsSolved",
      select: "_id title difficulty tags",
    });
    if (!problems) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res
      .status(200)
      .json({
        message: "Problem fetched successfully",
        problems: problems.problemsSolved,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem fetch failed" });
  }
};

const individualProblemSubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.problemId;
    const submissions = await Submission.find({ userId, problemId });
    // const submissions = await Submission.find({ userId, problemId }).explain('executionStats');

    if (submissions.length === 0) {
      return res.status(200).json({
        message: "No submissions found for this problem",
        submissions: submissions,
        totalSubmissions: 0,
      });
    }
    return res
      .status(200)
      .json({
        message: "Submission fetched successfully",
        submissions,
        totalSubmissions: submissions.length,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Submission fetch failed" });
  }
};

const individualProblemAllSubmissions = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submissions = await Submission.find({ problemId });
    if (submissions.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }
    return res
      .status(200)
      .json({ message: "Submission fetched successfully", submissions });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Problem does not exist" });
  }
};

export {
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getProblemByIdFetchedByAdmin,
  individualSolvedProblems,
  individualProblemSubmissions,
  individualProblemAllSubmissions,
};
