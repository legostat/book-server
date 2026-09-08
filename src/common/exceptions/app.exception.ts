import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export abstract class AppException extends HttpException {
  protected constructor(
    message: string,
    status: HttpStatus,
    options?: HttpExceptionOptions,
  ) {
    super(message, status, options);
  }
}
