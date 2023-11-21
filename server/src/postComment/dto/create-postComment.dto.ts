import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsInt,
  Validate,
} from 'class-validator';
import { HtmlTagsValidator } from 'src/validator/html-tags.validator';

export class CreatePostCommentDto {
  @ApiProperty({
    example: 'This is a comment text.',
    description: 'The text content of the comment.',
  })
  @MinLength(6, { message: 'Content must be at least 6 characters long' })
  @Validate(HtmlTagsValidator, {
    message:
      'Дозволені тільки наступні HTML теги: <a>, <code>, <i>, <strong>. Текст повинен бути валідним XHTML.',
  })
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The user ID who created the comment.',
  })
  @Type(() => Number)
  @IsInt({ message: 'UserId should be an integer' })
  @IsNotEmpty({ message: 'UserId should not be empty' })
  userId: number;

  @ApiProperty({
    example: 1,
    description:
      'The ID of the parent comment. If null, it indicates a top-level comment.',
    required: false,
  })
  @Type(() => Number)
  @IsInt({ message: 'parentId should be an integer' })
  @IsOptional()
  parentId: null | number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of the device',
    required: false,
  })
  image: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File of the device',
    required: false,
  })
  text: any;
}
