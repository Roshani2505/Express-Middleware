export const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
