import { Request, Response } from 'express';
import { UserDao } from '../daos/user.dao';
import { UpdateUserStatusDto, UserResponseDto } from '../dtos/user.dto';

export class AdminController {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userDao.getAllUsers();
      
      const userResponses = users.map(user => new UserResponseDto(
        user._id.toString(),
        user.name,
        user.email,
        user.role,
        user.isActive,
        user.createdAt
      ));

      return res.status(200).json({
        message: 'Users retrieved successfully',
        users: userResponses
      });
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Get user by ID (admin only)
   */
  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const user = await this.userDao.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        user: new UserResponseDto(
          user._id.toString(),
          user.name,
          user.email,
          user.role,
          user.isActive,
          user.createdAt
        )
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Update user active status (block/unblock user) - admin only
   */
  updateUserStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const { isActive }: UpdateUserStatusDto = req.body;

      // Don't allow admins to block themselves
      if (userId === req.user?.id) {
        return res.status(400).json({ message: 'You cannot change your own active status' });
      }

      // Check if user exists
      const userExists = await this.userDao.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user status
      const updatedUser = await this.userDao.updateActiveStatus(userId, isActive);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const action = isActive ? 'unblocked' : 'blocked';
      
      return res.status(200).json({
        message: `User ${action} successfully`,
        user: new UserResponseDto(
          updatedUser._id.toString(),
          updatedUser.name,
          updatedUser.email,
          updatedUser.role,
          updatedUser.isActive,
          updatedUser.createdAt
        )
      });
    } catch (error) {
      console.error('Update user status error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
