import axios from "axios";

const api = axios.create({
  baseURL: "https://billing-system-backendkj.onrender.com", // your Render backend
});

export default api;
