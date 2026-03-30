// import { Controller } from '@nestjs/common';

// @Controller('comments')
// export class CommentsController {}


// src/comments/comments.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

interface AuthRequest extends Request {
  user: User;
}

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // POST /posts/:postId/comments — auth required
  @ApiOperation({ summary: 'Create a comment on a post (auth required)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthRequest,
  ) {
    return this.commentsService.create(postId, createCommentDto, req.user);
  }

  // GET /posts/:postId/comments — public
  @ApiOperation({ summary: 'Get all comments for a post (public)' })
  @Get('posts/:postId/comments')
  findAllByPost(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.commentsService.findAllByPost(postId);
  }

  // GET /comments/:id — public
  @ApiOperation({ summary: 'Get a comment by ID (public)' })
  @ApiOperation({ summary: 'Get a comment by ID (public)' })
  @Get('comments/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  // PATCH /comments/:id — auth required, ownership in service
  @ApiOperation({ summary: 'Update a comment by ID (auth required)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('comments/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: AuthRequest,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user);
  }

  // DELETE /comments/:id — auth required, ownership in service
  @ApiOperation({ summary: 'Delete a comment by ID (auth required)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('comments/:id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    return this.commentsService.remove(id, req.user);
  }
}