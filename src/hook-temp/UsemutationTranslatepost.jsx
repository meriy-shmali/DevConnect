import { useMutation } from "@tanstack/react-query";
import { posttranslate } from "@/api/ContentTranslate";

export const useTranslatepost=()=>{
    return useMutation({
        mutationFn:posttranslate,
    })
}