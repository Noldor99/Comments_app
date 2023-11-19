import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/entity/postComment.entity';
import { Repository } from 'typeorm';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { Equal } from 'typeorm';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
    private fileService: FilesService,
  ) {}

  async addPostComment(
    dto: CreatePostCommentDto,
    image?: any,
  ): Promise<PostComment> {
    const { content, userId, likes, parentId } = dto;

    let fileName: string | null = null;
    if (image) {
      fileName = await this.fileService.createFile(image);
    }

    const addPostComment = this.postCommentRepository.create({
      likes,
      content,
      image: fileName,
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
  ): Promise<PostComment[]> {
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

    return queryBuilder
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();
  }

  async getCommentsByParentId(parentId: string) {
    try {
      return this.postCommentRepository.find({
        where: { parent: Equal(parentId) },
        relations: ['user', 'parent'],
        order: { createdAt: 'DESC' },
      });
    } catch (e) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(e.message),
        description: 'Some error description',
      });
    }
  }
}
