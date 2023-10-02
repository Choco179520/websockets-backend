"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const bodyParser = require("body-parser");
const express = require("express");
const common_1 = require("@nestjs/common");
const helmet = require("helmet");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
async function bootstrap() {
    const server = express();
    const logger = new common_1.Logger("Server");
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.setGlobalPrefix("api-backoffice-empresas");
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(helmet.hsts({
        maxAge: 31536000,
        preload: true,
        includeSubDomains: true,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });
    app.setBaseViewsDir((0, path_1.join)(__dirname, "..", "views"));
    app.setViewEngine("ejs");
    app.enableCors();
    const configSwagger = new swagger_1.DocumentBuilder()
        .setTitle("API BACKOFFICE IMAKSMART")
        .setDescription("El api es desarrollada por el equipo de DESARROLLO IMAKSMART")
        .setVersion("1.0")
        .build();
    const documentApi = swagger_1.SwaggerModule.createDocument(app, configSwagger);
    swagger_1.SwaggerModule.setup("api-backoffice/documentacion", app, documentApi);
    await app.init();
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map