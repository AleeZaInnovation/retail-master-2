import axios from "axios";
const local = "https://retail-master.onrender.com";
//const local = "http://localhost:8000";
const api = axios.create({
  baseURL: `${local}/api/v1`,
  withCredentials: true,
});
export default api;
