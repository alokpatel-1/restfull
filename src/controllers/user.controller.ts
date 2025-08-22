import { Request, Response } from 'express';
import { UserDao } from '../daos/user.dao';
import { UpdateUserDto, UpdatePasswordDto, UserResponseDto } from '../dtos/user.dto';

export class UserController {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Update user information
   */
  updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const updateData: UpdateUserDto = req.body;
      
      // Update user
      const updatedUser = await this.userDao.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return updated user data
      return res.status(200).json({
        message: 'User updated successfully',
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
      console.error('Update user error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Update user password
   */
  updatePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { currentPassword, newPassword }: UpdatePasswordDto = req.body;
      
      // Get user
      const user = await this.userDao.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      await this.userDao.updatePassword(userId, newPassword);

      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update password error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Get user profile
   */
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

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
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
