import { HttpExceptionFilter } from './filters/http.filter';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationException } from './filters/validation.exception';
import { ValidationFilter } from './filters/validation.filter';
import webpush from './configs/webpush';
// ...


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // SWAGGER
  // const config = new DocumentBuilder()
  //   .setTitle('Top APi')
  //   .setDescription('The top rating API description')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);


  // FILTERS
  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(),
    //   new ValidationException(),
  )

  // VALIDATION PIPE
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: true,
    exceptionFactory: (errors: ValidationError[]) => {

      const messages = errors.map(
        error => `${error.property} имеет неверное значение ${error.value}, ${typeof (error.constraints) === "object" ? Object.values(error.constraints).join(', ') : ""} `
      );

      return new ValidationException(messages);
    }
  }));

  webpush();

  // API PREFIX
  app.setGlobalPrefix('api')

  // CORS
  app.enableCors();


  // ADMIN PANEL
  // await setupAdminPanel(app);


  // APP LISTEN START
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
