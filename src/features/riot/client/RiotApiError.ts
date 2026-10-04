export type RiotApiErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export class RiotApiError extends Error {
  readonly code: RiotApiErrorCode;
  readonly statusCode?: number;
  readonly retryAfterSeconds?: number;
  readonly endpoint?: string;

  constructor(params: {
    message: string;
    code: RiotApiErrorCode;
    statusCode?: number;
    retryAfterSeconds?: number;
    endpoint?: string;
  }) {
    super(params.message);
    this.name = "RiotApiError";
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.retryAfterSeconds = params.retryAfterSeconds;
    this.endpoint = params.endpoint;

    Object.setPrototypeOf(this, RiotApiError.prototype);
  }

  static fromStatusCode(
    status: number,
    endpoint?: string,
    retryAfterSeconds?: number,
    details?: string
  ): RiotApiError {
    let code: RiotApiErrorCode = "UNKNOWN";
    let message = details || `Riot API request failed with status ${status}`;

    if (status === 400) {
      code = "INVALID_INPUT";
      message = details || "Invalid input or parameters provided to Riot API.";
    } else if (status === 401) {
      code = "UNAUTHORIZED";
      message = "Riot API Key is missing or invalid.";
    } else if (status === 403) {
      code = "FORBIDDEN";
      message = "Access forbidden. API key expired or lacking permissions.";
    } else if (status === 404) {
      code = "NOT_FOUND";
      message = details || "Requested Riot entity (account/player/match) was not found.";
    } else if (status === 429) {
      code = "RATE_LIMITED";
      message = `Rate limit exceeded. Please retry after ${retryAfterSeconds ?? 1}s.`;
    } else if (status >= 500) {
      code = "SERVICE_UNAVAILABLE";
      message = "Riot Games service is temporarily unavailable. Please try again later.";
    }

    return new RiotApiError({
      message,
      code,
      statusCode: status,
      retryAfterSeconds,
      endpoint,
    });
  }

  static timeout(endpoint?: string, timeoutMs?: number): RiotApiError {
    return new RiotApiError({
      message: `Riot API request timed out after ${timeoutMs ?? 8000}ms.`,
      code: "TIMEOUT",
      statusCode: 408,
      endpoint,
    });
  }
}
