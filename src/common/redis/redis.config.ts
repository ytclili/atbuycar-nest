import { registerAs } from "@nestjs/config"

export default registerAs("redis", () => ({
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number.parseInt(process.env.REDIS_DB || "0", 10),
  keyPrefix: process.env.REDIS_KEY_PREFIX || "nestjs:",
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
  family: 4, // 4 (IPv4) or 6 (IPv6)
}))
