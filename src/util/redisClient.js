import dayjs from 'dayjs'
import redis from 'redis'
import { logger } from './logger.js'
import { promisify } from 'util'

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})

redisClient.on('connect', () => {
  console.log(`[RedisConnect] Successfully connected cache server`)
})

redisClient.on('error', err => {
  logger.error(`[RedisError] ${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss Z')} ${err}`)
})

/**
 * Get/Set
 *  K: req.session.id
 *  V: JSON.stringify({ userObjectId, isMember, accessCount, accessToken })
 */
export default {
  getClient: redisClient,
  getAsync: promisify(redisClient.get).bind(redisClient),
  setAsync: promisify(redisClient.set).bind(redisClient),
  /**
   * setWithTtl: 세션을 1시간동안 유지하고 재요청시 1시간으로 갱신.
   * 사용방법: setWithTtl(key, time(s), value)
   */
  // setWithTtl: promisify(redisClient.setex).bind(redisClient),
  flushAll: promisify(redisClient.flushall).bind(redisClient),
  keys: promisify(redisClient.keys).bind(redisClient),
  lpush: promisify(redisClient.lpush).bind(redisClient),
  lpop: promisify(redisClient.lpop).bind(redisClient),
  lrange: promisify(redisClient.lrange).bind(redisClient),
}
