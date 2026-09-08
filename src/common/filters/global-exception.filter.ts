import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';

interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      const error = exception instanceof Error ? exception : undefined;
      this.logger.error(
        `Unhandled exception for ${request.method} ${request.url}`,
        error?.stack,
      );
    }

    const body: ErrorResponse = {
      type: this.getExceptionType(exception),
      title: this.getExceptionTitle(exception),
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }

  private getExceptionType(exception: unknown): string {
    if (exception instanceof AppException) {
      return exception.constructor.name;
    }

    if (exception instanceof HttpException) {
      return exception.constructor.name;
    }

    return 'InternalServerError';
  }

  private getExceptionTitle(exception: unknown): string {
    if (!(exception instanceof HttpException)) {
      return 'An unexpected error occurred';
    }

    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    const message =
      'message' in response ? response.message : exception.message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }
}
