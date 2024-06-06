import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("API description")
    .setVersion("1.0")
    .addSecurity("basic", {
      type: "http",
      scheme: "basic",
    })
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
  });
  SwaggerModule.setup("api", app, document);
  await app.listen(3333);
}
bootstrap();
