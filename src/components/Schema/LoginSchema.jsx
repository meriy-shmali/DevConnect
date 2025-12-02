import{z}from 'zod';
const loginschema=z.object({

email:z.email({message:"the email address is invalid"}),
password:z.string().min(6,{message:"password must be at least 6 characters."}),
})
export default loginschema;