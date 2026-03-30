// import { Module } from '@nestjs/common';
// import { CategoriesController } from './categories.controller';
// import { CategoriesService } from './categories.service';

// @Module({
//   controllers: [CategoriesController],
//   providers: [CategoriesService]
// })
// export class CategoriesModule {}


// src/categories/categories.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // 👈 PostsModule will need this later
})
export class CategoriesModule {}