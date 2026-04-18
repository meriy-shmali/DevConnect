import api from "./Api";
export const Loginreq=(data)=>{
    return api.post("/login/",data);
};