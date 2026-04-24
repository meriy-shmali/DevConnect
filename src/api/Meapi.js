import api from "./Api";
export const MeApi=()=>{
    return api.get("/me/")
}