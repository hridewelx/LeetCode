import axios from "axios";

const delayOneSecond = async() => {
  setTimeout(() => {
    return 1;
  }, 1000);
}

const getLanguageId = (language) => {
  const languageId = {
    "c": 50,
    "c++": 54,
    "java": 62,
    "javascript": 102,
    "python": 109
  }
  return languageId[language.toLowerCase()];
}

const submitBatch = async (createSubmissionBatch) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
    },
    data: {
      submissions: createSubmissionBatch
    }
  };

async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
}

const submitToken = async (responseTokenData) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: responseTokenData.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const data = await fetchData();  
    const isValidStatus = data.submissions.every((submission) => {
      return submission.status_id >= 3;
    });
    if (isValidStatus) {
      return data.submissions;
    }
    await delayOneSecond();
  }
  
}

export { getLanguageId, submitBatch, submitToken };



const problemData = {
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
