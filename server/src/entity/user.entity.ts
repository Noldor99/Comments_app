import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostComment } from './postComment.entity';
import { Power } from './power.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => PostComment, (postComment) => postComment.user, {
    onDelete: 'CASCADE',
  })
  postComments: PostComment[];

  @OneToMany(() => Power, (power) => power.user, { onDelete: 'CASCADE' })
  powers: Power[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
