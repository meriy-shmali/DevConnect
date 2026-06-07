import { z } from 'zod';

const registerschema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "The email address is invalid." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirm_password: z.string().min(6),
  phone_number: z.string().min(10, { message: "The phone number is invalid." }),
  age: z.string(),
  gender: z.enum(["male", "female"], { message: "Please select a gender." }),
})
.refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"], // ✅ صحّحنا هاد كمان
});

export default registerschema;