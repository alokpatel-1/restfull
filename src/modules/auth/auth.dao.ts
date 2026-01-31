import { UserModel, IUser } from '../user/user.model';
import { RegisterDto } from './auth.dto';
import { RefreshTokenModel, IRefreshToken } from './refresh-token.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export class AuthDao {
    async createUser(userData: RegisterDto): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = new UserModel({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        });

        return await user.save();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<IRefreshToken> {
        const refreshToken = new RefreshTokenModel({
            userId: new mongoose.Types.ObjectId(userId),
            token,
            expiresAt,
        });

        return await refreshToken.save();
    }

    async findRefreshToken(token: string): Promise<IRefreshToken | null> {
        return await RefreshTokenModel.findOne({ token });
    }

    async deleteRefreshToken(token: string): Promise<void> {
        await RefreshTokenModel.deleteOne({ token });
    }

    async deleteAllRefreshTokensForUser(userId: string): Promise<void> {
        await RefreshTokenModel.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
    }
}
