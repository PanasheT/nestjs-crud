import { AbstractEntity } from 'src/common';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, update: false })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
