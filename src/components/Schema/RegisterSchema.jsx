import{z}from 'zod';
const registerschema=z.object({
first_name:z.string().min(2,{message:"first name must be at least 2 characters."}),
 last_name:z.string().min(2,{message:"last name must be at least 2 characters."}),
username:z.string().min(2,{message:"username must start with letter or _ only, no spaces or special characters, length between 3 and 20"}),
email:z.email({message:"the email address is invalid"}),
password:z.string().min(8,{message:"Password must be at least 8 characters."}),
 confirm_password:z.string().min(8),
 phone_number:z.string().min(10,{ message:"the phone number invalid"}),
age: z.string().refine((val) => !isNaN(Number(val)), { message: "Age must be a number" }),
gender:z.enum(["female","male"],{message:"please check the gender"})
}).refine((data)=>data.password===data.confirm_password,{message:"Password and Confirm Password do not match.",path:["confirm_password"]})
export default registerschema;