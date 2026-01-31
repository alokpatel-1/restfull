

import { UserDao } from './user.dao';
import { UserResponseDto } from './user.dto';

export class UserService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async getUserById(userId: string): Promise<UserResponseDto | null> {
    const user = await this.userDao.findUserById(userId);

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
