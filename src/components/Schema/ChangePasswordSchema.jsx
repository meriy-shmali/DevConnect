import{z}from 'zod';
const changepasswordschema=z.object({
username:z.string().min(2,{message:"username must be at least 2 characters."}),
email:z.email({message:"the email address is invalid"}),
password:z.string().min(8,{message:"password must be at least 8 characters."}),
confirmpassword:z.string().min(8,{message:'please confirm your new password.'}),
newpassword:z.string().min(8,{message:"new password must be at least 8 characters."}),
otp:z.string().length(6,{message:"OTP must be 6 digits."}),
}).refine((data)=>data.newpassword===data.confirmpassword,{message:"the password does not match",path:["confirmpassword"]})
export default changepasswordschema;