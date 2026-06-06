import { useMutation } from "@tanstack/react-query";
import { addcomment, addreply, deletecomment, editcomment } from "@/api/Commentapi";
import { likecomment } from "@/api/Commentapi";
import { translateComment } from "@/api/Commentapi";
import { commentreaction } from "@/api/Commentapi";
//add comment
export const useaddcomment=()=>{
    return useMutation({
        mutationFn:addcomment
    });
}

//like comment
export const uselikecomment=()=>{
    return useMutation({
        mutationFn:likecomment
    });
}
//translate comment
export const usetranslatecomment=()=>{
   return  useMutation({
        mutationFn:translateComment
    })
}
//comment reaction
export const usecommentreaction=()=>{
    return useMutation({
        mutationFn:commentreaction
    })
} // add reply comment
export const useaddreply=()=>{
    return useMutation({
        mutationFn:addreply
    })
} //edit comment
export const useEditcomment = () => {
  return useMutation({
    mutationFn: editcomment
  });
};
//delete comment
export const useDeletecomment = () => {
  return useMutation({
    mutationFn: deletecomment
  });
};