import api from "./Api";
export const translate=(data)=>{
    return api.post("",data);
}