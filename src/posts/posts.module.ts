// import { Module } from '@nestjs/common';

// @Module({})
// export class PostsModule {}


// src/posts/posts.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService], //  CommentsModule will need this
})
export class PostsModule {}