/**
 * APIBaseError describes error information that should be sent to API Client.
 * It should not describe app's internal errors.
 * The word "Base" in its name means that this class is supposed to be extended
 * by API divisions (auth, api).
 *
 * Note that error handlers understand only errors that extends APIBaseError,
 * otherwise error handler, when it catches an error, it will respond with status 500.
 */
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
