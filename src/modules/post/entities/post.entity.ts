import { Entity } from 'typeorm';
import { AbstractEntity } from 'src/common';


@Entity({ name: 'post' })
export class PostEntity extends AbstractEntity {}
