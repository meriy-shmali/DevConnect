import api from "./Api";
export const registerreq=(data)=>{
   return api.post("/register/",data);
}