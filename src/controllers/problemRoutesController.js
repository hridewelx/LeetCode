import Problem from '../models/problemSchema.js';
import { getLanguageId, submitBatch, submitToken } from '../utils/problemUtility.js';

const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, boilerplateCode, problemCreator, referenceSolution } = req.body;
        const submissionStatus = ["Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error (SIGSEGV)", "Runtime Error (SIGXFSZ)", "Runtime Error (SIGFPE)", "Runtime Error (SIGABRT)", "Runtime Error (NZEC)", "Runtime Error (Other)", "Internal Error", "Exec Format Error"];

        for (const { language, code } of referenceSolution) {
            const languageId = getLanguageId(language);
            // console.log("Visible Test Cases" ,visibleTestCases);
            // console.log("Hidden Test Cases" ,hiddenTestCases);
            // console.log("Code" ,code);
            // console.log("Language" ,language);
            // console.log("Language Id" ,languageId);

            // Create submission batch
            const createSubmissionBatch = visibleTestCases.map((element) => ({
                source_code: code,
                language_id: languageId,
                stdin: element.input,
                expected_output: element.output
            }));

            createSubmissionBatch.push(...hiddenTestCases.map((element) => ({
                source_code: code,
                language_id: languageId,
                stdin: element.input,
                expected_output: element.output
            })))

            const response = await submitBatch(createSubmissionBatch);
            // console.log("Response:", language, response);

            const responseTokenData = response.map((element) => {
                return element.token;
            })
            // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7", "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1", "5e5c7b3f-4c8d-4e0f-9b3b-7d3f8e3c9c4f"]
            // console.log("ResponseTokenData", responseTokenData);

            const getSubmissionBatch = await submitToken(responseTokenData);
            // console.log("GetSubmissionBatch", getSubmissionBatch);
            for (const element of getSubmissionBatch) {
                if (element.status_id > 3) {
                    console.log("Submission Status", submissionStatus[element.status_id - 4]);
                    return res.status(400).json({ message: submissionStatus[element.status_id - 4] });
                }
            };

        }
        await Problem.create({ title, description, difficulty, tags, visibleTestCases, hiddenTestCases, boilerplateCode, problemCreator, referenceSolution });
        console.log("Problem is Accepted");
        return res.status(200).json({ message: "Problem Stored in Database successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Problem creation failed" });
    }
}

export { createProblem };




const p1 = {
    "title": "Add Two Numbers",
    "description": "Given two integers a and b, return their sum.",
    "difficulty": "Easy",
    "tags": "Math",
    "visibleTestCases": [
        { "input": "1 2", "output": "3", "explanation": "1 + 2 = 3" },
        { "input": "0 0", "output": "0", "explanation": "0 + 0 = 0" },
        { "input": "-5 10", "output": "5", "explanation": "-5 + 10 = 5" },
        { "input": "-7 -3", "output": "-10", "explanation": "-7 + -3 = -10" }
    ],
    "hiddenTestCases": [
        { "input": "1000000 2345678", "output": "3345678" },
        { "input": "2147483647 0", "output": "2147483647" },
        { "input": "-2147483648 0", "output": "-2147483648" }
    ],
    "boilerplateCode": [
        {
            "language": "c",
            "code": "#include <stdio.h>\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    // Write your code here\n    return 0;\n}"
        },
        {
            "language": "c++",
            "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Write your code here\n    return 0;\n}"
        },
        {
            "language": "java",
            "code": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // Write your code here\n    }\n}"
        },
        {
            "language": "javascript",
            "code": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(' ');\nconst a = parseInt(input[0]);\nconst b = parseInt(input[1]);\n// Write your code here"
        },
        {
            "language": "python",
            "code": "a, b = map(int, input().split())\n# Write your code here"
        }
    ],
    "problemCreator": "652e2b2eac184a6cfb3bdf45",
    "referenceSolution": [
        {
            "language": "c",
            "code": "#include <stdio.h>\nint main() {\n    int a, b;\n    scanf(\"%d %d\", &a, &b);\n    printf(\"%d\", a + b);\n    return 0;\n}"
        },
        {
            "language": "c++",
            "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}"
        },
        {
            "language": "java",
            "code": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
        },
        {
            "language": "javascript",
            "code": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(' ');\nconst a = parseInt(input[0]);\nconst b = parseInt(input[1]);\nconsole.log(a + b);"
        },
        {
            "language": "python",
            "code": "a, b = map(int, input().split())\nprint(a + b)"
        }
    ]
}


const p2 = {
    "title": "3Sum",
    "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
    "difficulty": "Medium",
    "tags": ["Array", "TwoPointers", "Sorting"],
    "visibleTestCases": [
        {
            "input": "-1 0 1 2 -1 -4",
            "output": "[[-1,-1,2],[-1,0,1]]",
            "explanation": "All unique triplets that sum to zero are [[-1,-1,2],[-1,0,1]]."
        },
        {
            "input": "0 1 1",
            "output": "[]",
            "explanation": "No triplets sum to zero."
        },
        {
            "input": "0 0 0",
            "output": "[[0,0,0]]",
            "explanation": "Only one valid triplet: [0,0,0]."
        }
    ],
    "hiddenTestCases": [
        {
            "input": "3 -2 1 0 -1 2 -1 -4",
            "output": "[[-4,1,3],[-2,0,2],[-1,-1,2],[-1,0,1]]"
        },
        {
            "input": "1 2 -2 -1",
            "output": "[]"
        },
        {
            "input": "0 0 0 0 0",
            "output": "[[0,0,0]]"
        }
    ],
    "boilerplateCode": [
        {
            "language": "c",
            "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int nums[1000], n = 0;\n    while (scanf(\"%d\", &nums[n]) != EOF) n++;\n    // Write your code here\n    return 0;\n}"
        },
        {
            "language": "c++",
            "code": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    vector<int> nums;\n    int x;\n    while (cin >> x) nums.push_back(x);\n    // Write your code here\n    return 0;\n}"
        },
        {
            "language": "java",
            "code": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        // Write your code here\n    }\n}"
        },
        {
            "language": "javascript",
            "code": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);\n// Write your code here"
        },
        {
            "language": "python",
            "code": "import sys\nnums = list(map(int, sys.stdin.read().strip().split()))\n# Write your code here"
        }
    ],
    "problemCreator": "652e2b2eac184a6cfb3bdf45",
    "referenceSolution": [
        {
            "language": "c",
            "code": "// C solution for 3Sum\n#include <stdio.h>\n#include <stdlib.h>\nint main() { ... }"
        },
        {
            "language": "c++",
            "code": "// C++ solution for 3Sum\n#include <bits/stdc++.h>\nusing namespace std;\nint main() { ... }"
        },
        {
            "language": "java",
            "code": "// Java solution for 3Sum\nimport java.util.*;\nclass Main { public static void main(String[] args) { ... } }"
        },
        {
            "language": "javascript",
            "code": "// JavaScript solution for 3Sum\nconst fs = require('fs');\nconst nums = fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number);\n..."
        },
        {
            "language": "python",
            "code": "# Python solution for 3Sum\nimport sys\nnums = list(map(int, sys.stdin.read().strip().split()))\n..."
        }
    ]

}


const p3= {
  "title": "3Sum",
  "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
  "difficulty": "Medium",
  "tags": [
    "Array",
    "TwoPointers",
    "Sorting"
  ],
  "visibleTestCases": [
    {
      "input": "-1 0 1 2 -1 -4",
      "output": "[[-1,-1,2],[-1,0,1]]",
      "explanation": "All unique triplets that sum to zero are [[-1,-1,2],[-1,0,1]]."
    },
    {
      "input": "0 1 1",
      "output": "[]",
      "explanation": "No triplets sum to zero."
    },
    {
      "input": "0 0 0",
      "output": "[[0,0,0]]",
      "explanation": "Only one valid triplet: [0,0,0]."
    }
  ],
  "hiddenTestCases": [
    {
      "input": "3 -2 1 0 -1 2 -1 -4",
      "output": "[[-4,1,3],[-2,0,2],[-1,-1,2],[-1,0,1]]"
    },
    {
      "input": "1 2 -2 -1",
      "output": "[]"
    },
    {
      "input": "0 0 0 0 0",
      "output": "[[0,0,0]]"
    }
  ],
  "boilerplateCode": [
    {
      "language": "c",
      "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int nums[1000], n = 0;\n    while (scanf(\"%d\", &nums[n]) != EOF) n++;\n    // Write your solution here\n    return 0;\n}"
    },
    {
      "language": "c++",
      "code": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    vector<int> nums;\n    int x;\n    while (cin >> x) nums.push_back(x);\n    // Write your solution here\n    return 0;\n}"
    },
    {
      "language": "java",
      "code": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextInt()) nums.add(sc.nextInt());\n        // Write your solution here\n    }\n}"
    },
    {
      "language": "javascript",
      "code": "const fs = require('fs');\nconst nums = fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number);\n// Write your solution here"
    },
    {
      "language": "python",
      "code": "import sys\nnums = list(map(int, sys.stdin.read().strip().split()))\n# Write your solution here"
    }
  ],
  "problemCreator": "652e2b2eac184a6cfb3bdf45",
  "referenceSolution": [
    {
      "language": "c",
      "code": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    // Implement 3Sum logic here\n    return 0;\n}"
    },
    {
      "language": "c++",
      "code": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // Implement 3Sum logic here\n    return 0;\n}"
    },
    {
      "language": "java",
      "code": "import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n        // Implement 3Sum logic here\n    }\n}"
    },
    {
      "language": "javascript",
      "code": "// Implement 3Sum logic here\nconst fs = require('fs');\nconst nums = fs.readFileSync(0,'utf-8').trim().split(/\\s+/).map(Number);"
    },
    {
      "language": "python",
      "code": "# Implement 3Sum logic here\nimport sys\nnums = list(map(int, sys.stdin.read().strip().split()))"
    }
  ]
}
