import { Request, Response, NextFunction } from 'express';
import { InviteUserService } from './invite-user.service';

export class InviteUserController {
    private inviteUserService: InviteUserService;

    constructor() {
        this.inviteUserService = new InviteUserService();
    }

    /** Self-invitation: only email in body. No role, invitedBy, or shop → type is self. */
    createSelfInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.body;
            const invitation = await this.inviteUserService.createInvitation({
                type: 'self',
                email,
            });
            res.status(201).json({ success: invitation?.success, message: invitation?.message });
        } catch (error) {
            const err = error as Error & { code?: string };
            if (err.code === 'EMAIL_ALREADY_USER') {
                res.status(400).json({ success: false, message: err.message });
                return;
            }
            next(error);
        }
    };

    /** Seller/shop invitation: email, roleId, shopId in body; invitedBy from req.user → type is shop_invite. */
    createShopInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, roleId, shopId, name = '' } = req.body;
            const invitedByUserId = req.user?._id?.toString?.();
            const invitation = await this.inviteUserService.createInvitation({
                type: 'shop_invite',
                email,
                roleId,
                shopId,
                name,
                invitedByUserId: invitedByUserId ?? undefined,
            });
            res.status(201).json({ success: true, message: 'Invitation sent successfully!', data: invitation });
        } catch (error) {
            const err = error as Error & { code?: string };
            if (err.code === 'EMAIL_ALREADY_USER') {
                res.status(400).json({ success: false, message: err.message });
                return;
            }
            next(error);
        }
    };

    /** Verify invitation token (query or body). Returns valid, email, type, roleId, shopId when valid. */
    verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = (req.query.token as string) || req.body?.token;
            if (!token) {
                res.status(400).json({ valid: false, message: 'Token is required' });
                return;
            }
            const result = await this.inviteUserService.verifyToken(token);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    /** Accept invite: set password, create user, mark invitation accepted. */
    acceptInvite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token, password, name } = req.body;
            const result = await this.inviteUserService.acceptInvite({ token, password, name });
            if (!result.success) {
                res.status(400).json({ success: false, message: result.message });
                return;
            }
            res.status(201).json({ success: true, message: result.message, data: { userId: result.userId } });
        } catch (error) {
            next(error);
        }
    };

    /** List pending invitations with pagination. */
    listPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const skip = Math.max(0, parseInt(String(req.query.skip), 10) || 0);
            const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit), 10) || 20));
            const data = await this.inviteUserService.listPendingInvitations(skip, limit);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    /** Cancel a pending invitation. */
    cancelInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.inviteUserService.cancelInvitation(id);
            if (!result.success) {
                res.status(400).json({ success: false, message: result.message });
                return;
            }
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            next(error);
        }
    };

    /** Resend invitation: new token and expiry; email can be sent by caller or background job. */
    resendInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.inviteUserService.resendInvitation(id);
            if (!result.success) {
                res.status(400).json({ success: false, message: result.message });
                return;
            }
            res.status(200).json({ success: true, message: result.message, data: result.data });
        } catch (error) {
            next(error);
        }
    };
}
