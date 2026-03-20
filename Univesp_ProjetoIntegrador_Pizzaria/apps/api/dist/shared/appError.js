export class AppError extends Error {
    statusCode;
    code;
    constructor(input) {
        super(input.message);
        this.statusCode = input.statusCode;
        this.code = input.code;
    }
}
