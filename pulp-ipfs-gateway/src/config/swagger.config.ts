import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AUTH_OPTIONS, TOKEN_NAME } from '@auth';

const title = 'Nestjs Framework';
const description = 'This is a basic Nest boilerplate project built on the more powerful node.js framework. The main purpose of this project is to dynamically handle roles and permissions assigned to the user.';
const version = '1.0';

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const configSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(AUTH_OPTIONS, TOKEN_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);
};
