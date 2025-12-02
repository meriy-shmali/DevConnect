import{z}from 'zod';
const registerschema=z.object({
firstname:z.string().min(2,{message:"first name must be at least 2 characters."}),
lastname:z.string().min(2,{message:"last name must be at least 2 characters."}),
username:z.string().min(2,{message:"username must be at least 2 characters."}),
email:z.email({message:"the email address is invalid"}),
password:z.string().min(6,{message:"password must be at least 6 characters."}),
confirmpassword:z.string().min(6),
phone:z.string().min(10,{ message:"the phone number invalid"}),
age:z.string(),
/*gender:z.enum(["female,male"],{message:"please check the gender"})*/
}).refine((data)=>data.password===data.confirmpassword,{message:"the password does not match",path:["confirmpassword"]})
export default registerschema;