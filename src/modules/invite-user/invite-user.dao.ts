import mongoose from 'mongoose';
import { InvitationModel, IInvitation, InvitationType } from './invite-user.model';

const TOKEN_EXPIRY_DAYS = 2;

export class InviteUserDao {
    getTokenExpiresAt(): Date {
        const d = new Date();
        d.setDate(d.getDate() + TOKEN_EXPIRY_DAYS);
        return d;
    }

    create = async (data: {
        type: InvitationType;
        email: string;
        roleId?: string;
        shopId?: string;
        invitedByUserId?: string;
        token: string;
    }): Promise<IInvitation> => {
        const tokenExpiresAt = this.getTokenExpiresAt();
        const doc: Record<string, unknown> = {
            type: data.type,
            email: data.email.toLowerCase().trim(),
            token: data.token,
            tokenExpiresAt,
            status: 'pending',
        };
        if (data.roleId) doc.role = new mongoose.Types.ObjectId(data.roleId);
        if (data.shopId) doc.shop = new mongoose.Types.ObjectId(data.shopId);
        if (data.invitedByUserId) doc.invitedBy = new mongoose.Types.ObjectId(data.invitedByUserId);
        return await InvitationModel.create(doc);
    };

    findByToken = async (token: string) => {
        return await InvitationModel.findOne({ token }).populate('role', 'name').exec();
    };

    findPendingByEmail = async (email: string): Promise<IInvitation | null> => {
        return await InvitationModel.findOne({
            email: email.toLowerCase().trim(),
            status: 'pending',
            tokenExpiresAt: { $gt: new Date() },
        })
            .populate('role', 'name')
            .exec();
    };

    findById = async (id: string): Promise<IInvitation | null> => {
        return await InvitationModel.findById(id).populate('role', 'name').exec();
    };

    listPending = async (skip: number, limit: number) => {
        return await InvitationModel.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('role', 'name')
            .populate('invitedBy', 'name email')
            .lean()
            .exec();
    };

    updateStatus = async (id: string, status: 'accepted' | 'cancelled' | 'expired', acceptedAt?: Date): Promise<IInvitation | null> => {
        const update: Record<string, unknown> = { status };
        if (acceptedAt) update.acceptedAt = acceptedAt;
        return await InvitationModel.findByIdAndUpdate(id, update, { new: true }).exec();
    };

    updateTokenAndExpiry = async (id: string, token: string, tokenExpiresAt: Date): Promise<IInvitation | null> => {
        return await InvitationModel.findByIdAndUpdate(id, { token, tokenExpiresAt }, { new: true }).exec();
    };

    findPendingInvitationByEmail = async (email: string): Promise<IInvitation | null> => {
        return await InvitationModel.findOne({ email: email.toLowerCase().trim(), status: 'pending' }).exec();
    };
}
