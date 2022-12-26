import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MongoError } from 'mongodb';

import { MONGO_DUPLICATED_KEYS_ERROR_CODE } from 'src/common/constants';

const { NODE_ENV } = process.env;
const isProductionEnv = NODE_ENV === 'production';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const statusCode = this.getHttpStatusCode(exception);
    const message = this.getHttpStatusMessage(exception);

    if (!isProductionEnv) {
      console.log(exception);
    }

    const responseBody = {
      statusCode,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }

  private getHttpStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (
      exception instanceof MongoError &&
      exception.code === MONGO_DUPLICATED_KEYS_ERROR_CODE
    ) {
      return HttpStatus.PRECONDITION_FAILED;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getHttpStatusMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (
      exception instanceof MongoError &&
      exception.code === MONGO_DUPLICATED_KEYS_ERROR_CODE
    ) {
      return 'Model conflict';
    }

    return 'Internal server error';
  }
}
