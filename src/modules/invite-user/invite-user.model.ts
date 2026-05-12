import mongoose, { Document, Schema } from 'mongoose';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

/** Self = shop admin requests invite (email → set-password link → then registers shop). ShopInvite = shop admin invites seller/shop manager for a specific shop. */
export type InvitationType = 'self' | 'shop_invite';

export interface IInvitation extends Document {
    email: string;
    type: InvitationType;
    role?: mongoose.Types.ObjectId;
    invitedBy?: mongoose.Types.ObjectId;
    shop?: mongoose.Types.ObjectId;
    token: string;
    tokenExpiresAt: Date;
    status: InvitationStatus;
    acceptedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['self', 'shop_invite'],
            required: true,
            default: 'self',
            index: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
        },
        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        tokenExpiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'expired', 'cancelled'],
            default: 'pending',
            index: true,
        },
        acceptedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const InvitationModel = mongoose.model<IInvitation>('Invitation', invitationSchema);
