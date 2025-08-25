import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


   // 启用 swagger
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
