import api from "./Api";
//get comment from back
export const getcomment=(postId,sort)=>{
    return api.get("",{
        params:{
            postId,
            sort
        }
    }
    )
}
// add comment 
export const addcomment=(data)=>{
    return api.post("",data)
}
// reply comment
export const replycomment=(data)=>{
    return api.post("",data)
}
//like comment
export const likecomment=(commentId)=>{
    return api.post(`/comments/${commentId}`)
}
//translate comment
export const translateComment=(data)=>{
    return api.post("",data);
}
//comment reaction
export const commentreaction=(data)=>{
    return api.post("",data)
}
//comment get replies
export const commentgetreplies=(commentId)=>{
return api.get("",{
    params:{commentId }
})
}
//add reply
export const addreply=(data)=>{
    return api.post("",data)
}
//edit comment
export const editcomment=({commentId,text})=>{
    return api.put(`/comments/${commentId}`, { text })
}
//delete comment
export const deletecomment=(commentId)=>{
    return api.delete(`/comments/${commentId}`)
}