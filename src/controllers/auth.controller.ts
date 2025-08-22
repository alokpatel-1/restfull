import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDao } from '../daos/user.dao';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto';
import { config } from '../config';

export class AuthController {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const registerDto = req.body as RegisterDto;

      // Check if email already exists
      const emailExists = await this.userDao.emailExists(registerDto.email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Create user
      const user = await this.userDao.create(registerDto);

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      // Return response
      return res.status(201).json(
        new AuthResponseDto(token, user._id.toString(), user.name, user.email)
      );
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const loginDto = req.body as LoginDto;

      // Find user by email
      const user = await this.userDao.findByEmail(loginDto.email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(loginDto.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      // Return response
      return res.status(200).json(
        new AuthResponseDto(token, user._id.toString(), user.name, user.email)
      );
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      // User is already attached to request by auth middleware
      return res.status(200).json({ user: req.user });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
