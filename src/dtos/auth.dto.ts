import { UserRole } from '../models/user.schema';

export class RegisterUserDto {
  name: string;
  email: string;
  password: string;
  isActive: boolean;

  constructor(name: string, email: string, password: string, isActive: boolean = true) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
  }
}

export class RegisterAdminDto {
  name: string;
  email: string;
  password: string;
  isActive: boolean;

  constructor(name: string, email: string, password: string, isActive: boolean = true) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
  }
}

export class LoginDto {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class AuthResponseDto {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };

  constructor(token: string, id: string, name: string, email: string, role: UserRole) {
    this.token = token;
    this.user = {
      id,
      name,
      email,
      role
    };
  }
}