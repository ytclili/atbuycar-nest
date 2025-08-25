import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('My API Docs')
    .setDescription('API documentation for my project')
    .setVersion('1.0')
    .addBearerAuth() // 如果你有 JWT 认证
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 刷新页面不会丢失 token
    },
  });
}
