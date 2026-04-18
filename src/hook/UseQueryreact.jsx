import { showreact } from "@/api/showreact"
import { useQuery } from "@tanstack/react-query"


export const usequeryreaction=(postId,reaction_type)=>{
   const {data}= useQuery({
        queryKey:["reaction",postId,reaction_type],
        queryFn:()=>showreact(postId,reaction_type),
        //لمنع الطلب في حال لم يكن هناك نوع يعني ما ضغطنا
        enabled:!!postId&&!!reaction_type
    });
    return data?.data || [];

}