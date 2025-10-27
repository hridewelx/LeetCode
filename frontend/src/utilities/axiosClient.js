import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://localhost:3515/',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;