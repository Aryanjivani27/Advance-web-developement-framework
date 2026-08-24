import { Router } from "express";

const router = Router();

// ── In-Memory Store ──────────────────────────────────────────────
let tasks = [];
let nextId = 1;

// ── Helper ───────────────────────────────────────────────────────
function findTask(id) {
  return tasks.find((t) => t.id === id);
}

// ── GET /api/tasks — List all tasks ──────────────────────────────
router.get("/", (_req, res) => {
  res.json(tasks);
});

// ── GET /api/tasks/:id — Get a single task ───────────────────────
router.get("/:id", (req, res) => {
  const task = findTask(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(task);
});

// ── POST /api/tasks — Create a new task ──────────────────────────
router.post("/", (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "\"title\" is required and must be a non-empty string" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description: description?.trim() ?? "",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// ── PUT /api/tasks/:id — Full update of a task ───────────────────
router.put("/:id", (req, res) => {
  const task = findTask(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, description, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "\"title\" must be a non-empty string" });
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = typeof description === "string" ? description.trim() : "";
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "\"completed\" must be a boolean" });
    }
    task.completed = completed;
  }

  task.updatedAt = new Date().toISOString();
  res.json(task);
});

// ── DELETE /api/tasks/:id — Remove a task ────────────────────────
router.delete("/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const [deleted] = tasks.splice(index, 1);
  res.json({ message: "Task deleted", task: deleted });
});

export default router;
