// The server replied with an error, e.g. 409 "slot taken" or 503 "busy".
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// The request never reached the server (no internet). Safe to try again later.
export class NetworkError extends Error {
  constructor() {
    super('No internet connection');
    this.name = 'NetworkError';
  }
}
