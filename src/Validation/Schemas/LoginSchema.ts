// import { z } from 'zod';

// export const loginSchema = z.object({
//   email: z.string().email({ message: 'Invalid email address' }),
//   password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
// });

// export type LoginSchema = z.infer<typeof loginSchema>;



import {z} from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(8, {message: "Password must be of 8 character(s)"})
})