const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const timestamp = new Date().toISOString();
  
  // Error de validación de Joi (ya manejado en validation middleware)
  if (err.isJoi) {
    const validationErrors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      code: detail.type.toUpperCase()
    }));

    return res.status(422).json({
      error: 'VALIDATION_ERROR',
      message: 'Los datos proporcionados no son válidos',
      timestamp,
      validation_errors: validationErrors
    });
  }

  // Error de SQLite
  if (err.code && err.code.startsWith('SQLITE_')) {
    // Error de constraint único
    if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE')) {
      return res.status(409).json({
        error: 'DUPLICATE_ENTRY',
        message: 'Ya existe un registro con esos datos',
        timestamp,
        details: {
          sqlite_error: err.message
        }
      });
    }

    // Error de foreign key
    if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('FOREIGN KEY')) {
      return res.status(400).json({
        error: 'INVALID_REFERENCE',
        message: 'Referencia a un recurso que no existe',
        timestamp,
        details: {
          sqlite_error: err.message
        }
      });
    }

    // Otros errores de SQLite
    return res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Error interno de la base de datos',
      timestamp,
      details: process.env.NODE_ENV === 'development' ? {
        sqlite_error: err.message
      } : undefined
    });
  }

  // Errores personalizados de la aplicación
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'NOT_FOUND',
      message: err.message || 'Recurso no encontrado',
      timestamp
    });
  }

  if (err.name === 'BadRequestError') {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: err.message || 'Solicitud inválida',
      timestamp
    });
  }

  if (err.name === 'ConflictError') {
    return res.status(409).json({
      error: 'CONFLICT',
      message: err.message || 'Conflicto en la operación',
      timestamp
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'INVALID_JSON',
      message: 'Formato JSON inválido',
      timestamp
    });
  }

  // Error 404 - Ruta no encontrada
  if (err.status === 404) {
    return res.status(404).json({
      error: 'ROUTE_NOT_FOUND',
      message: 'Endpoint no encontrado',
      timestamp
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Error interno del servidor',
    timestamp,
    details: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  });
};

// Middleware para rutas no encontradas (404)
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'ROUTE_NOT_FOUND',
    message: `Endpoint ${req.method} ${req.path} no encontrado`,
    timestamp: new Date().toISOString()
  });
};

// Clases de error personalizadas
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  NotFoundError,
  BadRequestError,
  ConflictError
};