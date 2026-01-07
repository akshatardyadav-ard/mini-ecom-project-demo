const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Backend API",
      version: "1.0.0",
      description:
        "Swagger documentation for Node.js E-Commerce Backend with JWT authentication",
    },
    servers: [
      {
        url: process.env.MYSQL_URL || "http://localhost:3000/api",
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // 🔥 ABSOLUTE PATH (NO MORE ISSUES)
  apis: [path.join(__dirname, "/routes/**/*.js")],
};

module.exports = swaggerJSDoc(options);
