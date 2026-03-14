import axios from "axios";
export const getchoichreq=async(category)=>{
   const res=await axios.get("",{
        params:{
            category:category
        }
    });
    return res.data;
}