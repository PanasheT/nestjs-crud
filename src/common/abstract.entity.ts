import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: 'NOW()', update: false })
  createdAt: Date;

  @Column({ default: 'NOW()' })
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;
}
