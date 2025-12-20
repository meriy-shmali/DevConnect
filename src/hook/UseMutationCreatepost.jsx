import { useMutation } from "@tanstack/react-query";
import { createpostreq } from "@/api/Creatpostapi";
export const usecreatepost=()=>{
    return useMutation ({
        mutationFn:createpostreq});
};