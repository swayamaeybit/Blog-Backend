// // src/auth/dto/register.dto.ts

// import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// export class RegisterDto {
//   @IsEmail()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @MinLength(6)
//   password: string;
// }


import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'example',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'example123',
    minLength: 6,
    description: 'User password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}