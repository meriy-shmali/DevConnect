import axios from "axios";
export const createpostreq=(formData)=>{
    return axios.post("",formData,{
    headers: { "Content-Type": "multipart/form-data" },
  });
};