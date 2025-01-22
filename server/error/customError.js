class BadRequestError extends Error {
  constructor(message, hint) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
    this.hint = hint;
  }
}
class Unauthorized extends Error {
  constructor(message, hint) {
    super(message);
    this.name = "Unauthorized";
    this.status = 401;
    this.hint = hint;
  }
}
class NotAcceptable extends Error {
  constructor(message, hint) {
    super(message);
    this.name = "NotAcceptable";
    this.status = 406;
    this.hint = hint;
  }
}
class PaymentRequired extends Error {
  constructor(message, hint) {
    super(message);
    this.name = "PaymentRequired";
    this.status = 402;
    this.hint = hint;
  }
}
class Forbidden extends Error {
  constructor(message, hint) {
    super(message);
    this.name = "Forbidden";
    this.status = 403;
    this.hint = hint;
  }
}
class NotFoundError extends Error {
  constructor(message, hint) {
    super(message);
    this.hint = hint;
    this.name = "NotFoundError";
    this.status = 404;
  }
}
class UnprocessableEntity extends Error {
  constructor(message, hint, trace_id) {
    super(message);

    this.name = "UnprocessableEntity";
    this.status = 422;
    this.hint = hint;
  }
}
class InternalServerError extends Error {
  constructor(message, hint) {
    super(message);

    this.name = "InternalServerError";
    this.status = 500;
    this.hint = hint;
  }
}

//hello

module.exports = {
  NotFoundError,
  BadRequestError,
  Unauthorized,
  Forbidden,
  PaymentRequired,
  UnprocessableEntity,
  InternalServerError,
  NotAcceptable,
};
