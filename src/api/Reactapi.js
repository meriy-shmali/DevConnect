import api from "./Api";
export const reaction=({ postId, reaction_type })=>{
    return api.post(`/posts/${postId}/react/`, {
    reaction_type
  });
};