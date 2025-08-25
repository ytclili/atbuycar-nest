import { Injectable, Logger, type OnModuleDestroy } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import Redis from "ioredis"

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private readonly redis: Redis

  constructor(private readonly configService: ConfigService) {
    const redisConfig = this.configService.get("redis")
    this.redis = new Redis(redisConfig)

    this.redis.on("connect", () => {
      this.logger.log("Redis connected successfully")
    })

    this.redis.on("error", (error) => {
      this.logger.error("Redis connection error:", error)
    })

    this.redis.on("ready", () => {
      this.logger.log("Redis is ready to receive commands")
    })
  }

  async onModuleDestroy() {
    await this.redis.quit()
    this.logger.log("Redis connection closed")
  }

  getClient(): Redis {
    return this.redis
  }

  // 基础操作方法
  async set(key: string, value: string | number | Buffer, ttl?: number): Promise<"OK"> {
    if (ttl) {
      return await this.redis.setex(key, ttl, value)
    }
    return await this.redis.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key)
  }

  async exists(key: string): Promise<number> {
    return await this.redis.exists(key)
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.redis.expire(key, seconds)
  }

  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key)
  }

  // Hash 操作
  async hset(key: string, field: string, value: string | number): Promise<number> {
    return await this.redis.hset(key, field, value)
  }

  async hget(key: string, field: string): Promise<string | null> {
    return await this.redis.hget(key, field)
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(key)
  }

  async hdel(key: string, field: string): Promise<number> {
    return await this.redis.hdel(key, field)
  }

  // List 操作
  async lpush(key: string, ...values: (string | number | Buffer)[]): Promise<number> {
    return await this.redis.lpush(key, ...values)
  }

  async rpush(key: string, ...values: (string | number | Buffer)[]): Promise<number> {
    return await this.redis.rpush(key, ...values)
  }

  async lpop(key: string): Promise<string | null> {
    return await this.redis.lpop(key)
  }

  async rpop(key: string): Promise<string | null> {
    return await this.redis.rpop(key)
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redis.lrange(key, start, stop)
  }

  // Set 操作
  async sadd(key: string, ...members: (string | number | Buffer)[]): Promise<number> {
    return await this.redis.sadd(key, ...members)
  }

  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key)
  }

  async srem(key: string, ...members: (string | number | Buffer)[]): Promise<number> {
    return await this.redis.srem(key, ...members)
  }

  // JSON 操作辅助方法
  async setJson(key: string, value: any, ttl?: number): Promise<"OK"> {
    const jsonString = JSON.stringify(value)
    return await this.set(key, jsonString, ttl)
  }

  async getJson<T = any>(key: string): Promise<T | null> {
    const value = await this.get(key)
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch (error) {
      this.logger.error(`Failed to parse JSON for key ${key}:`, error)
      return null
    }
  }

  // 批量操作
  async mset(keyValues: Record<string, string | number>): Promise<"OK"> {
    const args: (string | number)[] = []
    Object.entries(keyValues).forEach(([key, value]) => {
      args.push(key, value)
    })
    return await this.redis.mset(...args)
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    return await this.redis.mget(...keys)
  }

  // 模式匹配
  async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern)
  }

  // 清空数据库（谨慎使用）
  async flushdb(): Promise<"OK"> {
    return await this.redis.flushdb()
  }
}
