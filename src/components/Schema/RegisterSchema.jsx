import{z}from 'zod';
const registerschema=z.object({
first_name:z.string().min(2,{message:"first name must be at least 2 characters."}),
 last_name:z.string().min(2,{message:"last name must be at least 2 characters."}),
username:z.string().min(2,{message:"username must be at least 2 characters."}),
email:z.email({message:"the email address is invalid"}),
password:z.string().min(6,{message:"password must be at least 6 characters."}),
 confirm_password:z.string().min(6),
 phone_number:z.string().min(10,{ message:"the phone number invalid"}),
age: z.string().refine((val) => !isNaN(Number(val)), { message: "Age must be a number" }),
gender:z.enum(["female,male"],{message:"please check the gender"})
}).refine((data)=>data.password===data.confirm_password,{message:"the password does not match",path:["confirm_password"]})
export default registerschema;