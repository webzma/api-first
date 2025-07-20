require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const database = require('../config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Importar rutas
const healthRoutes = require('./routes/health');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Demasiadas peticiones, intenta de nuevo más tarde',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(limiter);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentación Swagger
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '../api-spec.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCssUrl: '/custom.css',
    customSiteTitle: "Task Management API Documentation",
    customfavIcon: '/favicon.ico'
  }));
} catch (error) {
  console.warn('No se pudo cargar la documentación Swagger:', error.message);
}

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    documentation: '/docs',
    health: `/api/${API_VERSION}/health`,
    endpoints: {
      tasks: `/api/${API_VERSION}/tasks`,
      categories: `/api/${API_VERSION}/categories`
    }
  });
});

// Rutas de la API
app.use(`/api/${API_VERSION}/health`, healthRoutes);
app.use(`/api/${API_VERSION}/tasks`, taskRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);

// Middleware de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await database.connect();
    console.log('✅ Database connected successfully');

    // Iniciar el servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/${API_VERSION}/health`);
      console.log(`📋 Tasks API: http://localhost:${PORT}/api/${API_VERSION}/tasks`);
      console.log(`🏷️  Categories API: http://localhost:${PORT}/api/${API_VERSION}/categories`);
    });

    // Manejo graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await database.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(async () => {
        await database.close();
        process.exit(0);
      });
    });

    return server;

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Iniciar el servidor solo si no estamos en modo test
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };