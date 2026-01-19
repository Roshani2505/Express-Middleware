export const validateTodo = (req, res, next) => {
  const keys = Object.keys(req.body);

  if (keys.length !== 1 || !req.body.title) {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed"
    });
  }

  next();
};
