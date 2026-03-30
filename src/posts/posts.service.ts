// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class PostsService {}


// src/posts/posts.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  // CREATE — any authenticated user can create a post
  async create(createPostDto: CreatePostDto, author: User): Promise<Post> {
    const existingSlug = await this.postsRepository.findOne({
      where: { slug: createPostDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('A post with this slug already exists');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      authorId: author.id,
    });

    return this.postsRepository.save(post);
  }

  // GET ALL — public, only returns published posts
  // Admins can see all including drafts
  async findAll(user?: User): Promise<Post[]> {
    const isAdmin = user?.role === UserRole.ADMIN;

    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post',
        'author.id',
        'author.name',
        'author.email',   // never expose password
        'category',
      ]);

    if (!isAdmin) {
      query.where('post.status = :status', { status: PostStatus.PUBLISHED });
    }

    return query.orderBy('post.createdAt', 'DESC').getMany();
  }

  // GET ONE — public for published, auth required for drafts
  async findOne(id: string, user?: User): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post',
        'author.id',
        'author.name',
        'author.email',
        'category',
      ])
      .where('post.id = :id', { id })
      .getOne();

    if (!post) throw new NotFoundException(`Post #${id} not found`);

    // Draft posts are only visible to the author or admin
    const isDraft = post.status === PostStatus.DRAFT;
    const isOwner = user?.id === post.authorId;
    const isAdmin = user?.role === UserRole.ADMIN;

    if (isDraft && !isOwner && !isAdmin) {
      throw new NotFoundException(`Post #${id} not found`);
      // Return 404 (not 403) so we don't reveal that a draft exists
    }

    return post;
  }

  // GET BY SLUG — useful for frontend routing
  async findBySlug(slug: string, user?: User): Promise<Post> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .select(['post', 'author.id', 'author.name', 'author.email', 'category'])
      .where('post.slug = :slug', { slug })
      .getOne();

    if (!post) throw new NotFoundException(`Post with slug "${slug}" not found`);

    const isDraft = post.status === PostStatus.DRAFT;
    const isOwner = user?.id === post.authorId;
    const isAdmin = user?.role === UserRole.ADMIN;

    if (isDraft && !isOwner && !isAdmin) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }
    return post;
  }

  // GET MY POSTS — returns all posts by the logged-in user
  async findMyPosts(user: User): Promise<Post[]> {
    return this.postsRepository.find({
      where: { authorId: user.id },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  // UPDATE — only author or admin
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException(`Post #${id} not found`);

    // Ownership check
    const isOwner = post.authorId === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    // Check slug uniqueness if slug is being changed
    if (updatePostDto.slug && updatePostDto.slug !== post.slug) {
      const slugExists = await this.postsRepository.findOne({
        where: { slug: updatePostDto.slug },
      });
      if (slugExists) {
        throw new ConflictException('A post with this slug already exists');
      }
    }

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  // DELETE — only author or admin
  async remove(id: string, user: User): Promise<{ message: string }> {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) throw new NotFoundException(`Post #${id} not found`);

    const isOwner = post.authorId === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
    return { message: `Post "${post.title}" deleted successfully` };
  }
}