import api from "./Api";
export const smartsummaryapi=(data)=>{
    return api.post('/summarize_content/',data)
}