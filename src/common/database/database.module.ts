import { Module, Global } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"
import databaseConfig from "./database.config"

@Global() // 设置为全局模块
@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return ({
            type: "mysql",
            host: configService.get("database.host"),
            port: configService.get("database.port"),
            username: configService.get("database.username"),
            password: configService.get("database.password"),
            database: configService.get("database.database"),
            entities: configService.get("database.entities"),
            synchronize: configService.get("database.synchronize"),
            logging: configService.get("database.logging"),
            timezone: configService.get("database.timezone"),
            charset: configService.get("database.charset"),
            extra: configService.get("database.extra"),
          })
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule], // 导出 TypeOrmModule 供其他模块使用
})
export class DatabaseModule {}
