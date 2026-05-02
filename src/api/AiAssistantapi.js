import api from "./Api";
export const improvepostreq=(text)=>{
   return api.post("/improve-post/",{ content: text });
}
export const generatepostreq=(text)=>{
    return api.post("/generate-post/",{ content: text });
}
export const summarizecoderewq=(data)=>{
   return  api.post("/explain-code/",{
     code_content: data.code,
     language:data.appLanguage // التأكد من المسمى هنا
   });
}
export const addtagsreq=(text)=>{
   return  api.post("/suggest-tags/",{ content: text });
}
export const categoriesreq=(data)=>{
  return  api.post("/classify-post/",{
   content:data.content,
   language:data.language
  });
}