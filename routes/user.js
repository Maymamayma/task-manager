import express from "express";
import * as userController from "../controllers/user.js";
import { validateSignup, validateLogin } from "../validators/user.validator.js";

export const router = express.Router();

router.post("/signup", validateSignup, userController.signup);
router.post("/login", validateLogin, userController.login);
