import { useMutation } from "@tanstack/react-query";
import { smartsummaryapi } from "@/api/smartsummaryai";
export const usesmartsummary=()=>{
    return useMutation({
        mutationFn:smartsummaryapi,
    })
}