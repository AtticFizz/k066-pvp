import axios from "axios";

export const BASE_URL = process.env.REACT_APP_BASE_API_URL;

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export { axiosAuth };
