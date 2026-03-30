// import { Module } from '@nestjs/common';

// @Module({})
// export class CommentsModule {}


// src/comments/comments.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comments.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    PostsModule, // 👈 needed for PostsService to verify post exists
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}