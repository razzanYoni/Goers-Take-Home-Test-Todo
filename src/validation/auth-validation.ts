import { z } from "zod";

const signupSchema = z.object({
	username: z.string().min(1).max(255),
	password: z.string().min(1).max(255),
});

const loginSchema = z.object({
	username: z.string().min(1).max(255),
	password: z.string().min(1).max(255),
});

export {
	signupSchema,
	loginSchema,
}