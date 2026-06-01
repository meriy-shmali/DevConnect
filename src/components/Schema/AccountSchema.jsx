import { z } from 'zod';

export const accountschema = (t) => 
  z.object({
    username: z.string().min(2,  { message: t('username_min' )}),
})
export default accountschema;