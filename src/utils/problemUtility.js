import axios from "axios";

const delayOneSecond = async () => {
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
      'x-rapidapi-key': process.env.JUDGE1_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST,
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
      'x-rapidapi-key': process.env.JUDGE1_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
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