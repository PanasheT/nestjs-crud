import { AbstractEntity } from 'src/common';
import { Column, Entity, OneToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';

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

  @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile: ProfileEntity;
}
