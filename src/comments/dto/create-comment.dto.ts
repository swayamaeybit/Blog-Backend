// src/comments/dto/create-comment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post!',
    description: 'Content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
// postId comes from the URL param, not the body
// authorId comes from req.user, not the body
// This prevents users from spoofing ownership