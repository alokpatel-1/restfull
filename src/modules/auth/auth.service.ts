import { AuthDao } from './auth.dao';
import { RegisterDto, LoginDto, RefreshTokenDto } from './auth.dto';
import { IUser } from '../user/user.model';

export class AuthService {
  private authDao: AuthDao;

  constructor() {
    this.authDao = new AuthDao();
  }

  async register(registerData: RegisterDto): Promise<{ success: boolean; message: string; user?: IUser }> {
    const existingUser = await this.authDao.findUserByEmail(registerData.email);

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    // Create new user
    const user = await this.authDao.createUser(registerData);

    return {
      success: true,
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginData: LoginDto): Promise<{ success: boolean; message: string; user?: IUser }> {
    const user = await this.authDao.findUserByEmail(loginData.email);

    if (!user) {
      return {
        success: false,
        message: 'Invalid email.',
      };
    }

    // Verify password
    const isPasswordValid = await this.authDao.verifyPassword(loginData.password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid password.',
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: user,
    };
  }

  async refreshToken(refreshTokenData: RefreshTokenDto): Promise<{ success: boolean; message: string; userId?: string }> {
    const refreshToken = await this.authDao.findRefreshToken(refreshTokenData.refreshToken);

    if (!refreshToken) {
      return {
        success: false,
        message: 'Invalid refresh token',
      };
    }

    // Check if token is expired
    if (refreshToken.expiresAt < new Date()) {
      await this.authDao.deleteRefreshToken(refreshTokenData.refreshToken);
      return {
        success: false,
        message: 'Refresh token expired',
      };
    }

    // Get user ID from refresh token
    const userId = refreshToken.userId.toString();

    return {
      success: true,
      message: 'Token refresh successful',
      userId,
    };
  }

  async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    await this.authDao.deleteRefreshToken(refreshToken);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
