export default class ConnectionError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ConnectionError";
    this.statusCode = statusCode;
  }
}