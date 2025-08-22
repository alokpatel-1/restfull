import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDao } from '../daos/user.dao';
import { RegisterUserDto, RegisterAdminDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto';
import { config } from '../config';
import { UserRole } from '../models/user.schema';

export class AuthController {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Register a new regular user
   */
  registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const registerDto = req.body as RegisterUserDto;

      // Check if email already exists
      const emailExists = await this.userDao.emailExists(registerDto.email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Create user
      const user = await this.userDao.createUser(registerDto);

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // Return response
      return res.status(201).json(
        new AuthResponseDto(token, user._id.toString(), user.name, user.email, user.role)
      );
    } catch (error) {
      console.error('User registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Register a new admin user
   */
  registerAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
      const registerDto = req.body as RegisterAdminDto;

      // Check if email already exists
      const emailExists = await this.userDao.emailExists(registerDto.email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Create admin
      const admin = await this.userDao.createAdmin(registerDto);

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id.toString(), role: admin.role },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // Return response
      return res.status(201).json(
        new AuthResponseDto(token, admin._id.toString(), admin.name, admin.email, admin.role)
      );
    } catch (error) {
      console.error('Admin registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Login user (works for both regular users and admins)
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const loginDto = req.body as LoginDto;

      // Find user by email
      const user = await this.userDao.findByEmail(loginDto.email);
      if (!user) {
        return res.status(401).json({ message: 'Please enter a valid email' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is blocked. Please contact an administrator.' });
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(loginDto.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Generate JWT token with role information
      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      // Return response
      return res.status(200).json(
        new AuthResponseDto(token, user._id.toString(), user.name, user.email, user.role)
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