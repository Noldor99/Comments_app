import { Module } from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { PostCommentController } from './postComment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/entity/postComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment])],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
