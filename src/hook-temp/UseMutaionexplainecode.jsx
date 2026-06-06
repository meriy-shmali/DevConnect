import { useMutation } from "@tanstack/react-query";
import { explainecode } from "@/api/Explainecodeapi";
export const useExplainecode=()=>{
    return useMutation({
        mutationFn:explainecode,
    })
}