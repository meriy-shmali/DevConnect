import api from "./Api";
//for follow
export const follow=(userId)=>{
    return api.post(`/follow/${userId}/`);
}
// for unfollow
export const unfollow=(userId)=>{
    return api.delete(`/unfollow/${userId}/`)
}