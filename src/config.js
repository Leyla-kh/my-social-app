import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mySocialApp.onrender.com/api",
});
