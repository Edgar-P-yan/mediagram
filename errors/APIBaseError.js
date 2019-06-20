class APIBaseError extends Error {
  constructor(code = 'INTERNAL_SERVER_ERROR', status = 500, details = {}) {
    super();
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}

module.exports = APIBaseError;
