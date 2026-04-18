import api from "./Api";
export const createpostreq=(formData)=>{
    return api.post("/posts/create/",formData,{
    headers: { "Content-Type": "multipart/form-data" },
  });
};
