import api from "./Api";
export const Save=({postId})=>{
    return api.post(`/posts/${postId}/save/`)
}