// aimAPI.jsx
import axios from "axios";

// Khởi tạo instance axios
const apiClient = axios.create({
  baseURL: "https://healthy-habit.onrender.com", // Đường dẫn cơ sở
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm gửi yêu cầu POST
export const postTask = async (data) => {
  try {
    const response = await apiClient.post("/api/user/task", data);
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    throw error; // Ném lỗi để xử lý sau
  }
};

export const getTaskInComplete = async (params) => {
  try {
    const response = await apiClient.get("/api/user/task/in-progress", {
      params,
    });
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    throw error; // Ném lỗi để xử lý sau
  }
};

export const getTaskEnded = async (params) => {
  try {
    const response = await apiClient.get("/api/user/task/ended", { params });
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    throw error; // Ném lỗi để xử lý sau
  }
};
