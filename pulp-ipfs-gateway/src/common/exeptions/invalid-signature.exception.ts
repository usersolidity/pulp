import { ForbiddenException } from '@nestjs/common';
import { ErrorType } from '../enums';

export class InvalidSignatureException extends ForbiddenException {
  constructor() {
    super({
      errorType: ErrorType.InvalidSignature,
      message: 'The signature is invalid'
    });
  }
}
