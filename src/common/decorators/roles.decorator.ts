// src/common/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);

// Usage on any route:
// @Roles(UserRole.ADMIN)          ← admin only
// @Roles(UserRole.ADMIN, UserRole.READER)  ← both roles allowed