class MockError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.code = statusCode;
  }
}

module.exports = MockError;
