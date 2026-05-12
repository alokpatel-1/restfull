export interface InviteUserDto {
    email: string;
    roleId?: string;
    name?: string;
}

/** Params for creating an invitation. Self: email only. Shop-invite: email, roleId, shopId, invitedByUserId. */
export interface CreateInvitationParams {
    type: 'self' | 'shop_invite';
    email: string;
    roleId?: string;
    shopId?: string;
    name?: string;
    invitedByUserId?: string;
}

export interface ValidateTokenDto {
    token: string;
}

export interface AcceptInviteDto {
    token: string;
    password: string;
    name?: string;
}

export interface InvitationResponseDto {
    id: string;
    type: 'self' | 'shop_invite';
    email: string;
    roleId?: string;
    roleName?: string;
    shopId?: string;
    status: string;
    tokenExpiresAt: Date;
    createdAt: Date;
}

export interface ValidateTokenResponseDto {
    valid: boolean;
    email?: string;
    type?: 'self' | 'shop_invite';
    roleId?: string;
    roleName?: string;
    shopId?: string;
    tokenExpiresAt?: Date;
    message?: string;
}
