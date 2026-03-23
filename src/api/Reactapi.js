import api from "./Api";
export const reaction=(data)=>{
    return api.post("",{
        type:data.type
    });
};