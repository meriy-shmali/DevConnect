import api from "./Api";
//get comment from back
export const getcomment=(postId,sort)=>{
    return api.get(`/posts/${postId}/comments/`,{
        params:{
            ordering: sort === "latest" ? "desc" : "asc"
        }
    }
    )
}
// add comment 
export const addcomment=({ postId, content })=>{
    return api.post(`/posts/${postId}/comments/create/`, {
    content
  })
}


//like comment
export const likecomment=(commentId)=>{
    return api.post(`/comments/${commentId}`)
}
//translate comment
export const translateComment=({ commentId })=>{
    return api.post("/translate-comment/",{ comment_id: commentId });
}
//comment reaction
export const commentreaction=({ commentId, reaction_type })=>{
    return api.post(`/comments/${commentId}/react/`, {
    reaction_type
  })
}
//comment get replies
export const commentgetreplies=(commentId)=>{
return api.get(`/comments/${commentId}/replies/`)
}
//add reply
export const addreply=({ postId, content, parent })=>{
    return api.post(`/posts/${postId}/comments/create/`, {
    content,
    parent
  })
}
//edit comment
export const editcomment=({commentId,content})=>{
    return api.put(`/comments/${commentId}/`, { content })
}
//delete comment
export const deletecomment=(commentId)=>{
    return api.delete(`/comments/${commentId}/`)
}