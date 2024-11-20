import axiosClient from "./axiosClient";

const PostAPI = {

  getAllPostByUserId: async (userId) => {
    const url = `/api/user/post?param=${userId}`;
    return axiosClient.application.get(url);
  },
  getAllPost: async (page) => {
    const url = `/api/user/allPost?page=${page}&size=5`;
    return axiosClient.application.get(url);
  },
  getHotPosts: async () => {
    const url = `/api/user/hotPost`;
    return axiosClient.application.get(url);
  },
};
export default PostAPI;
