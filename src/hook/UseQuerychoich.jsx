import { useQuery } from "@tanstack/react-query";
import{getchoichreq} from "@/api/Getchoichapi";
export const usechoich=(category)=>{
    return useQuery({
        queryKey:["posts",category],
         queryFn: async () => {
      const res = await getchoichreq(category);
      return res.results; 
    }
    })
}
