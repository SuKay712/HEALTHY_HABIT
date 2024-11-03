import axiosClient from "./axiosClient";

const AccountAPI = {
    updateAvatar : async (formData)=>{
        const url = `/api/user/profile/avatar`
        return axiosClient.formData.put(url, formData)
    },
    updateBackground : async (formData)=>{
      const url = `/api/user/profile/bgimage`
      return axiosClient.formData.put(url, formData)
  },
  
}

export default AccountAPI;