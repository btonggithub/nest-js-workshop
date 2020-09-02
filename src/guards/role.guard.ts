/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleAccount, IAccount } from 'src/interfaces/app.interface';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  private roles: RoleAccount[];
  constructor(..._roles: RoleAccount[]) {
    this.roles = _roles;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | import('rxjs').Observable<boolean> {
    // เก็บค่า request
    const request = context.switchToHttp().getRequest() as Request;
    // ตรวจสอบ ว่ามี user login เข้ามาหรือไม่
    if (request.user) {
      const userLogin = request.user as IAccount;
      // ค้นหา user login ว่ามี role กับที่กำหนดมาหรือไม่
      const searchRoles = this.roles.filter(role => role == userLogin.role);
      return searchRoles.length > 0;
    }
    return false;
  }
}
