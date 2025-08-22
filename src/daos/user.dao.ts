import { User, IUser } from '../models/user.schema';
import { RegisterDto } from '../dtos/auth.dto';

export class UserDao {
  /**
   * Create a new user
   * @param userData User data from RegisterDto
   * @returns Created user document
   */
  async create(userData: RegisterDto): Promise<IUser> {
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    
    return await user.save();
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
}
