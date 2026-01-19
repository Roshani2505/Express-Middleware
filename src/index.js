import express from "express";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import todoRouter from "./routes/todos.routes.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use("/todos", todoRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
