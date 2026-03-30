// import { Controller } from '@nestjs/common';

// @Controller('auth')
// export class AuthController {}


// src/auth/auth.controller.ts

import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

// Extend Express Request to include our user object
interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @ApiOperation({ summary: 'User registration' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // POST /auth/login
   @ApiOperation({ summary: 'User login' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /auth/me  ← protected route, requires JWT token
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: AuthRequest) {
    return this.authService.getProfile(req.user.id);
  }
}
