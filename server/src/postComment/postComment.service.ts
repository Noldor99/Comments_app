import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/entity/postComment.entity';
import { Repository } from 'typeorm';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { Equal } from 'typeorm';
import { FileService, FileType } from 'src/files/files.service';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    private fileService: FileService,
  ) {}

  async addPostComment(
    dto: CreatePostCommentDto,
    image,
    text,
  ): Promise<PostComment> {
    const { content, userId, parentId } = dto;

    let audioPath = null;
    let picturePath = null;

    if (text) {
      audioPath = await this.fileService.createFile(FileType.TEXT, text);
    }

    if (image) {
      picturePath = await this.fileService.createFile(FileType.IMAGE, image);
    }

    const addPostComment = this.postCommentRepository.create({
      likes: 0,
      content,
      text: audioPath,
      image: picturePath,
      user: { id: userId },
      parent: parentId ? { id: parentId } : null,
    });

    await this.postCommentRepository.save(addPostComment);
    return addPostComment;
  }

  async removePostComment(id: number): Promise<string> {
    await this.postCommentRepository.delete(id);
    return 'PostComment deleted';
  }

  async findAll() {
    return this.postCommentRepository.find({
      relations: { user: true, parent: true },
    });
  }

  async getCommentId(id: number): Promise<PostComment> {
    return this.postCommentRepository.findOne({
      where: { id },
      relations: ['user', 'parent'],
    });
  }

  async getTopLevelComments(
    page: number,
    perPage: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ) {
    const queryBuilder = this.postCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.parent IS NULL');

    switch (sortBy) {
      case 'userName':
        queryBuilder.orderBy('user.email', sortOrder);
        break;
      case 'email':
        queryBuilder.orderBy('user.email', sortOrder);
        break;
      case 'createdAt':
        queryBuilder.orderBy('comment.createdAt', sortOrder);
        break;
      default:
        queryBuilder.orderBy('comment.createdAt', 'DESC');
        break;
    }

    // Execute the query to get paginated results
    const [comments, total] = await queryBuilder
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { comments, total };
  }

  async getCommentsByParentId(
    parentId: string,
  ): Promise<{ comments: PostComment[] }> {
    try {
      const comments = await this.postCommentRepository.find({
        where: { parent: Equal(parentId) },
        relations: ['user', 'parent'],
        order: { createdAt: 'DESC' },
      });

      return { comments };
    } catch (e) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(e.message),
        description: 'Some error description',
      });
    }
  }
}
