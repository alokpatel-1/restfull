import { User, IUser, UserRole } from '../models/user.schema';
import { RegisterUserDto, RegisterAdminDto } from '../dtos/auth.dto';
import { UpdateUserDto, UpdatePasswordDto } from '../dtos/user.dto';

export class UserDao {
  /**
   * Create a new regular user
   * @param userData User data from RegisterUserDto
   * @returns Created user document
   */
  async createUser(userData: RegisterUserDto): Promise<IUser> {
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isActive: userData.isActive,
      role: UserRole.USER
    });
    
    return await user.save();
  }

  /**
   * Create a new admin user
   * @param userData Admin data from RegisterAdminDto
   * @returns Created admin document
   */
  async createAdmin(userData: RegisterAdminDto): Promise<IUser> {
    const admin = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isActive: userData.isActive,
      role: UserRole.ADMIN
    });
    
    return await admin.save();
  }

  /**
   * Find a user by email
   * @param email User email
   * @returns User document or null if not found
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @returns User document or null if not found
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Check if a user with given email exists
   * @param email User email
   * @returns Boolean indicating if user exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }

  /**
   * Update user information
   * @param userId User ID
   * @param updateData Data to update
   * @returns Updated user document or null if not found
   */
  async updateUser(userId: string, updateData: UpdateUserDto): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { 
        $set: {
          name: updateData.name
        } 
      },
      { new: true }
    );
  }

  /**
   * Update user password
   * @param userId User ID
   * @param newPassword New hashed password
   * @returns Updated user document or null if not found
   */
  async updatePassword(userId: string, newPassword: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) return null;
    
    user.password = newPassword;
    return await user.save(); // This will trigger the password hashing pre-save hook
  }

  /**
   * Update user active status (block/unblock)
   * @param userId User ID
   * @param isActive New active status
   * @returns Updated user document or null if not found
   */
  async updateActiveStatus(userId: string, isActive: boolean): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { isActive } },
      { new: true }
    );
  }

  /**
   * Get all users
   * @returns Array of all users
   */
  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }
}