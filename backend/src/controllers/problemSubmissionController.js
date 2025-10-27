import Problem from "../models/problemSchema.js";
import Submission from "../models/submissionSchema.js";
import { getLanguageId, submitBatch, submitToken } from "../utils/problemUtility.js";

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
            totalTestCases: problem.visibleTestCases.length + problem.hiddenTestCases.length
        });

        const createSubmissionBatch = [
            ...problem.visibleTestCases.map((element) => ({
                source_code: code,
                language_id: languageId,
                stdin: element.input,
                expected_output: element.output
            }))
        ];

        const response = await submitBatch(createSubmissionBatch);
        const responseTokenData = response.map((element) => {
            return element.token;
        });

        const getSubmissionBatch = await submitToken(responseTokenData);

        let testCasePassed = 0;
        let runTime = 0;
        let memory = 0;
        let status = "Pending";
        let errorMessage = null;
        let overallAccepted = true;
        const submissionStatus = ["Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error (SIGSEGV)", "Runtime Error (SIGXFSZ)", "Runtime Error (SIGFPE)", "Runtime Error (SIGABRT)", "Runtime Error (NZEC)", "Runtime Error (Other)", "Internal Error", "Exec Format Error"];

        for (const element of getSubmissionBatch) {
            if (element.status_id === 3) {
                testCasePassed++;
                runTime = runTime + Number(element.time);
                memory = Math.max(memory, Number(element.memory));
            } else {
                overallAccepted = false;
                status = submissionStatus[element.status_id - 4];
                errorMessage = element.stderr;
                break;
            }
        }

        if (overallAccepted) {
            status = "Accepted";
        }

        submissionResult.status = status;
        submissionResult.runTime = runTime;
        submissionResult.memory = memory;
        submissionResult.testCasePassed = testCasePassed;
        submissionResult.errorMessage = errorMessage;

        if ((!req.user.problemsSolved.includes(problemId)) && overallAccepted) {
            req.user.problemsSolved.push(problemId);
        }
        return res.status(200).json({ message: "Submission successful", submissionResult });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Submission failed" });
    }
}

const submitProblem = async (req, res) => {

    try {
        const userId = req.user._id;
        // console.log(req.user);
        // res.status(200).send(req.user);

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
            totalTestCases: problem.visibleTestCases.length + problem.hiddenTestCases.length
        });

        const createSubmissionBatch = [
            ...problem.visibleTestCases.map((element) => ({
                source_code: code,
                language_id: languageId,
                stdin: element.input,
                expected_output: element.output
            })),
            ...problem.hiddenTestCases.map((element) => ({
                source_code: code,
                language_id: languageId,
                stdin: element.input,
                expected_output: element.output
            }))
        ];

        const response = await submitBatch(createSubmissionBatch);
        const responseTokenData = response.map((element) => {
            return element.token;
        });

        const getSubmissionBatch = await submitToken(responseTokenData);

        let testCasePassed = 0;
        let runTime = 0;
        let memory = 0;
        let status = "Pending";
        let errorMessage = null;
        let overallAccepted = true;
        const submissionStatus = ["Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error (SIGSEGV)", "Runtime Error (SIGXFSZ)", "Runtime Error (SIGFPE)", "Runtime Error (SIGABRT)", "Runtime Error (NZEC)", "Runtime Error (Other)", "Internal Error", "Exec Format Error"];

        for (const element of getSubmissionBatch) {
            if (element.status_id === 3) {
                testCasePassed++;
                runTime = runTime + Number(element.time);
                memory = Math.max(memory, Number(element.memory));
            } else {
                overallAccepted = false;
                status = submissionStatus[element.status_id - 4];
                errorMessage = element.stderr;
                break;
            }
        }

        if (overallAccepted) {
            status = "Accepted";
        }

        submissionResult.status = status;
        submissionResult.runTime = runTime;
        submissionResult.memory = memory;
        submissionResult.testCasePassed = testCasePassed;
        submissionResult.errorMessage = errorMessage;

        await submissionResult.save();
        if ((!req.user.problemsSolved.includes(problemId)) && overallAccepted) {
            req.user.problemsSolved.push(problemId);
            await req.user.save();
        }
        return res.status(200).json({ message: "Submission successful", submissionResult });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Submission failed" });
    }
}

export { runProblem, submitProblem };