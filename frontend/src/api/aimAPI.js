// aimAPI.jsx
import axiosClient from "./axiosClient";

const aimAPI = {
  postTask: async (data) => {
    const response = await axiosClient.application.post("/api/user/task", data);
    return response.data;
  },
  getTaskInComplete: async (params) => {
    const response = await axiosClient.application.get(
      "/api/user/task/in-progress",
      {
        params,
      }
    );
    return response.data; // Trả về dữ liệu từ phản hồi
  },
  getTaskEnded: async (params) => {
    const response = await axiosClient.application.get("/api/user/task/ended", {
      params,
    });
    return response.data; // Trả về dữ liệu từ phản hồi
  },
  updateTask: async (data) => {
    const response = await axiosClient.application.put("/api/user/task", data);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await axiosClient.application.delete(
      `/api/user/task/${id}`
    );
    return response.data;
  },
};

export default aimAPI;
