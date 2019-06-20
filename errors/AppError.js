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
