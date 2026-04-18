import api from "./Api";
export const getchoichreq=async(category)=>{
   const res=await api.get("/feed/",{
        params:{
       type: category === "all" ? undefined : category
        }
    });
    return res.data;
}