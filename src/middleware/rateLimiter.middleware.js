const requests = {};
const LIMIT = 15;
const TIME = 60 * 1000; // 1 minute

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;

  if (!requests[ip]) {
    requests[ip] = { count: 1, start: Date.now() };
    return next();
  }

  const currentTime = Date.now();

  if (currentTime - requests[ip].start > TIME) {
    requests[ip] = { count: 1, start: currentTime };
    return next();
  }

  if (requests[ip].count >= LIMIT) {
    return res.status(429).json({
      error: "Too many requests, please try again later"
    });
  }

  requests[ip].count++;
  next();
};
