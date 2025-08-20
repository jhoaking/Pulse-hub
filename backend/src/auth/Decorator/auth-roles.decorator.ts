import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interface/valid-roles.interface';
import { validMetaRoles } from './validRoles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guard/user-role-guard/user-role-guard.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    validMetaRoles(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
