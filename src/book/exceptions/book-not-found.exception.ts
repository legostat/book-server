import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';

export class BookNotFoundException extends AppException {
  constructor(bookId: string) {
    super(`Book with ID '${bookId}' was not found`, HttpStatus.NOT_FOUND);
  }
}
