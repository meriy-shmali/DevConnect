import { useMutation } from "@tanstack/react-query";
import { Save } from "@/api/Save";
export const usesave=()=>{
return useMutation({
    mutationFn:Save,
})
}