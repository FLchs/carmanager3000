type ServiceErrorName = "NotFoundError" | "DbError" | "FileError";

export class ServiceError extends Error {
  readonly name: ServiceErrorName;
  constructor(name: ServiceErrorName, message: string) {
    super(message);
    this.name = name;
  }
}

export class NotFoundError extends ServiceError {
  readonly name = "NotFoundError";
  constructor(message?: string) {
    super("NotFoundError", message ?? "Entity not found");
  }
}

export class DbError extends ServiceError {
  readonly name = "DbError";
  readonly originalError?: Error;
  constructor(originalError?: unknown, message?: string) {
    super("DbError", message ?? "Database error");
    if (originalError instanceof Error) {
      this.originalError = originalError;
    }
  }
}

export class FileError extends ServiceError {
  readonly name = "FileError";
  readonly originalError?: Error;
  constructor(originalError?: unknown, message?: string) {
    super("FileError", message ?? "File error");
    if (originalError instanceof Error) {
      this.originalError = originalError;
    }
  }
}
