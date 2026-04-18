import api from "./Api";
export const improvepostreq=(text)=>{
   return api.post("/improve-post/",{text});
}
export const generatepostreq=(text)=>{
    return api.post("/generate-post/",{text});
}
export const summarizecoderewq=(data)=>{
   return  api.post("/explaine-code/",data);
}
export const addtagsreq=(text)=>{
   return  api.post("/suggest-tags/",{text});
}
export const categoriesreq=(text)=>{
  return  api.post("/classify-post/",{text});
}