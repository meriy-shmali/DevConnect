import api from "./Api";
export const improvepostreq=(text)=>{
   return api.post("",{text});
}
export const generatepostreq=(text)=>{
    return api.post("",{text});
}
export const summarizecoderewq=(code)=>{
   return  api.post("",{code});
}
export const addtagsreq=(text)=>{
   return  api.post("",{text});
}
export const categoriesreq=(text)=>{
  return  api.post("",{text});
}