import { Entity } from 'typeorm';
import { AbstractEntity } from 'src/common';


@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {}
