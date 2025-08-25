import { Controller, Get, Post, Delete, Param } from "@nestjs/common"
import  { RedisService } from "./redis.service"

@Controller("cache")
export class CacheController {
  constructor(private readonly redisService: RedisService) {}

  @Post("set")
  async setCache(body: { key: string; value: any; ttl?: number }) {
    const { key, value, ttl } = body
    if (typeof value === "object") {
      await this.redisService.setJson(key, value, ttl)
    } else {
      await this.redisService.set(key, String(value), ttl)
    }
    return { success: true, message: "Cache set successfully" }
  }

  @Get("get/:key")
  async getCache(@Param("key") key: string) {
    const value = await this.redisService.get(key)
    if (value === null) {
      return { success: false, message: "Key not found", data: null }
    }
    
    // 尝试解析 JSON
    try {
      const jsonValue = JSON.parse(value)
      return { success: true, data: jsonValue }
    } catch {
      return { success: true, data: value }
    }
  }

  @Delete("delete/:key")
  async deleteCache(@Param("key") key: string) {
    const result = await this.redisService.del(key)
    return { 
      success: result > 0, 
      message: result > 0 ? "Key deleted successfully" : "Key not found" 
    }
  }

  @Get("keys/:pattern")
  async getKeys(@Param("pattern") pattern: string) {
    const keys = await this.redisService.keys(pattern)
    return { success: true, data: keys }
  }

  @Get("info")
  async getCacheInfo() {
    const client = this.redisService.getClient()
    return {
      success: true,
      data: {
        status: client.status,
        connected: client.status === "ready",
      },
    }
  }
}
