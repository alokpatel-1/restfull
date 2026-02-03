import { Role, PERMISSIONS_BY_ROLE } from '../../constants/openMart.constants';
import { RoleModel } from './role.model';

/**
 * Inserts default roles (USER, SELLER, ADMIN, SUPER_ADMIN) with their permissions
 * into the roles collection if they do not exist.
 * Permissions use dot-notation: domain.resource.action.scope
 * Idempotent: safe to run on every startup.
 */
export async function seedRoles(): Promise<void> {
  for (const role of Object.values(Role)) {
    const permissions = PERMISSIONS_BY_ROLE[role].map((p) => p as string);
    await RoleModel.findOneAndUpdate(
      { name: role },
      { name: role, permissions },
      { upsert: true, new: true }
    );
  }
}
