import { useMutation } from "@tanstack/react-query";
import { registerreq } from "@/api/Registerapi";
export const useregister=()=>{
 return   useMutation({
    mutationFn:registerreq
 })
}