// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AuthService {}



// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Register a new user
  async register(registerDto: RegisterDto) {
    // UsersService.create() already checks for duplicate email
    const user = await this.userService.create(registerDto);

    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: token,
    };
  }

  // Login existing user
  async login(loginDto: LoginDto) {
    // 1. Find user by email (returns full record including password)
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare plain password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate and return JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: token,
    };
  }

  // Get current logged-in user profile
  async getProfile(userId: string) {
    return this.userService.findOne(userId);
  }

  // Private helper — builds the JWT payload
  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}