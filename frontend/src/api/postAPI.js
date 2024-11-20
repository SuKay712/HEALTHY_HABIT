import axiosClient from "./axiosClient";

const PostAPI = {

  getAllPostByUserId: async (userId) => {
    const url = `/api/user/post?param=${userId}`;
    return axiosClient.application.get(url);
  },
  getAllPost: async (page, size) => {
    const params = new URLSearchParams();
    if (!isNaN(parseFloat(page)) && isFinite(page)) {
      params.append("page", page);
    }

    if (size) {
      params.append("size", size);
    }

    const url = `/api/user/allPost${params && "?" + params.toString()}`;
    return axiosClient.application.get(url);
  },
  getHotPosts: async () => {
    const url = `/api/user/hotPost`;
    return axiosClient.application.get(url);
  },
};
export default PostAPI;
