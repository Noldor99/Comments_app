import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('postComment')
@Controller('postComment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @UploadedFile() image,
  ) {
    return this.postCommentService.addPostComment(createPostCommentDto, image);
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
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'perPage', type: Number, required: false, example: 25 })
  topLevelComments(@Query() queryParams) {
    const { parentId, page, perPage } = queryParams;

    if (parentId) {
      return this.postCommentService.getCommentsByParentId(parentId);
    }

    return this.postCommentService.getTopLevelComments(page, perPage);
  }
}
