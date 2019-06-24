/**
 * AppError errors are related to internal errors
 * of the app (Unlike APIBaseError).
 *
 * Note: These errors are not supposed to be reported to clients,
 * as they are internal. For reporting errors to clients see APIBaseError
 */
class AppError extends Error {
  constructor(code = 'UNKNOWN_ERROR', details = {}) {
    super('With code: ' + code);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      details: this.details,
    };
  }
}

module.exports = AppError;
