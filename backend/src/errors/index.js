/**
 * Domain-specific errors with HTTP status semantics.
 * Keeps HTTP concerns out of the service layer while giving
 * the route layer enough info to respond correctly.
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name        = this.constructor.name;
    this.statusCode  = statusCode;
  }
}

class NotFoundError extends AppError {
  constructor(message) { super(message, 404); }
}

class ValidationError extends AppError {
  constructor(message) { super(message, 400); }
}

class ConflictError extends AppError {
  constructor(message) { super(message, 409); }
}

class InvalidPickupCodeError extends AppError {
  constructor() { super('Invalid pickup code. Please check and try again.', 400); }
}

class NoLockerAvailableError extends AppError {
  constructor(packageSize) {
    super(`No suitable locker available for package size "${packageSize}". All compatible lockers are occupied.`, 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  InvalidPickupCodeError,
  NoLockerAvailableError,
};
