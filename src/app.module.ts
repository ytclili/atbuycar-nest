import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from "./common/database/database.module"
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './common/database/database.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局模块
      envFilePath: [`.env.${process.env.NODE_ENV || "development"}`, ".env"],
      load: [databaseConfig],
    }),
    DatabaseModule, // 导入数据库模块
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
