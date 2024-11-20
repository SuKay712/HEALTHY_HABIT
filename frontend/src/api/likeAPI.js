import axiosClient from "./axiosClient";

const LikeAPI = {
    LikePost : async (userId, postId)=>{
        const url = `/api/user/post/like`
        return axiosClient.application.post(url,{
          userId : userId,
          itemId : postId
        })
    },
    LikeComment : async (userId, commentId)=>{
        const url = `/api/user/comment/like`
        return axiosClient.application.post(url,{
          userId : userId,
          itemId : commentId
        })
    },
}

export default LikeAPI;