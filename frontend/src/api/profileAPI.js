// aimAPI.jsx
import axiosClient from "./axiosClient";

const profileAPI = {
  getProfile: async (id) => {
    const response = await axiosClient.application.get(
      `/api/user/profile/${id}`
    );
    return response.data;
  },
  updateAvatar: async (data) => {
    const response = await axiosClient.formData.put(
      "/api/user/profile/avatar",
      data
    );
    return response.data;
  },
  updateBackgroundImage: async (data) => {
    const response = await axiosClient.formData.put(
      "/api/user/profile/bgimage",
      data
    );
    return response.data;
  },
  updateProfileInfo: async (data) => {
    const response = await axiosClient.application.put(
      "/api/user/profile",
      data
    );
    return response.data;
  },
  updatePassword: async (data) => {
    const response = await axiosClient.application.put(
      `/api/auth/changepwd`,
      data
    );
    return response.data;
  },
  
};

export default profileAPI;
