export type AIErrorCode =
  | 'ABORTED'
  | 'CONNECTION_FAILED'
  | 'EMPTY_RESPONSE'
  | 'HTTP_ERROR'
  | 'INVALID_JSON'
  | 'INVALID_RESPONSE'
  | 'MODEL_NOT_FOUND'
  | 'PROVIDER_NOT_CONFIGURED'
  | 'TIMEOUT'
  | 'UNSUPPORTED_PROVIDER';

export class AIProviderError extends Error {
  constructor(
    public readonly code: AIErrorCode,
    message: string,
    public readonly provider?: string,
    public readonly status?: number,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'AIProviderError';
  }
}

export interface PublicAIError {
  code: string;
  message: string;
  status: number;
}

export function getPublicAIError(error: unknown): PublicAIError {
  if (!(error instanceof AIProviderError)) {
    return {
      code: 'AI_UNAVAILABLE',
      message: 'A ASYNC está indisponível no momento. Tente novamente em instantes.',
      status: 503,
    };
  }

  switch (error.code) {
    case 'TIMEOUT':
      return {
        code: 'AI_TIMEOUT',
        message: 'A ASYNC demorou mais que o esperado. Tente novamente.',
        status: 504,
      };
    case 'MODEL_NOT_FOUND':
      return {
        code: 'AI_MODEL_UNAVAILABLE',
        message: 'O modelo da ASYNC ainda não está disponível no servidor.',
        status: 503,
      };
    case 'PROVIDER_NOT_CONFIGURED':
    case 'UNSUPPORTED_PROVIDER':
      return {
        code: 'AI_NOT_CONFIGURED',
        message: 'A ASYNC não está configurada neste ambiente.',
        status: 503,
      };
    case 'INVALID_JSON':
    case 'INVALID_RESPONSE':
    case 'EMPTY_RESPONSE':
      return {
        code: 'AI_INVALID_RESPONSE',
        message: 'A ASYNC retornou uma resposta inválida. Tente novamente.',
        status: 502,
      };
    case 'ABORTED':
      return {
        code: 'AI_REQUEST_ABORTED',
        message: 'A solicitação à ASYNC foi cancelada.',
        status: 499,
      };
    case 'CONNECTION_FAILED':
    case 'HTTP_ERROR':
    default:
      return {
        code: 'AI_UNAVAILABLE',
        message: 'A ASYNC está indisponível no momento. Tente novamente em instantes.',
        status: 503,
      };
  }
}
