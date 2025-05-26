import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(3, "Fullname must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
})  
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // This ensures the error is attached to confirmPassword
})
