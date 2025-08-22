import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

// Swagger definition
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'Authentication API with Express, TypeScript and MongoDB',
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
      contact: {
        name: 'API Support',
        url: 'http://www.example.com/support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts', './src/swagger-docs/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: express.Application): void {
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));
}
