type NotFoundErrorBody = { data: { message: string } };
type DbErrorBody = { status: number };

type ServiceErrorName = "NotFoundError" | "DbError";

export class ServiceError extends Error {
  readonly name: ServiceErrorName;
  constructor(name: ServiceErrorName, message: string) {
    super(message);
    this.name = name;
  }
}

export class NotFoundError extends ServiceError {
  readonly name = "NotFoundError";
  readonly body: NotFoundErrorBody;
  constructor(body: NotFoundErrorBody) {
    super("NotFoundError", "Entity not found");
    this.body = body;
  }
}

export class DbError extends ServiceError {
  readonly name = "DbError";
  readonly body: DbErrorBody;
  constructor(body: DbErrorBody) {
    super("DbError", "Database error");
    this.body = body;
  }
}
