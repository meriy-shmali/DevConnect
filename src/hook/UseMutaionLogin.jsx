import { useMutation } from "@tanstack/react-query";
import { Loginreq } from "@/api/Loginapi";
export const uselogin=()=>{
    return useMutation({
        mutationFn:Loginreq,
    })
}