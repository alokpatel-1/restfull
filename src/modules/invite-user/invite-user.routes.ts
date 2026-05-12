import { Router } from 'express';
import { validateWith } from '../../middleware/validation.middleware';
import { InviteUserController } from './invite-user.controller';
import {
    acceptInviteValidator,
    selfInviteValidator,
    shopInviteValidator,
    validateTokenQueryValidator,
    validateTokenBodyValidator,
} from './invite-user.validator';

const router = Router();
const inviteUserController = new InviteUserController();

/** Self-invitation: only email. No role, invitedBy, or shop in payload → type is self. */
router.post('/self', ...validateWith(selfInviteValidator), inviteUserController.createSelfInvitation);

/** Seller/shop account invitation: email, roleId, shopId. invitedBy from req.user → type is shop_invite. */
router.post('/seller', ...validateWith(shopInviteValidator), inviteUserController.createShopInvitation);

/** Verify invitation token (query or body). Returns valid, email, type, roleId, shopId when valid. */
router.get('/validate', ...validateWith(validateTokenQueryValidator), inviteUserController.verifyToken);
router.post('/validate', ...validateWith(validateTokenBodyValidator), inviteUserController.verifyToken);

/** Accept invite: token + password (+ optional name). Creates user and marks invitation accepted. */
router.post('/accept', ...validateWith(acceptInviteValidator), inviteUserController.acceptInvite);

/** List pending invitations (paginated). */
router.get('/', inviteUserController.listPending);

/** Cancel a pending invitation. */
router.delete('/:id', inviteUserController.cancelInvitation);

/** Resend invitation: new token and expiry for the given invitation id. */
router.post('/:id/resend', inviteUserController.resendInvitation);

export default router;
