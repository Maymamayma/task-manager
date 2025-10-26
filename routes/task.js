import express from "express";
import * as taskController from "../controllers/tasks.js";
import { isAdmin, loggedMiddleware } from "../middlewares/auth.js";
import {
  validateTask,
  validateTaskParams,
} from "../validators/task.validator.js";

export const router = express.Router();

router.get("/", taskController.fetchTasks);

router.get("/:id", validateTaskParams, taskController.fetchById);

router.post(
  "/",
  loggedMiddleware,
  isAdmin,
  validateTask,
  taskController.addTask
);

router.patch(
  "/:id",
  validateTaskParams,
  validateTask,
  taskController.updateTask
);

router.delete("/:id", validateTaskParams, taskController.deleteTask);
