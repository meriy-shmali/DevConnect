import api from "./Api";
export const bestanswer=(data)=>{
    return api.post('/best-answer/',data)
}