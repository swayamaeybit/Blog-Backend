// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CommentsService {}


// src/comments/comments.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User, UserRole } from '../user/entities/user.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService, // verify post exists
  ) {}

  // POST /posts/:postId/comments
  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    // Verify the post exists and is accessible
    await this.postsService.findOne(postId, author);

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      authorId: author.id,
    });

    return this.commentsRepository.save(comment);
  }

  // GET /posts/:postId/comments — public
  async findAllByPost(postId: string): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .select([
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'author.id',
        'author.name',
        'author.email',  // never expose password
      ])
      .where('comment.postId = :postId', { postId })
      .orderBy('comment.createdAt', 'ASC')
      .getMany();
  }

  // GET /comments/:id — get a single comment
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .select([
        'comment',
        'author.id',
        'author.name',
        'author.email',
      ])
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) throw new NotFoundException(`Comment #${id} not found`);
    return comment;
  }

  // PATCH /comments/:id — only author or admin
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) throw new NotFoundException(`Comment #${id} not found`);

    const isOwner = comment.authorId === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  // DELETE /comments/:id — only author or admin
  async remove(id: string, user: User): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) throw new NotFoundException(`Comment #${id} not found`);

    const isOwner = comment.authorId === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}