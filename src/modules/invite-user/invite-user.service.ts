import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { envConfig } from '../../config/env.config';
import { Role } from '../../constants/openMart.constants';
import { mailService } from '../../services/mail.service';
import { AuthDao } from '../auth/auth.dao';
import { RoleDao } from '../role/role.dao';
import { CreateInvitationParams } from './invite-user.dto';
import type { AcceptInviteDto, InvitationResponseDto, ValidateTokenResponseDto } from './invite-user.dto';
import { InviteUserDao } from './invite-user.dao';

const INVITATION_TOKEN_EXPIRES_IN = '2d';

export class InviteUserService {
    private inviteUserDao: InviteUserDao;
    private roleDao: RoleDao;
    private authDao: AuthDao;

    constructor() {
        this.inviteUserDao = new InviteUserDao();
        this.roleDao = new RoleDao();
        this.authDao = new AuthDao();
    }

    createInvitation = async (params: CreateInvitationParams): Promise<any> => {
        try {
            const { type, email, roleId, shopId, name, invitedByUserId } = params;
            const normalizedEmail = email.toLowerCase().trim();

            const isPendingInvitation = await this.inviteUserDao.findPendingInvitationByEmail(normalizedEmail);

            let resolvedRoleId: string | undefined = roleId;
            if (type === 'self' && !roleId) {
                const roles = await this.roleDao.getAllRoles();
                const adminRole = roles.find((r) => r.name === Role.ADMIN);
                resolvedRoleId = adminRole?._id?.toString();
            }

            const tokenPayload: Record<string, unknown> = {
                email: normalizedEmail,
                type,
            };
            if (resolvedRoleId) tokenPayload.roleId = resolvedRoleId;
            if (shopId) tokenPayload.shopId = shopId;
            if (name) tokenPayload.name = name;

            const token = jwt.sign(
                tokenPayload,
                envConfig.JWT_SECRET,
                { expiresIn: INVITATION_TOKEN_EXPIRES_IN }
            );

            if (isPendingInvitation && isPendingInvitation.token?.length > 0) {
                return await this.resendInvitation(isPendingInvitation._id.toString());
            }

            const invitationData = {
                type,
                email: normalizedEmail,
                roleId: resolvedRoleId,
                shopId,
                invitedByUserId: invitedByUserId ?? undefined,
                token,
            }
            await this.inviteUserDao.create(invitationData);

            await mailService.sendInvitationEmail(invitationData.email, invitationData.token, invitationData.type as 'self' | 'shop_invite', name);

            return { success: true, message: 'Invitation sent successfully!' };

        } catch (error) {
            return { success: false, message: 'Failed to create invitation', error: error instanceof Error ? error.message : error };
        }
    };

    createInvitationToken = (email: string, type: 'self' | 'shop_invite', roleId?: string, shopId?: string, name?: string): string => {
        const payload: Record<string, unknown> = { email: email.toLowerCase().trim(), type };
        if (roleId) payload.roleId = roleId;
        if (shopId) payload.shopId = shopId;
        if (name) payload.name = name;
        return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: INVITATION_TOKEN_EXPIRES_IN });
    };

    /** Verify invitation token: decode JWT and ensure invitation exists and is pending. */
    verifyToken = async (token: string): Promise<ValidateTokenResponseDto> => {
        let decoded: { email?: string; type?: 'self' | 'shop_invite'; roleId?: string; shopId?: string; name?: string; exp?: number };
        try {
            decoded = jwt.verify(token, envConfig.JWT_SECRET) as typeof decoded;
        } catch {
            return { valid: false, message: 'Invalid or expired token' };
        }

        const invitation = await this.inviteUserDao.findByToken(token);
        if (!invitation) {
            return { valid: false, message: 'Invitation not found' };
        }
        const inv = invitation as unknown as {
            status: string;
            email: string;
            type: string;
            tokenExpiresAt: Date;
            role?: { _id: mongoose.Types.ObjectId; name: string };
            shop?: mongoose.Types.ObjectId;
        };
        if (inv.status !== 'pending') {
            return { valid: false, message: 'Invitation is no longer valid' };
        }
        if (inv.tokenExpiresAt && new Date(inv.tokenExpiresAt) < new Date()) {
            return { valid: false, message: 'Invitation has expired' };
        }

        const roleId = inv.role?._id?.toString?.() ?? decoded.roleId;
        const roleName = inv.role?.name;
        const shopId = inv.shop?.toString?.() ?? decoded.shopId;

        return {
            valid: true,
            email: decoded.email ?? inv.email,
            type: (decoded.type ?? inv.type) as 'self' | 'shop_invite',
            roleId: roleId ?? undefined,
            roleName,
            shopId: shopId ?? undefined,
            tokenExpiresAt: inv.tokenExpiresAt,
        };
    };

    listPendingInvitations = async (skip: number, limit: number): Promise<InvitationResponseDto[]> => {
        const list = await this.inviteUserDao.listPending(skip, limit);
        return (list as unknown as Array<Record<string, unknown> & { _id: mongoose.Types.ObjectId; email: string; type: string; status: string; tokenExpiresAt: Date; createdAt: Date; role?: { _id: mongoose.Types.ObjectId; name: string }; shop?: mongoose.Types.ObjectId }>).map((inv) => ({
            id: inv._id.toString(),
            type: inv.type as 'self' | 'shop_invite',
            email: inv.email,
            roleId: inv.role?._id?.toString?.(),
            roleName: inv.role?.name,
            shopId: inv.shop?.toString?.(),
            status: inv.status,
            tokenExpiresAt: inv.tokenExpiresAt,
            createdAt: inv.createdAt,
        }));
    };

    cancelInvitation = async (id: string): Promise<{ success: boolean; message: string }> => {
        const invitation = await this.inviteUserDao.findById(id);
        if (!invitation) {
            return { success: false, message: 'Invitation not found' };
        }
        if (invitation.status !== 'pending') {
            return { success: false, message: 'Invitation is no longer pending' };
        }
        await this.inviteUserDao.updateStatus(id, 'cancelled');
        return { success: true, message: 'Invitation cancelled' };
    };

    resendInvitation = async (id: string): Promise<{ success: boolean; message: string; data?: { id: string; email: string; tokenExpiresAt: Date } }> => {
        const invitation = await this.inviteUserDao.findById(id);
        if (!invitation) {
            return { success: false, message: 'Invitation not found' };
        }
        const inv = invitation as unknown as { status: string; email: string; type: string; role?: { _id: mongoose.Types.ObjectId }; shop?: mongoose.Types.ObjectId };
        if (inv.status !== 'pending') {
            return { success: false, message: 'Only pending invitations can be resent' };
        }
        const newToken = jwt.sign(
            {
                email: inv.email,
                type: inv.type,
                ...(inv.role?._id && { roleId: inv.role._id.toString() }),
                ...(inv.shop && { shopId: inv.shop.toString() }),
            },
            envConfig.JWT_SECRET,
            { expiresIn: INVITATION_TOKEN_EXPIRES_IN }
        );
        const tokenExpiresAt = this.inviteUserDao.getTokenExpiresAt();
        const updated = await this.inviteUserDao.updateTokenAndExpiry(id, newToken, tokenExpiresAt);
        if (!updated) {
            return { success: false, message: 'Failed to update invitation' };
        }
        try {
            await mailService.sendInvitationEmail(inv.email, newToken, inv.type as 'self' | 'shop_invite');
        } catch (err) {
            console.error('Resend invitation email failed:', err instanceof Error ? err.message : err);
        }
        return {
            success: true,
            message: 'Invitation resent',
            data: { id: updated._id.toString(), email: updated.email, tokenExpiresAt: updated.tokenExpiresAt },
        };
    };

    acceptInvite = async (dto: AcceptInviteDto): Promise<{ success: boolean; message: string; userId?: string }> => {
        const verifyResult = await this.verifyToken(dto.token);
        if (!verifyResult.valid || !verifyResult.email) {
            return { success: false, message: verifyResult.message ?? 'Invalid or expired token' };
        }
        const invitation = await this.inviteUserDao.findByToken(dto.token);
        if (!invitation) {
            return { success: false, message: 'Invitation not found' };
        }
        const inv = invitation as unknown as { status: string; email: string; type: string; role?: { _id: mongoose.Types.ObjectId }; _id: mongoose.Types.ObjectId };
        if (inv.status !== 'pending') {
            return { success: false, message: 'Invitation is no longer valid' };
        }
        const existingUser = await this.authDao.findUserByEmail(inv.email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }
        const roleIds = inv.role?._id ? [inv.role._id.toString()] : [];
        const user = await this.authDao.createUser({
            name: dto.name?.trim() || inv.email.split('@')[0],
            email: inv.email,
            password: dto.password,
            role: roleIds.length > 0 ? roleIds : undefined,
        });
        // Email is already verified — the user proved ownership by clicking the invite link
        await this.authDao.setUserEmailVerified(user._id.toString());
        await this.inviteUserDao.updateStatus(inv._id.toString(), 'accepted', new Date());
        return { success: true, message: 'Account created successfully', userId: user._id.toString() };
    };
}
