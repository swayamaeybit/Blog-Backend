// src/categories/dto/create-category.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Game Development',
    maxLength: 100,
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'game-dev',
    description:
      'Slug for the category (lowercase letters, numbers and hyphens only, e.g. game-dev)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers and hyphens only (e.g. game-dev)',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Category for all game development related posts',
    description: 'Optional description of the category',
  })
  @IsString()
  @IsOptional()
  description?: string;
}