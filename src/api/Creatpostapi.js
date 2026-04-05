import api from "./Api";
export const createpostreq=(formData)=>{
    return api.post("",formData,{
    headers: { "Content-Type": "multipart/form-data" },
  });
};
//get post
export const getpost=()=>{
  return api.get("")
}