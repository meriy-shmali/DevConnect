import api from "./Api";
export const explainecode=(data)=>{
return api.post('/explain/line-by-line/',data)
}