import { z } from 'zod';

export const registerModalValidator = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Name must be at least 4 characters long' })
      .max(16, { message: 'Name must be at most 16 characters long' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: 'Name must only contain alphanumeric characters',
      }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 character longs' })
      .max(32, { message: 'Password must be at most 32 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 character longs' })
      .max(32, { message: 'Password must be at most 32 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/),
    email: z.string().email({ message: 'Invalid email' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginModalValidator = z.object({
  password: z
    .string()
    .min(4, { message: 'Password must be at least 9 character longs' })
    .max(32, { message: 'Password must be at most 32 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/),
  email: z.string().email({ message: 'Invalid email' }),
});

export type loginModalValidatorType = z.infer<typeof loginModalValidator>;
export type registerModalValidatorType = z.infer<typeof registerModalValidator>;
