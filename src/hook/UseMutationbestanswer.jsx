import { useMutation } from "@tanstack/react-query";
import { bestanswer } from "@/api/Bestanswer";
export const usebestanswer=()=>{
    return useMutation({
        mutationFn:bestanswer
    })
}