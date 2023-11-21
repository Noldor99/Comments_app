import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import { PostCommentService } from './postComment.service';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileValidationService } from 'src/validator/FileValidatorService';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@ApiTags('postComment')
@UsePipes(ValidationPipe)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('postComment')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly fileValidationService: FileValidationService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'text', maxCount: 1 },
    ]),
  )
  async create(
    @Body()
    createPostCommentDto: CreatePostCommentDto,
    @UploadedFiles() files,
  ) {
    try {
      const { image, text } = files;

      // Перевірка наявності хоча б одного файлу і валідація
      await this.fileValidationService.validateImage(
        image ? image[0] : null,
        text ? text[0] : null,
      );

      // Виклик сервісної функції для обробки коментарів
      return this.postCommentService.addPostComment(
        createPostCommentDto,
        image ? image[0] : null,
        text ? text[0] : null,
      );
    } catch (error) {
      return { error: error.message };
    }
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
  @ApiQuery({
    name: 'parentId',
    type: Number,
    required: false,
    example: 1,
    description:
      'для отримання всих дочірніх коментраів писати id, для верхніх коментів не писати',
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'perPage', type: Number, required: false, example: 25 })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    example: 'createdAt',
    description: 'userName email createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    type: String,
    required: false,
    example: 'DESC',
    description: 'ASC DESC',
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
