import { z } from "zod";

const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export default LoginSchema;
