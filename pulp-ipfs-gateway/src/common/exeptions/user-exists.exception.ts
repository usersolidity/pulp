import { ConflictException } from '@nestjs/common';
import { ErrorType } from '../enums';

export class UserExistsException extends ConflictException {
  constructor(address: string) {
    super({
      errorType: ErrorType.UserExists,
      message: `There's a user with address '${address}'`
    });
  }
}
