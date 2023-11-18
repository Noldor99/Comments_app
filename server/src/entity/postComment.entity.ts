import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';
import { User } from './user.entity';

@Entity('postCpmments')
export class PostComment extends AbstractEntity<PostComment> {
  @Column()
  content: string;

  @Column()
  likes: number;

  @ManyToOne(() => User, (user) => user.postComments)
  user: User;

  @ManyToOne(() => PostComment, (comment) => comment.replies, {
    nullable: true,
  })
  parent: PostComment;

  @OneToMany(() => PostComment, (comment) => comment.parent)
  replies: PostComment[];

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
