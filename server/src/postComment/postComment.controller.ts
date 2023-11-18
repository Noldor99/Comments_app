import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('postComment')
@Controller('postComment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  create(@Body() createPostCommentDto: CreatePostCommentDto) {
    return this.postCommentService.addPostComment(createPostCommentDto);
  }
  @Get(':id')
  getComment(@Param('id') id: number) {
    return this.postCommentService.getCommentId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCommentService.removePostComment(+id);
  }

  @Get()
  @ApiQuery({ name: 'parentId', type: Number, required: false, example: 1 })
  topLevelComments(@Query() queryParams) {
    if (queryParams.parentId) {
      return this.postCommentService.getCommentsByParentId(
        queryParams.parentId,
      );
    }
    return this.postCommentService.getTopLevelComments();
  }
}
