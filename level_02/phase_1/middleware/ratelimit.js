import { redis } from "../index.js";

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    // 1. Increment request count for this IP (starts at 1)
    const requests = await redis.incr(key);

    // 2. On first request, set expiry window (60 seconds)
    if (requests === 1) {
      await redis.expire(key, 60);
    }

    // 3. Block if exceeds 5 requests within the 60-second window
    if (requests > 5) {
      return res.status(429).json({ message: "Too Many Requests. Try again later." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default rateLimiter;
 