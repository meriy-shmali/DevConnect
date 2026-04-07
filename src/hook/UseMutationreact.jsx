import { useMutation } from "@tanstack/react-query";
import { reaction } from "@/api/Reactapi";

export const usereaction = () => {
    return useMutation({
        mutationFn: reaction,
    });
};