import { Module } from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { PostCommentController } from './postComment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/entity/postComment.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), FilesModule],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
