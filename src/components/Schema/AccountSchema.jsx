import{z}from 'zod';
const accountschema=z.object({
username:z.string().min(2,{message:"username must be at least 2 characters."})
})
export default accountschema;