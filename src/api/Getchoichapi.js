import api from "./Api";
export const getchoichreq=async(category)=>{
   const res=await api.get("",{
        params:{
            category:category
        }
    });
    return res.data;
}