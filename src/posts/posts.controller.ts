// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Req,
//   ParseUUIDPipe,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { PostsService } from './posts.service';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { Request } from 'express';
// import { User } from '../user/entities/user.entity';

// interface AuthRequest extends Request {
//   user: User;
// }

// @Controller('posts')
// export class PostsController {
//   constructor(private readonly postsService: PostsService) {}

//   // POST /posts — auth required, any role
//   @UseGuards(JwtAuthGuard)
//   @Post()
//   create(@Body() createPostDto: CreatePostDto, @Req() req: AuthRequest) {
//     return this.postsService.create(createPostDto, req.user);
//   }

//   // GET /posts — public (admins see drafts too via token)
//   @Get()
//   findAll(@Req() req: AuthRequest) {
//     return this.postsService.findAll(req.user); // req.user may be undefined
//   }

//   // GET /posts/my — get my own posts (auth required)
//   @UseGuards(JwtAuthGuard)
//   @Get('my')
//   findMyPosts(@Req() req: AuthRequest) {
//     return this.postsService.findMyPosts(req.user);
//   }

//   // GET /posts/slug/:slug — public
//   @Get('slug/:slug')
//   findBySlug(@Param('slug') slug: string, @Req() req: AuthRequest) {
//     return this.postsService.findBySlug(slug, req.user);
//   }

//   // GET /posts/:id — public
//   @Get(':id')
//   findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest) {
//     return this.postsService.findOne(id, req.user);
//   }

//   // PATCH /posts/:id — auth required, ownership checked in service
//   @UseGuards(JwtAuthGuard)
//   @Patch(':id')
//   update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() updatePostDto: UpdatePostDto,
//     @Req() req: AuthRequest,
//   ) {
//     return this.postsService.update(id, updatePostDto, req.user);
//   }

//   // DELETE /posts/:id — auth required, ownership checked in service
//   @UseGuards(JwtAuthGuard)
//   @HttpCode(HttpStatus.OK)
//   @Delete(':id')
//   remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest) {
//     return this.postsService.remove(id, req.user);
//   }
// }

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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

interface AuthRequest extends Request {
  user: User;
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // POST /posts — auth required
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: AuthRequest) {
    return this.postsService.create(createPostDto, req.user);
  }

  // GET /posts — public
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List of posts' })
  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.postsService.findAll(req.user);
  }

  // GET /posts/my — auth required
  @ApiOperation({ summary: 'Get current user posts' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyPosts(@Req() req: AuthRequest) {
    return this.postsService.findMyPosts(req.user);
  }

  // GET /posts/slug/:slug — public
  @ApiOperation({ summary: 'my-first-blog-post' })
  @ApiParam({ name: 'slug', example: 'my-first-blog-post' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string, @Req() req: AuthRequest) {
    return this.postsService.findBySlug(slug, req.user);
  }

  // GET /posts/:id — public
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', example: '24952691-1748-4534-ac4a-8c80ddd31d23' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest) {
    return this.postsService.findOne(id, req.user);
  }

  // PATCH /posts/:id — auth required
  @ApiOperation({ summary: 'Update a post' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: '24952691-1748-4534-ac4a-8c80ddd31d23' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthRequest,
  ) {
    return this.postsService.update(id, updatePostDto, req.user);
  }

  // DELETE /posts/:id — auth required
  @ApiOperation({ summary: 'Delete a post' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', example: '24952691-1748-4534-ac4a-8c80ddd31d23' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest) {
    return this.postsService.remove(id, req.user);
  }
}