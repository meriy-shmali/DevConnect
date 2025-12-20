import { useMutation } from "@tanstack/react-query";
import { improvepostreq,
        generatepostreq,
     summarizecoderewq,categoriesreq,addtagsreq } from "@/api/AiAssistantapi";
     export const useimprovepost=()=>{
        useMutation({mutationFn:improvepostreq,
            onMutate:()=>{},
            onSuccess:()=>{},
            onError:()=>{},
        });
     };
     export const usegeneratepost=()=>{
        useMutation({
            mutationFn:generatepostreq,
              onMutate:()=>{},
            onSuccess:()=>{},
            onError:()=>{},
        })
     };
     export const usesummarizecode=()=>{
        useMutation({
            mutationFn:summarizecoderewq,
              onMutate:()=>{},
            onSuccess:()=>{},
            onError:()=>{},
        })
     };
     export const useaddtags=()=>{
        useMutation({
            mutationFn:addtagsreq,
              onMutate:()=>{},
            onSuccess:()=>{},
            onError:()=>{},
        })
     };
     export const usecategory=()=>{
        useMutation({
            mutationFn:categoriesreq,
              onMutate:()=>{},
            onSuccess:()=>{},
            onError:()=>{},
        })
     };