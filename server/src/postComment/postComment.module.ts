import { Module } from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { PostCommentController } from './postComment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/entity/postComment.entity';
import { FilesModule } from 'src/files/files.module';
import { FileValidationService } from 'src/validator/fileValidatorService';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment]), FilesModule],
  controllers: [PostCommentController],
  providers: [PostCommentService, FileValidationService],
})
export class PostCommentModule {}
