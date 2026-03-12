import { useMutation } from "@tanstack/react-query";
import { improvepostreq,
        generatepostreq,
     summarizecoderewq,categoriesreq,addtagsreq } from "@/api/AiAssistantapi";
     export const useimprovepost=()=>{
      return  useMutation({mutationFn:improvepostreq,
           
            onSuccess:()=>{},
            onError:()=>{},
        });
     };
     export const usegeneratepost=()=>{
        return useMutation({
            mutationFn:generatepostreq,
            onSuccess:()=>{},
            onError:()=>{},
        })
     };
     export const usesummarizecode=()=>{
       return  useMutation({
            mutationFn:summarizecoderewq,
              onMutate:()=>{},
            onSuccess:()=>{},
            onError:()=>{},
        })
     };
     export const useaddtags=()=>{
       return useMutation({
            mutationFn:addtagsreq,
            
            onSuccess:()=>{},
            onError:()=>{},
        })
     };
     export const usecategory=()=>{
       return useMutation({
            mutationFn:categoriesreq,
             
            onSuccess:()=>{},
            onError:()=>{},
        })
     };