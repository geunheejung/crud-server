const redis = require("redis");

const redisClient = redis.createClient({ legacyMode: true });

module.exports = redisClient;
