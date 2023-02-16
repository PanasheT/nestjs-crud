import { FindQuery } from 'src/common';
import { UserEntity } from '../entities';

export type UserIdentificationProperties = 'username' | 'email' | 'uuid';

export type FindUserQuery = FindQuery<UserEntity, UserIdentificationProperties>;
