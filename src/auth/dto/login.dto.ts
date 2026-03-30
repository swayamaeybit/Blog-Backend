// src/auth/dto/login.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';


export class LoginDto {

  @ApiProperty({
    example: 'jay@gmail.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password of the user (min length 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}