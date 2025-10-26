import { Task } from "../models/Tasks.js";
import {
  validateTask,
  validateTaskParams,
} from "../validators/task.validator.js";

export const fetchTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json({ success: true, message: "success", model: tasks });
  } catch (err) {
    next(err);
  }
};

export const fetchById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const err = new Error("Tâche non trouvée");
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: "success", model: task });
  } catch (err) {
    next(err);
  }
};

export const addTask = async (req, res, next) => {
  try {
    const task = new Task(req.body);
    await task.validate(); // 🧩 Validation Mongoose avant save()
    await task.save();

    res.status(201).json({
      success: true,
      message: "Objet créé !",
      model: task,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      const err = new Error("Tâche non trouvée");
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: "success", model: task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      const err = new Error("Tâche non trouvée");
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, message: "success" });
  } catch (err) {
    next(err);
  }
};
