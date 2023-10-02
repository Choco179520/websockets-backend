import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import * as bodyParser from "body-parser";
import * as express from "express";
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from "@nestjs/common";
import * as helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";

async function bootstrap() {
  const server = express();
  const logger = new Logger("Server");

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server)
  );
  app.setGlobalPrefix("api-backoffice-empresas");

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(
    helmet.hsts({
      maxAge: 31536000,
      preload: true,
      includeSubDomains: true,
    })
  );

  // app.use(CapturarPeticion);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");

  app.enableCors();

  /** Configuracion de swagger modulo */
  const configSwagger = new DocumentBuilder()
    .setTitle("API BACKOFFICE IMAKSMART")
    .setDescription(
      "El api es desarrollada por el equipo de DESARROLLO IMAKSMART"
    )
    .setVersion("1.0")
    .build();
  const documentApi = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("api-backoffice/documentacion", app, documentApi);

  // Registra el interceptor para encriptar las respuestas
  // app.useGlobalInterceptors(new EncryptInterceptor());

  await app.init();
  await app.listen(3000);
}
bootstrap();
