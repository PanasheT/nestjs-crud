import { AbstractEntity } from 'src/common';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity extends AbstractEntity {
  @Column()
  bio: string;

  @Column()
  location: string;

  @Column({ default: null })
  imageURL: string;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile)
  readonly user: UserEntity;
}
