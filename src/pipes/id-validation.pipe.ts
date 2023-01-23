import { Types } from 'mongoose';
import { PipeTransform } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces';
import { BadRequestException } from '@nestjs/common/exceptions';

import { ID_VALIDATION_ERROR } from './id-validation.constants';

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type != 'param') {
      return value;
    }
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ID_VALIDATION_ERROR);
    }
  }
}
