const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[property];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        code: detail.type.toUpperCase()
      }));

      return res.status(422).json({
        error: 'VALIDATION_ERROR',
        message: 'Los datos proporcionados no son válidos',
        timestamp: new Date().toISOString(),
        validation_errors: validationErrors
      });
    }

    // Reemplazar los datos originales con los datos validados y transformados
    req[property] = value;
    next();
  };
};

const validateBody = (schema) => validateRequest(schema, 'body');
const validateParams = (schema) => validateRequest(schema, 'params');
const validateQuery = (schema) => validateRequest(schema, 'query');

module.exports = {
  validateRequest,
  validateBody,
  validateParams,
  validateQuery
};