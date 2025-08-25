import { registerAs } from "@nestjs/config"


export default registerAs("database", () => ({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "nestjs_db",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: process.env.NODE_ENV !== "production", // 生产环境建议设为 false
  logging: process.env.NODE_ENV === "development",
  timezone: "+08:00", // 设置时区
  charset: "utf8mb4",
  extra: {
    connectionLimit: 10,
  },
}))
