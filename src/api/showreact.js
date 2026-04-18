import api from "./Api";
export const showreact=(postId,reaction_type)=>{
    return api.get(`/posts/${postId}/reactions/`, {
    params: { reaction_type }
  })
   
}