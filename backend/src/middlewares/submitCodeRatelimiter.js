import redisClient from "../config/redisDB.js";

const submitCodeRateLimiter = async (req, res, next) => {
  const userId = req.user._id; 
  const redisKey = `submit_cooldown:${userId}`;

  try {
    // Check if user has a recent submission
    const exists = await redisClient.exists(redisKey);
    
    if (exists) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.'
      });
    }

    // Set cooldown period
    await redisClient.set(redisKey, 'cooldown_active', {
      EX: 20, // Expire after 20 seconds
      NX: true // Only set if not exists
    });

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default submitCodeRateLimiter;