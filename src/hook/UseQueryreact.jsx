import { showreact } from "@/api/showreact"
import { useQuery } from "@tanstack/react-query"


export const usequeryreaction=(postId,type)=>{
   const {data}= useQuery({
        queryKey:["reaction",postId,type],
        queryFn:()=>showreact(postId,type),
        //لمنع الطلب في حال لم يكن هناك نوع يعني ما ضغطنا
        enabled:!!postId&&!!type
    });
    return { data: data || [] };

}