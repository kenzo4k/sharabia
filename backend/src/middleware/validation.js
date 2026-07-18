/**
 * Express middleware to validate request data against a Zod schema.
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against.
 * @param {'body' | 'query' | 'params'} source - The request object key to validate.
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed; // Replace with validated/parsed and typed values
    next();
  } catch (err) {
    next(err); // Forward the ZodError to the global error handler
  }
};
