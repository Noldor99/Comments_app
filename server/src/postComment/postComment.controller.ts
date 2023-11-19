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
  BadRequestException,
} from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationService } from 'src/validator/FileValidatorService';

@ApiTags('postComment')
@Controller('postComment')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly fileValidationService: FileValidationService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @UploadedFile() image,
  ) {
    // if (!image) {
    //   throw new BadRequestException('Файл не був завантажений');
    // }

    // await this.fileValidationService.validateImage(image, 320, 240);

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
    const { page, perPage, sortBy, sortOrder } = queryParams;

    return this.postCommentService.getTopLevelComments(
      page,
      perPage,
      sortBy,
      sortOrder,
    );
  }
}
