import { useQuery } from "@tanstack/react-query";
import { getsuggestion } from "@/api/Sugesstion";
export const UseSugesstion=()=>{
return useQuery({
    queryKey:["suggestion"],
    queryFn: async () => {
      const res = await getsuggestion();
      return res.data;
}})
}