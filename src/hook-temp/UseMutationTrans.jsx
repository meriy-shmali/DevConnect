import { useMutation } from "@tanstack/react-query"
import { translate } from "@/api/Translate"
export const useTranslate = () => {
    return useMutation({
        mutationFn:translate,
    });
  
}

