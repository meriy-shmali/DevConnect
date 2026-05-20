import { z } from 'zod';

export const changepasswordschema = (t) => 
  z.object({
    username: z.string().min(2, { message: t('validation.username_min') }),
    email: z.string().email({ message: t('validation.email_invalid') }),
    password: z.string().min(8, { message: t('validation.password_min') }),
    confirmpassword: z.string().min(8, { message: t('validation.confirm_password_min') }),
    newpassword: z.string().min(8, { message: t('validation.new_password_min') }),
    otp: z.string().length(6, { message: t('validation.otp_length') }),
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: t('validation.passwords_dont_match'),
    path: ["confirmpassword"],
  });
  export default changepasswordschema