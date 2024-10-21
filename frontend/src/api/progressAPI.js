import axiosClient from "./axiosClient";

const progressAPI = {
    getTaskByDate : async (userId, time)=>{
        const url = `/api/user/task/date?time=${time}&userId=${userId}`
        return axiosClient.application.get(url)
    },
    updateProgress: async(taskId, time, status)=>{
        const url=`/api/user/task/${taskId}`
        console.log(taskId, time, status, url)
        return axiosClient.application.put(url,{time : time, status : status})
    }
}

export default progressAPI;