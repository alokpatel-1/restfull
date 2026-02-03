import { UserModel, IUser } from '../user/user.model';
import { RoleModel, IRole } from '../role/role.model';
import { RegisterDto } from './auth.dto';
import { RefreshTokenModel, IRefreshToken } from './refresh-token.model';
import { GetRolesAndPermissionsResult, RoleDetailResult } from './auth.types';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export class AuthDao {
    async createUser(userData: RegisterDto): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        let roleIds: mongoose.Types.ObjectId[];
        if (userData.role && userData.role.length > 0) {
            roleIds = userData.role.map((id) => new mongoose.Types.ObjectId(id));
        } else {
            const defaultRole = await this.findRoleByName('USER');
            roleIds = defaultRole ? [defaultRole._id] : [];
        }

        const user = new UserModel({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: roleIds,
        });

        return await user.save();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async findRoleByName(name: string): Promise<IRole | null> {
        return await RoleModel.findOne({ name: name.toUpperCase() });
    }

    async updateUserRole(userId: string, roleIds: string[]): Promise<void> {
        const objectIds = roleIds.map((id) => new mongoose.Types.ObjectId(id));
        await UserModel.findByIdAndUpdate(userId, { role: objectIds });
    }

    async getRolesAndPermissions(userId: string): Promise<GetRolesAndPermissionsResult> {
        const user = await UserModel.findById(userId)
            .populate<{ role: IRole[] }>('role')
            .select('role customPermissions')
            .lean();

        if (!user) {
            return { roleDetails: [], permissions: [] };
        }

        const roles = user.role || [];
        const roleDetails: RoleDetailResult[] = roles
            .filter((r): r is IRole => r && typeof r === 'object' && 'name' in r)
            .map((r) => ({ id: r._id.toString(), name: r.name }));

        const rolePerms = roles
            .filter((r): r is IRole => r && typeof r === 'object' && 'permissions' in r)
            .flatMap((r) => r.permissions || []);
        const customPerms = user.customPermissions || [];
        const permissions = [...new Set([...customPerms, ...rolePerms])];

        return { roleDetails, permissions };
    }

    async updateUserEmailVerificationToken(
        userId: string,
        token: string,
        expiresAt: Date
    ): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            emailVerificationToken: token,
            emailVerificationExpires: expiresAt,
        });
    }

    async findUserByEmailVerificationToken(token: string): Promise<IUser | null> {
        return await UserModel.findOne({ emailVerificationToken: token }).select(
            '+emailVerificationToken +emailVerificationExpires'
        );
    }

    async setUserEmailVerified(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            $set: { emailVerified: true },
            $unset: { emailVerificationToken: '', emailVerificationExpires: '' },
        });
    }

    async updateUserPasswordResetToken(
        userId: string,
        hashedToken: string,
        expiresAt: Date
    ): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            passwordResetToken: hashedToken,
            passwordResetExpires: expiresAt,
        });
    }

    async findUserByPasswordResetToken(hashedToken: string): Promise<IUser | null> {
        return await UserModel.findOne({ passwordResetToken: hashedToken }).select(
            '+passwordResetToken +passwordResetExpires'
        );
    }

    async clearUserPasswordReset(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            $unset: { passwordResetToken: '', passwordResetExpires: '' },
        });
    }

    async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });
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
