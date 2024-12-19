import express from "express";
import { z } from "zod";

const SignUpSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string().min(6),
    email: z.string().email(),
  }),
});

export default SignUpSchema;
