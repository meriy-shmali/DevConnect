import { useQuery } from "@tanstack/react-query";
import { getpost } from "@/api/Creatpostapi";
export const Getposts=()=>{
return useQuery({
    queryKey:["post"],
    queryFn:getpost
})
}