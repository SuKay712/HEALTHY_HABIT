import axiosClient from "./axiosClient";

const PostAPI = {
    getAllPost : async (userId)=>{
        const url = `/api/user/post?param=${userId}`
        return axiosClient.application.get(url)
    },
}

export default PostAPI;