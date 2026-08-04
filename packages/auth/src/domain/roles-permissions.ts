export type Role = 'admin' | 'editor' | 'viewer';

export type Permission =
  'cart:read' | 'cart:write' | 'user:manage' | 'profile:read' | 'profile:write';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['cart:read', 'cart:write', 'user:manage', 'profile:read', 'profile:write'],
  editor: ['cart:read', 'cart:write', 'profile:read', 'profile:write'],
  viewer: ['cart:read', 'profile:read'],
};

export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
}
