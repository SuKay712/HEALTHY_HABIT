import axiosClient from "./axiosClient";
const saveAPI = {
    SavePost : async (userId, postId)=>{
        const url = `/api/user/post/save`
        return axiosClient.application.post(url,{
            postId : postId,
             userId : userId
        })
    }

}

export default saveAPI;