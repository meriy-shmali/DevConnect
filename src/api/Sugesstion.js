import api from "./Api"
export const getsuggestion=()=>{
    return api.get("/suggested-users/")
}