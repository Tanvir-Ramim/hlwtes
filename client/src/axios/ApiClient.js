import axios from "axios";
const ApiClient = axios.create({
  baseURL: "http://localhost:8000/leave/api/v1",
  // baseURL: "http://server-lms.weepoka.com/leave/api/v1",
  // baseURL: "https://lms-server.weerodigital.com/leave/api/v1",
  // baseURL: "https://57e5-103-159-73-53.ngrok-free.app/leave/api/v1",
});

export default ApiClient;
