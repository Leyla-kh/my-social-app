import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mysocialapp-2q9l.onrender.com/api",
});
