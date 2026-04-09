import { useQuery } from "@tanstack/react-query";
import { getsuggestion } from "@/api/Sugesstion";
export const Sugesstion=()=>{
return useQuery({
    queryKey:["suggestion"],
    queryFn:getsuggestion
})
}