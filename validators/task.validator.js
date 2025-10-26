import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Le titre est requis" })
    .max(100, { message: "Le titre ne peut pas dépasser 100 caractères" }),
  description: z
    .string()
    .min(1, { message: "La description est requise" })
    .max(500, {
      message: "La description ne peut pas dépasser 500 caractères",
    }),
  status: z
    .enum(["todo", "in-progress", "done"], {
      errorMap: () => ({
        message: "Le statut doit être 'todo', 'in-progress' ou 'done'",
      }),
    })
    .default("todo"),
  dueDate: z
    .string()
    .datetime({ message: "La date d'échéance doit être une date valide" })
    .optional(),
});

export const validateTask = (req, res, next) => {
  try {
    taskSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors.map((e) => e.message),
    });
  }
};

export const validateTaskId = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "ID de tâche invalide" }),
});

export const validateTaskParams = (req, res, next) => {
  try {
    validateTaskId.parse({ id: req.params.id });
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors.map((e) => e.message),
    });
  }
};
