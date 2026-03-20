export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(input: { message: string; statusCode: number; code: string }) {
    super(input.message)
    this.statusCode = input.statusCode
    this.code = input.code
  }
}
