/**
 * DTO for updating user information
 */
export class UpdateUserDto {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

/**
 * DTO for updating user password
 */
export class UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;

  constructor(currentPassword: string, newPassword: string) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }
}

/**
 * DTO for updating user active status (block/unblock)
 */
export class UpdateUserStatusDto {
  isActive: boolean;

  constructor(isActive: boolean) {
    this.isActive = isActive;
  }
}

/**
 * DTO for user response (used when returning user data)
 */
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;

  constructor(id: string, name: string, email: string, role: string, isActive: boolean, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
  }
}
