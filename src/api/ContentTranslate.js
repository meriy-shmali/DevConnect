import api from "./Api";
export const posttranslate=(data)=>{
    return api.post("/translate/",data)
}