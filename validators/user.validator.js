import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  role: z
    .enum(["user", "admin"], {
      errorMap: () => ({ message: "Le rôle doit être 'user' ou 'admin'" }),
    })
    .optional()
    .default("user"),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors.map((e) => e.message),
    });
  }
};

export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors.map((e) => e.message),
    });
  }
};
