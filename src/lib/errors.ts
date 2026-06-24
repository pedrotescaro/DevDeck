export class AppError extends Error {
  constructor(
    public code: string, // 'POST_NOT_FOUND', 'RATE_LIMITED', etc.
    public message: string,
    public statusCode: number, // 404, 429, 403, 400
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(code = 'NOT_FOUND', message = 'Recurso não encontrado', details?: unknown) {
    super(code, message, 404, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(code = 'FORBIDDEN', message = 'Não autorizado', details?: unknown) {
    super(code, message, 403, details);
  }
}

export class RateLimitError extends AppError {
  constructor(
    code = 'RATE_LIMITED',
    message = 'Muitas requisições. Tente novamente em breve.',
    details?: unknown
  ) {
    super(code, message, 429, details);
  }
}

export class ValidationError extends AppError {
  constructor(code = 'VALIDATION_ERROR', message = 'Erro de validação', details?: unknown) {
    super(code, message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(code = 'UNAUTHORIZED', message = 'Autenticação necessária', details?: unknown) {
    super(code, message, 401, details);
  }
}

export class ConnectionError extends AppError {
  constructor(code = 'CONNECTION_ERROR', message = 'Erro de conexão', details?: unknown) {
    super(code, message, 503, details);
  }
}

export class SessionExpiredError extends AppError {
  constructor(code = 'SESSION_EXPIRED', message = 'Sessão expirada', details?: unknown) {
    super(code, message, 401, details);
  }
}
