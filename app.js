import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Task } from "./models/Tasks.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import { router as taskRouter } from "./routes/task.js";
import { router as userRouter } from "./routes/user.js";

mongoose
  .connect("mongodb+srv://oumayma:oumaymaoumayma@cluster0.spb7osl.mongodb.net/")
  .then(() => console.log("success"))
  .catch(() => console.log("echouee"));

export const app = express();
/*app.use((req, res) => {
    res.json({ message: "Your request is received"});
})*/

/*app.use((req, res, next) => {
  console.log("Requête reçue !");
  next()
});
app.use((req, res, next) => {
  res.status(201);
  next()
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next()
});
app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !")
});*/

app.use(cors());

app.use(express.json());

app.use("/api/tasks", taskRouter);
app.use("/api/auth", userRouter);
app.use(errorHandler); 