import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe( 
    {
      whitelist: true,
      forbidNonWhitelisted: true
    }
  ));
  const config = new DocumentBuilder()
    .setTitle('Ejercicio 9')
    .setDescription('API publica implementando seguridad')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('htttp://localhost:3000', 'Servidor Local')
    .addServer('http://api-ejercicio9.render.com','Servidor de produccion')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
