import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';

export class BookSlugConflictException extends AppException {
  constructor(slug: string) {
    super(`Book with slug '${slug}' already exists`, HttpStatus.CONFLICT);
  }
}
