/**
 * OpenMart RBAC constants
 * ========================
 *
 * Permission format: <domain>.<resource>.<action>.<scope>
 *
 * DOMAIN (who this permission applies to):
 *   user   – customer / buyer
 *   seller – merchant / store owner
 *   admin  – platform moderator
 *   super  – system-level control
 *
 * RESOURCE (e-commerce entity): product, order, cart, payment, inventory,
 *   report, user, invoice, profile, etc.
 *
 * ACTION (verb): create, view, update, delete, manage, approve, cancel,
 *   return, process, assign, block, etc.
 *
 * SCOPE:
 *   me  – user's own data (e.g. my orders, my cart)
 *   own – resource owned by the seller (e.g. my store's products)
 *   any – platform-wide (admin/super can act on any entity)
 *
 * Rules: dot-notation only; no duplicates; no UI-only permissions;
 * all permissions must be backend-enforceable and production-ready.
 */

/**
 * Role names used for role-based access control. Must match DB role names.
 */
export enum Role {
  USER = 'USER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/**
 * Permissions in dot-notation: domain.resource.action.scope
 * Use in API checks (e.g. middleware, guards) for RBAC.
 */
export enum Permission {
  // ─── USER (customer), scope: me / any ─────────────────────────────────
  USER_PRODUCT_VIEW_ANY = 'user.product.view.any',
  USER_CART_VIEW_ME = 'user.cart.view.me',
  USER_CART_CREATE_ME = 'user.cart.create.me',
  USER_CART_UPDATE_ME = 'user.cart.update.me',
  USER_CART_DELETE_ME = 'user.cart.delete.me',
  USER_ORDER_CREATE_ME = 'user.order.create.me',
  USER_ORDER_VIEW_ME = 'user.order.view.me',
  USER_ORDER_CANCEL_ME = 'user.order.cancel.me',
  USER_ORDER_RETURN_ME = 'user.order.return.me',
  USER_PAYMENT_CREATE_ME = 'user.payment.create.me',
  USER_PAYMENT_VIEW_ME = 'user.payment.view.me',
  USER_INVOICE_VIEW_ME = 'user.invoice.view.me',
  USER_INVOICE_DOWNLOAD_ME = 'user.invoice.download.me',
  USER_PROFILE_VIEW_ME = 'user.profile.view.me',
  USER_PROFILE_UPDATE_ME = 'user.profile.update.me',
  USER_ADDRESS_VIEW_ME = 'user.address.view.me',
  USER_ADDRESS_MANAGE_ME = 'user.address.manage.me',
  USER_REVIEW_CREATE_ME = 'user.review.create.me',
  USER_REVIEW_VIEW_ME = 'user.review.view.me',
  USER_REVIEW_UPDATE_ME = 'user.review.update.me',
  USER_REVIEW_DELETE_ME = 'user.review.delete.me',
  USER_COUPON_APPLY_ME = 'user.coupon.apply.me',
  USER_WALLET_VIEW_ME = 'user.wallet.view.me',
  USER_WALLET_USE_ME = 'user.wallet.use.me',
  USER_SUPPORT_CONTACT_ME = 'user.support.contact.me',

  // ─── SELLER, scope: own ──────────────────────────────────────────────
  SELLER_DASHBOARD_VIEW_OWN = 'seller.dashboard.view.own',
  SELLER_PRODUCT_CREATE_OWN = 'seller.product.create.own',
  SELLER_PRODUCT_VIEW_OWN = 'seller.product.view.own',
  SELLER_PRODUCT_UPDATE_OWN = 'seller.product.update.own',
  SELLER_PRODUCT_DELETE_OWN = 'seller.product.delete.own',
  SELLER_INVENTORY_VIEW_OWN = 'seller.inventory.view.own',
  SELLER_INVENTORY_UPDATE_OWN = 'seller.inventory.update.own',
  SELLER_ORDER_VIEW_OWN = 'seller.order.view.own',
  SELLER_ORDER_UPDATE_OWN = 'seller.order.update.own',
  SELLER_SHIPPING_PRINT_OWN = 'seller.shipping.print.own',
  SELLER_INVOICE_GENERATE_OWN = 'seller.invoice.generate.own',
  SELLER_RETURN_MANAGE_OWN = 'seller.return.manage.own',
  SELLER_QUERY_RESPOND_OWN = 'seller.query.respond.own',
  SELLER_REPORT_SALES_VIEW_OWN = 'seller.report.sales.view.own',
  SELLER_REPORT_SETTLEMENT_VIEW_OWN = 'seller.report.settlement.view.own',
  SELLER_PROFILE_VIEW_OWN = 'seller.profile.view.own',
  SELLER_PROFILE_UPDATE_OWN = 'seller.profile.update.own',
  SELLER_BANK_UPDATE_OWN = 'seller.bank.update.own',

  // ─── ADMIN, scope: any ─────────────────────────────────────────────────
  ADMIN_DASHBOARD_VIEW_ANY = 'admin.dashboard.view.any',
  ADMIN_USER_VIEW_ANY = 'admin.user.view.any',
  ADMIN_USER_MANAGE_ANY = 'admin.user.manage.any',
  ADMIN_USER_BLOCK_ANY = 'admin.user.block.any',
  ADMIN_ROLE_ASSIGN_ANY = 'admin.role.assign.any',
  ADMIN_SELLER_VIEW_ANY = 'admin.seller.view.any',
  ADMIN_SELLER_APPROVE_ANY = 'admin.seller.approve.any',
  ADMIN_SELLER_SUSPEND_ANY = 'admin.seller.suspend.any',
  ADMIN_PRODUCT_VIEW_ANY = 'admin.product.view.any',
  ADMIN_PRODUCT_APPROVE_ANY = 'admin.product.approve.any',
  ADMIN_PRODUCT_REMOVE_ANY = 'admin.product.remove.any',
  ADMIN_ORDER_VIEW_ANY = 'admin.order.view.any',
  ADMIN_ORDER_UPDATE_ANY = 'admin.order.update.any',
  ADMIN_REFUND_PROCESS_ANY = 'admin.refund.process.any',
  ADMIN_CATEGORY_MANAGE_ANY = 'admin.category.manage.any',
  ADMIN_BRAND_MANAGE_ANY = 'admin.brand.manage.any',
  ADMIN_ATTRIBUTE_MANAGE_ANY = 'admin.attribute.manage.any',
  ADMIN_COUPON_MANAGE_ANY = 'admin.coupon.manage.any',
  ADMIN_DISCOUNT_MANAGE_ANY = 'admin.discount.manage.any',
  ADMIN_OFFER_MANAGE_ANY = 'admin.offer.manage.any',
  ADMIN_REPORT_VIEW_ANY = 'admin.report.view.any',
  ADMIN_REPORT_FINANCIAL_VIEW_ANY = 'admin.report.financial.view.any',
  ADMIN_REPORT_TAX_VIEW_ANY = 'admin.report.tax.view.any',
  ADMIN_CONTENT_MANAGE_ANY = 'admin.content.manage.any',
  ADMIN_BANNER_MANAGE_ANY = 'admin.banner.manage.any',
  ADMIN_PAGE_MANAGE_ANY = 'admin.page.manage.any',
  ADMIN_SETTINGS_MANAGE_ANY = 'admin.settings.manage.any',
  ADMIN_NOTIFICATION_MANAGE_ANY = 'admin.notification.manage.any',

  // ─── SUPER_ADMIN, scope: any ──────────────────────────────────────────
  SUPER_DASHBOARD_VIEW_ANY = 'super.dashboard.view.any',
  SUPER_USER_MANAGE_ANY = 'super.user.manage.any',
  SUPER_ROLE_MANAGE_ANY = 'super.role.manage.any',
  SUPER_PERMISSION_MANAGE_ANY = 'super.permission.manage.any',
  SUPER_SELLER_MANAGE_ANY = 'super.seller.manage.any',
  SUPER_PRODUCT_MANAGE_ANY = 'super.product.manage.any',
  SUPER_ORDER_MANAGE_ANY = 'super.order.manage.any',
  SUPER_ADMIN_MANAGE_ANY = 'super.admin.manage.any',
  SUPER_CONFIG_MANAGE_ANY = 'super.config.manage.any',
  SUPER_AUDIT_VIEW_ANY = 'super.audit.view.any',
  SUPER_EMERGENCY_ACCESS_ANY = 'super.emergency.access.any',
}

/**
 * Permissions grouped by role. Use for "what can this role do?" or seeding.
 */
export const PERMISSIONS_BY_ROLE: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.USER_PRODUCT_VIEW_ANY,
    Permission.USER_CART_VIEW_ME,
    Permission.USER_CART_CREATE_ME,
    Permission.USER_CART_UPDATE_ME,
    Permission.USER_CART_DELETE_ME,
    Permission.USER_ORDER_CREATE_ME,
    Permission.USER_ORDER_VIEW_ME,
    Permission.USER_ORDER_CANCEL_ME,
    Permission.USER_ORDER_RETURN_ME,
    Permission.USER_PAYMENT_CREATE_ME,
    Permission.USER_PAYMENT_VIEW_ME,
    Permission.USER_INVOICE_VIEW_ME,
    Permission.USER_INVOICE_DOWNLOAD_ME,
    Permission.USER_PROFILE_VIEW_ME,
    Permission.USER_PROFILE_UPDATE_ME,
    Permission.USER_ADDRESS_VIEW_ME,
    Permission.USER_ADDRESS_MANAGE_ME,
    Permission.USER_REVIEW_CREATE_ME,
    Permission.USER_REVIEW_VIEW_ME,
    Permission.USER_REVIEW_UPDATE_ME,
    Permission.USER_REVIEW_DELETE_ME,
    Permission.USER_COUPON_APPLY_ME,
    Permission.USER_WALLET_VIEW_ME,
    Permission.USER_WALLET_USE_ME,
    Permission.USER_SUPPORT_CONTACT_ME,
  ],
  [Role.SELLER]: [
    Permission.SELLER_DASHBOARD_VIEW_OWN,
    Permission.SELLER_PRODUCT_CREATE_OWN,
    Permission.SELLER_PRODUCT_VIEW_OWN,
    Permission.SELLER_PRODUCT_UPDATE_OWN,
    Permission.SELLER_PRODUCT_DELETE_OWN,
    Permission.SELLER_INVENTORY_VIEW_OWN,
    Permission.SELLER_INVENTORY_UPDATE_OWN,
    Permission.SELLER_ORDER_VIEW_OWN,
    Permission.SELLER_ORDER_UPDATE_OWN,
    Permission.SELLER_SHIPPING_PRINT_OWN,
    Permission.SELLER_INVOICE_GENERATE_OWN,
    Permission.SELLER_RETURN_MANAGE_OWN,
    Permission.SELLER_QUERY_RESPOND_OWN,
    Permission.SELLER_REPORT_SALES_VIEW_OWN,
    Permission.SELLER_REPORT_SETTLEMENT_VIEW_OWN,
    Permission.SELLER_PROFILE_VIEW_OWN,
    Permission.SELLER_PROFILE_UPDATE_OWN,
    Permission.SELLER_BANK_UPDATE_OWN,
  ],
  [Role.ADMIN]: [
    Permission.ADMIN_DASHBOARD_VIEW_ANY,
    Permission.ADMIN_USER_VIEW_ANY,
    Permission.ADMIN_USER_MANAGE_ANY,
    Permission.ADMIN_USER_BLOCK_ANY,
    Permission.ADMIN_ROLE_ASSIGN_ANY,
    Permission.ADMIN_SELLER_VIEW_ANY,
    Permission.ADMIN_SELLER_APPROVE_ANY,
    Permission.ADMIN_SELLER_SUSPEND_ANY,
    Permission.ADMIN_PRODUCT_VIEW_ANY,
    Permission.ADMIN_PRODUCT_APPROVE_ANY,
    Permission.ADMIN_PRODUCT_REMOVE_ANY,
    Permission.ADMIN_ORDER_VIEW_ANY,
    Permission.ADMIN_ORDER_UPDATE_ANY,
    Permission.ADMIN_REFUND_PROCESS_ANY,
    Permission.ADMIN_CATEGORY_MANAGE_ANY,
    Permission.ADMIN_BRAND_MANAGE_ANY,
    Permission.ADMIN_ATTRIBUTE_MANAGE_ANY,
    Permission.ADMIN_COUPON_MANAGE_ANY,
    Permission.ADMIN_DISCOUNT_MANAGE_ANY,
    Permission.ADMIN_OFFER_MANAGE_ANY,
    Permission.ADMIN_REPORT_VIEW_ANY,
    Permission.ADMIN_REPORT_FINANCIAL_VIEW_ANY,
    Permission.ADMIN_REPORT_TAX_VIEW_ANY,
    Permission.ADMIN_CONTENT_MANAGE_ANY,
    Permission.ADMIN_BANNER_MANAGE_ANY,
    Permission.ADMIN_PAGE_MANAGE_ANY,
    Permission.ADMIN_SETTINGS_MANAGE_ANY,
    Permission.ADMIN_NOTIFICATION_MANAGE_ANY,
  ],
  [Role.SUPER_ADMIN]: [
    Permission.SUPER_DASHBOARD_VIEW_ANY,
    Permission.SUPER_USER_MANAGE_ANY,
    Permission.SUPER_ROLE_MANAGE_ANY,
    Permission.SUPER_PERMISSION_MANAGE_ANY,
    Permission.SUPER_SELLER_MANAGE_ANY,
    Permission.SUPER_PRODUCT_MANAGE_ANY,
    Permission.SUPER_ORDER_MANAGE_ANY,
    Permission.SUPER_ADMIN_MANAGE_ANY,
    Permission.SUPER_CONFIG_MANAGE_ANY,
    Permission.SUPER_AUDIT_VIEW_ANY,
    Permission.SUPER_EMERGENCY_ACCESS_ANY,
  ],
};

/** All permission values as a readonly array for iteration / "includes" checks. */
export const ALL_PERMISSIONS: readonly string[] = Object.values(Permission);

/** Type for any valid permission string. */
export type PermissionString = (typeof ALL_PERMISSIONS)[number];

/**
 * Returns true if the given string is a valid permission.
 */
export function isValidPermission(value: string): value is PermissionString {
  return (ALL_PERMISSIONS as readonly string[]).includes(value);
}
