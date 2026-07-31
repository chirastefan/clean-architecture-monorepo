import { type Role, type Permission, hasPermission } from '../roles-permissions';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly roles: Role[] = ['viewer']
  ) {
    if (!email.includes('@')) {
      throw new Error('Invalid user email address.');
    }
  }

  public hasPermission(permission: Permission): boolean {
    return hasPermission(this.roles, permission);
  }
}
