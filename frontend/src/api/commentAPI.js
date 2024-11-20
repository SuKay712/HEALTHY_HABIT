import axiosClient from "./axiosClient";

const CommentAPI = {
    CreateComment : async (newFormData)=>{
        const url = `/api/user/comment`
        return axiosClient.formData.post(url,newFormData)
    },
}

export default CommentAPI;