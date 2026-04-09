import api from "./Api";
export const showreact=(postId,type)=>{
    return api.get("", {
  params: { postId, type }})
   
}