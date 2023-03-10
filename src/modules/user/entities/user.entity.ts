import { AbstractEntity } from 'src/common';
import { PostEntity } from 'src/modules/post/entities';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
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
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user, {
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];
}
