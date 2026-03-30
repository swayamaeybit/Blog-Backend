// src/users/dto/create-user.dto.ts

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
      example: 'example@gmail.com',
      description: 'Enter Email address',
    })
  @IsEmail()
  email: string;

  @ApiProperty({
      example: '123456',
      description: 'Enter Password for the user',
    })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
      example: 'example',
      description: 'Enter Full name of the user',
    })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // defaults to 'reader' if not provided
}