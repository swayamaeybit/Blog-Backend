// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // registers User repo
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], //  export so AuthModule can use it later
})
export class UserModule {}