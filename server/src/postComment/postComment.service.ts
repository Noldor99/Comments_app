import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/entity/postComment.entity';
import { Repository } from 'typeorm';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { Equal } from 'typeorm';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
  ) {}

  async addPostComment(dto: CreatePostCommentDto): Promise<PostComment> {
    const { content, userId, likes, parentId } = dto;
    const addPostComment = this.postCommentRepository.create({
      likes,
      content,
      user: { id: userId },
      parent: { id: parentId },
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

  async getTopLevelComments(): Promise<PostComment[]> {
    return this.postCommentRepository
      .createQueryBuilder('comment')
      .where('comment.parent IS NULL')
      .orderBy('comment.createdAt', 'DESC')
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
