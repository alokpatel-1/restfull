export class RegisterDto {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  constructor(name: string, email: string, password: string, isActive: boolean) {
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
  };

  constructor(token: string, id: string, name: string, email: string) {
    this.token = token;
    this.user = {
      id,
      name,
      email,
    };
  }
}