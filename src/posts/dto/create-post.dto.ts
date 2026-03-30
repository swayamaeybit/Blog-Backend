// // src/posts/dto/create-post.dto.ts

// import {
//   IsEnum,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   IsUUID,
//   Matches,
//   MaxLength,
// } from 'class-validator';
// import { PostStatus } from '../entities/post.entity';

// export class CreatePostDto {
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(200)
//   title: string;

//   @IsString()
//   @IsNotEmpty()
//   content: string;

//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
//     message: 'Slug must be lowercase letters, numbers and hyphens only',
//   })
//   slug: string;

//   @IsEnum(PostStatus)
//   @IsOptional()
//   status?: PostStatus; // defaults to 'draft'

//   @IsUUID()
//   @IsOptional()
//   categoryId?: string;
// }


import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Blog Post',
    maxLength: 200,
    description: 'Title of the post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'This is the content of the post...',
    description: 'Main content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'my-first-blog-post',
    description: 'URL-friendly slug (lowercase, hyphens only)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers and hyphens only',
  })
  slug: string;

  @ApiPropertyOptional({
    enum: PostStatus,
    example: PostStatus.DRAFT,
    description: 'Post status (defaults to draft)',
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiPropertyOptional({
    example: '37533d83-935e-48c5-bb26-0317bf634d62',
    description: 'Category ID (UUID)',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}