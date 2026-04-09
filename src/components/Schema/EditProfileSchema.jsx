import { z } from 'zod';

export const editProfileSchema = z.object({
  specialization: z.string().max(80, { message: "specialization must not exceed 80 characters." }),
  bio: z.string().max(100, { message: "Bio must not exceed 100 characters." }).optional(),
  
});
