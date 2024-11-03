import axiosClient from "./axiosClient";

const progressAPI = {
    getTaskByDate : async (userId, time)=>{
        const url = `/api/user/task/date?time=${time}&userId=${userId}`
        return axiosClient.application.get(url)
    },
    updateProgress: async(taskId, time, status)=>{
        const url=`/api/user/task/${taskId}`
        return axiosClient.application.put(url,{time : time, status : status})
    },
    getAllProgressTaskInDate: async(userId, time)=>{
        const url=`/api/user/task/all-progress?userId=${userId}&time=${time}`
        return axiosClient.application.get(url)
    }
}

export default progressAPI;