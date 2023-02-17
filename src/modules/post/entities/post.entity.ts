import { AbstractEntity } from 'src/common';
import { UserEntity } from 'src/modules/user/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'post' })
export class PostEntity extends AbstractEntity {
  @Column()
  caption: string;

  @Column({ default: null })
  imageUrl: string;

  @Column({ default: null })
  location: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts)
  @JoinColumn()
  user: UserEntity;
}
