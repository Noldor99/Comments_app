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
  UseGuards,
} from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('postComment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('postComment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
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
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    example: 'DESC',
  })
  topLevelCommentsTable(@Query() queryParams) {
    const { page, perPage, sortBy, sortOrder, parentId } = queryParams;
    if (parentId) {
      return this.postCommentService.getCommentsByParentId(
        queryParams.parentId,
      );
    }

    return this.postCommentService.getTopLevelComments(
      page,
      perPage,
      sortBy,
      sortOrder,
    );
  }
}
