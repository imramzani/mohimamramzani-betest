const Redis = require('ioredis')
const configs = require('./configs')

const redis = new Redis({
  port: configs.redis.REDIS_PORT, // Redis port
  host: configs.redis.REDIS_HOST, // Redis host
  password: configs.redis.REDIS_PASS
});

module.exports = redis