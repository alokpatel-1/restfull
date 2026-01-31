import { UserModel, IUser } from './user.model';
import { CreateUserDto } from './user.dto';

export class UserDao {
    async createUser(userData: CreateUserDto): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async updateUserById(userId: string, updateData: Partial<CreateUserDto>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async deleteUserById(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(userId);
    }
}
