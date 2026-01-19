import express from "express";
import fs from "fs";
import path from "path";
import { rateLimiter } from "../middleware/rateLimiter.middleware.js";
import { validateTodo } from "../middleware/validateTodo.middleware.js";

const router = express.Router();
const dbPath = path.resolve("src/db.json");

// helper functions
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// CREATE
router.post("/add", validateTodo, (req, res) => {
  const db = readDB();

  const newTodo = {
    id: Date.now().toString(),
    title: req.body.title,
    completed: false
  };

  db.todos.push(newTodo);
  writeDB(db);

  res.status(201).json({
    message: "Todo added successfully",
    todo: newTodo
  });
});

// READ ALL (RATE LIMITED)
router.get("/", rateLimiter, (req, res) => {
  const db = readDB();
  res.json(db.todos);
});

// READ ONE
router.get("/:todoId", (req, res) => {
  const db = readDB();
  const todo = db.todos.find(t => t.id === req.params.todoId);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

// UPDATE
router.put("/update/:todoId", (req, res) => {
  const db = readDB();
  const index = db.todos.findIndex(t => t.id === req.params.todoId);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  db.todos[index] = { ...db.todos[index], ...req.body };
  writeDB(db);

  res.json({
    message: "Todo updated successfully",
    todo: db.todos[index]
  });
});

// DELETE
router.delete("/delete/:todoId", (req, res) => {
  const db = readDB();
  const filtered = db.todos.filter(t => t.id !== req.params.todoId);

  if (filtered.length === db.todos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }

  db.todos = filtered;
  writeDB(db);

  res.json({ message: "Todo deleted successfully" });
});

export default router;
