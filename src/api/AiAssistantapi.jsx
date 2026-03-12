import axios from "axios";
export const improvepostreq=(text)=>{
   return axios.post("",{text});
}
export const generatepostreq=(text)=>{
    return axios.post("",{text});
}
export const summarizecoderewq=(code)=>{
   return  axios.post("",{code});
}
export const addtagsreq=(text)=>{
   return  axios.post("",{text});
}
export const categoriesreq=(text)=>{
  return  axios.post("",{text});
}