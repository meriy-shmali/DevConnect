import api from "./Api";
export const reaction=(data)=>{
    return api.post("",data);
};