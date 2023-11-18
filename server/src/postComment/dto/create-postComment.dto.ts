import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePostCommentDto {
  @ApiProperty({
    example: 'This is a comment text.',
    description: 'The text content of the comment.',
  })
  @IsNotEmpty({ message: 'Text should not be empty' })
  @IsString({ message: 'Text should be a string' })
  content: string;

  @ApiProperty({
    example: 1,
    description: 'The user ID who created the comment.',
  })
  @IsNotEmpty({ message: 'UserId should not be empty' })
  @IsString({ message: 'UserId should be a string' })
  userId: number;

  @ApiProperty({
    example: null,
    description:
      'The ID of the parent comment. If null, it indicates a top-level comment.',
    required: false,
  })
  @IsOptional()
  parentId: null | number;

  @ApiProperty({
    example: 0,
    description: 'The number of likes for the comment.',
  })
  @IsNumber({}, { message: 'Likes should be a number' })
  @IsOptional()
  likes: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of the device',
    required: false,
  })
  image: any;
}
