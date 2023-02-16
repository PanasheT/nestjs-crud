import { FindOperator } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export type AbstractProperties = 'uuid' | 'createdAt' | 'updatedAt' | 'deleted';

export type FindQuery<T extends AbstractEntity, K extends keyof T> = Partial<
  Pick<
    {
      -readonly [P in keyof T]: T[P] | FindOperator<any>;
    },
    K
  >
> & { deleted: boolean };
