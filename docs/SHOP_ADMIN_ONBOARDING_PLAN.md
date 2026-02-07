# Shop Admin Onboarding – Full Plan & Jira Stories

## Overview

End-to-end plan for shop/seller admin onboarding and operations, aligned with real-world marketplaces (e.g. Amazon Seller Central, Shopify, Flipkart Seller). The flow covers: **registration → approval → multi-store → products → orders → shipping/refunds/returns**, plus supporting capabilities.

---

## High-Level Phases (What You Have + Additions)


| Phase | Description                      | Your original | Added                                     |
| ----- | -------------------------------- | ------------- | ----------------------------------------- |
| **1** | Shop admin onboarding & approval | ✓             | KYC/docs, bank/payout, notifications      |
| **2** | Multi-store management           | ✓             | Store staff/roles, store settings         |
| **3** | Product onboarding & management  | ✓             | Categories, bulk import, inventory alerts |
| **4** | Orders & fulfillment             | ✓             | Status workflow, filters, exports         |
| **5** | Shipping, refunds, returns       | ✓             | Carriers, SLA, dispute handling           |
| **6** | **NEW**                          | —             | **Payouts & settlements**                 |
| **7** | **NEW**                          | —             | **Tax & compliance** (GST/VAT)            |
| **8** | **NEW**                          | —             | **Analytics & reports**                   |
| **9** | **NEW**                          | —             | **Notifications & preferences**           |


---

## Detailed Flow

### 1. Shop Admin Onboarding & Approval

- Admin registers with **valid business data** (business name, type, address, contact, tax ID).
- **KYC / document upload** (ID, business registration, address proof).
- **Email verification** (you already have this).
- Admin sits in **pending approval** until platform approves.
- On approval: admin can log in and access **store management**.
- Optional: **bank/payout account** setup during or right after approval.

### 2. Multi-Store Management (Post-Approval)

- Approved admin can **create multiple stores** (name, address, contact, logo, business hours).
- Each store has its own **products, inventory, and orders**.
- Optional: **store-level staff/roles** (manager, support) with scoped permissions.
- Store settings: currency, timezone, shipping defaults.

### 3. Product Onboarding & Management

- **Categories/catalog** (platform categories or custom).
- **Product CRUD** at **store level** (name, SKU, description, images, price, tax, inventory).
- **Bulk import** (CSV/Excel) for products.
- **Inventory alerts** (low stock thresholds, notifications).
- Product status: draft, active, out-of-stock, discontinued.

### 4. Orders (Unified View + Later Filtering)

- **Single screen** listing all orders (across stores) for the shop admin.
- Filters: store, date range, status, payment status.
- **Order status workflow**: placed → confirmed → processing → shipped → delivered / cancelled / returned.
- Export (CSV/Excel) for reporting.
- *(Later: user access and row-level filtering by store/role.)*

### 5. Shipping, Refunds & Returns

- **Shipping**: carrier selection, tracking, label generation (or integration), SLA.
- **Refunds**: full/partial, reason, approval workflow, payment reversal.
- **Returns**: return request → approve → receive → inspect → refund/replace.
- **Disputes**: optional escalation and notes.

### 6. Additions You May Have Missed

- **Payouts & settlements**: payout schedule (weekly/bi-weekly), bank account, statement view, deductions (commission, shipping, refunds).
- **Tax & compliance**: GST/VAT registration per store/region, tax-inclusive/exclusive pricing, tax reports.
- **Analytics & reports**: sales by store/product/period, top products, order trends, simple dashboard.
- **Notifications & preferences**: email/push for new orders, low stock, returns, payouts; preference toggles per admin.
- **Business verification / re-verification**: document expiry, annual refresh.
- **Store suspension / reinstatement**: platform can suspend store; admin can appeal or fix issues.

---

## Jira-Style Epic & Stories (Copy-Paste Ready)

---

## EPIC: Shop Admin Onboarding & Operations

**Epic Key:** `LIVO` (replace with your project key)

**Epic Name:** Shop Admin Onboarding & Operations

**Summary:**  
As a **shop/seller admin**, I want to **onboard with valid business data, get approved, manage multiple stores, products, and orders, and handle shipping, refunds, and returns**, so that I can **sell and fulfill orders on the platform in a controlled, auditable way**.

**Description:**

This epic covers the full lifecycle of a shop admin on the platform:

1. **Onboarding**: Registration with business details and KYC; platform approval.
2. **Stores**: Create and manage multiple stores (post-approval).
3. **Products**: Category/catalog, product CRUD per store, bulk import, inventory alerts.
4. **Orders**: Unified order list with filters and status workflow; later: user-level access and data filtering.
5. **Fulfillment**: Shipping (carriers, tracking), refunds, returns, and optional disputes.
6. **Supporting**: Payouts, tax settings, analytics, notifications.

**Acceptance Criteria (Epic):**

- Shop admin can register with valid business data and documents.
- Platform can approve/reject; approved admin can manage stores and products.
- Admin can add multiple stores and manage products at store level.
- All orders are visible on one screen with filters; order status can be updated.
- Shipping, refund, and return flows are implemented with clear statuses.
- (Stretch) Payout and tax configuration; basic analytics and notification preferences.

**Labels:** `shop-admin`, `onboarding`, `multi-store`, `orders`, `fulfillment`

---

## Story 1: Shop Admin Registration (Onboarding)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can register with valid business and contact data

**Description:**

As a **shop/seller admin**, I want to **register with my business name, type, address, contact details, and tax ID**, so that **the platform can verify my business and consider me for approval**.

**Acceptance Criteria:**

- Registration form/API accepts: business name, business type (e.g. sole proprietorship, Pvt Ltd), registered address, contact phone, tax ID (e.g. GST), and admin user details (name, email, password).
- Email must be unique; password meets security policy (e.g. min length, complexity).
- On success, admin record is created with status **PENDING_APPROVAL**; email verification can be sent (reuse existing auth flow).
- Validation errors return clear messages (e.g. duplicate email, invalid tax ID format).
- Admin cannot log in to seller dashboard until status is **APPROVED** (handled in approval story).

**Technical Notes:**

- New entity: `Shop` or `SellerProfile` (business info + status: PENDING_APPROVAL | APPROVED | REJECTED | SUSPENDED).
- Link to `User` (admin) 1:1 or 1:many if multiple admins per shop later.

**Labels:** `shop-admin`, `onboarding`, `registration`

**Story Points:** 5

---

## Story 2: KYC / Document Upload for Shop Admin

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can upload KYC documents during onboarding

**Description:**

As a **shop/seller admin**, I want to **upload my ID proof, business registration, and address proof**, so that **the platform can verify my identity and business before approval**.

**Acceptance Criteria:**

- Admin can upload documents: ID proof (e.g. Aadhaar, passport), business registration certificate, address proof.
- File types and size limits are enforced (e.g. PDF, JPG, max 5MB).
- Documents are stored securely and linked to the shop/seller profile.
- Admin can see list of uploaded documents and re-upload if rejected.
- Platform (admin/super-admin) can view documents and mark as verified/rejected with reason.

**Labels:** `shop-admin`, `onboarding`, `kyc`, `documents`

**Story Points:** 5

---

## Story 3: Shop Admin Approval Workflow (Platform)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Platform can approve or reject shop admin after review

**Description:**

As a **platform/super-admin**, I want to **review pending shop admins (business + KYC) and approve or reject them**, so that **only verified sellers can add stores and sell**.

**Acceptance Criteria:**

- List of shop admins with status **PENDING_APPROVAL** (with filters: date, business name).
- Super-admin can open a shop profile and view business details + uploaded documents.
- Actions: **Approve** or **Reject** with optional reason.
- On Approve: shop status → **APPROVED**; admin can log in and access store management.
- On Reject: shop status → **REJECTED**; admin is notified (email) with reason; admin can reapply (new flow or same record based on product decision).
- Approved admin receives welcome/next-steps email (e.g. “Add your first store”).

**Labels:** `shop-admin`, `onboarding`, `approval`, `platform-admin`

**Story Points:** 5

---

## Story 4: Create and Manage Multiple Stores (Post-Approval)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Approved shop admin can add and manage multiple stores

**Description:**

As an **approved shop admin**, I want to **create multiple stores** (name, address, contact, logo, business hours), so that **I can sell from different locations or brands under one account**.

**Acceptance Criteria:**

- Only users with **APPROVED** shop/seller profile can create stores.
- Create store: name, address, contact phone, optional logo, business hours, timezone, currency.
- List stores for the logged-in shop admin; edit and deactivate store (no hard delete if orders exist).
- Each store has a unique identifier (e.g. store code or slug) for URLs/APIs.
- Store settings: default shipping origin address (for shipping calculations later).

**Technical Notes:**

- Entity: `Store` (shopId/sellerId, name, address, contact, logoUrl, businessHours, timezone, currency, isActive, etc.).

**Labels:** `shop-admin`, `multi-store`, `stores`

**Story Points:** 8

---

## Story 5: Product Catalog & Categories

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Platform or shop defines categories for products

**Description:**

As a **shop admin**, I want to **assign my products to categories** (platform-defined or custom per store), so that **products are organized and discoverable**.

**Acceptance Criteria:**

- Categories exist at platform level (e.g. Electronics, Fashion) or store level (custom categories).
- Category has: name, optional parent (tree), optional image, isActive.
- Shop admin can browse/select categories when creating/editing a product.
- Product can belong to one or more categories (based on product model design).

**Labels:** `products`, `catalog`, `categories`

**Story Points:** 5

---

## Story 6: Product Onboarding and Management at Store Level

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can create, edit, and manage products per store

**Description:**

As a **shop admin**, I want to **add and manage products for each of my stores** (name, SKU, description, images, price, tax, inventory), so that **customers can browse and buy from my stores**.

**Acceptance Criteria:**

- Product is always linked to **one store** (and optionally to categories).
- Fields: name, SKU (unique per store), short/long description, images (multiple), price, compare-at price (optional), tax code/rate, inventory quantity, weight/dimensions (optional for shipping).
- Product status: DRAFT, ACTIVE, OUT_OF_STOCK, DISCONTINUED.
- Only ACTIVE products are visible to customers (customer-facing API/app).
- CRUD APIs + list with filters (store, status, category, search by name/SKU).
- Low stock threshold per product or per store; when inventory &lt; threshold, product can be marked OUT_OF_STOCK or trigger alert (see next story).

**Technical Notes:**

- Entity: `Product` (storeId, name, sku, description, images[], price, taxRate, quantity, status, etc.).

**Labels:** `products`, `store-level`, `inventory`

**Story Points:** 13

---

## Story 7: Bulk Product Import (CSV/Excel)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can bulk import products via CSV/Excel

**Description:**

As a **shop admin**, I want to **upload a CSV or Excel file to create/update many products at once**, so that **I can onboard my catalog quickly**.

**Acceptance Criteria:**

- Upload file (CSV/Excel); validate headers and required fields (e.g. name, SKU, price, store id/code).
- Support create and update (match by SKU + store); report rows with validation errors (row number, error message).
- Option: async job for large files; admin gets notification when job completes and can download error report.
- Limit file size and row count (e.g. max 10k rows per file) to avoid abuse.

**Labels:** `products`, `bulk-import`, `csv`

**Story Points:** 8

---

## Story 8: Inventory Alerts and Low Stock Notifications

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin gets alerts when product or store inventory is low

**Description:**

As a **shop admin**, I want to **set a low-stock threshold per product or per store** and **receive notifications when stock falls below that threshold**, so that **I can restock in time**.

**Acceptance Criteria:**

- Configurable low-stock threshold (per product or default per store).
- When quantity &lt;= threshold, system marks or flags product (e.g. low stock badge) and can trigger notification.
- Notification: email or in-app; preference can be toggled in notification settings (later story).
- List view: filter products by “low stock” for the store.

**Labels:** `products`, `inventory`, `notifications`

**Story Points:** 5

---

## Story 9: Unified Orders Screen for Shop Admin

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Single screen listing all orders across stores with filters

**Description:**

As a **shop admin**, I want to **see all orders from all my stores on one screen** with **filters (store, date range, status, payment status)**, so that **I can manage fulfillment in one place**.

**Acceptance Criteria:**

- One list/API that returns orders for all stores belonging to the logged-in shop admin.
- Columns/data: order ID, date, store, customer (masked if needed), items summary, total, order status, payment status.
- Filters: store (dropdown), date range, order status (e.g. placed, confirmed, shipped, delivered, cancelled), payment status (pending, paid, failed, refunded).
- Pagination and sort (e.g. by date desc).
- Click/expand to see order details (line items, shipping address, payment info).
- (Later) User access and data filtering: only orders for stores the user is allowed to see (role-based).

**Technical Notes:**

- Order entity: orderId, storeId, customerId, line items, totals, orderStatus, paymentStatus, shippingAddress, etc.
- Authorization: ensure admin only sees orders for their stores.

**Labels:** `orders`, `dashboard`, `multi-store`

**Story Points:** 8

---

## Story 10: Order Status Workflow and Updates

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can update order status through fulfillment lifecycle

**Description:**

As a **shop admin**, I want to **update order status** (e.g. confirmed → processing → shipped → delivered) and **optionally add tracking**, so that **customers and the platform can track fulfillment**.

**Acceptance Criteria:**

- Order status values: PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED.
- Valid transitions (e.g. PLACED → CONFIRMED → PROCESSING → SHIPPED → DELIVERED); CANCELLED and RETURNED from allowed states.
- Shop admin can set status and, when marking SHIPPED, add carrier and tracking number.
- Customer and platform can read order status and tracking (APIs or notifications).
- Optional: webhook or event when status changes (for notifications or 3rd party).

**Labels:** `orders`, `fulfillment`, `status`

**Story Points:** 5

---

## Story 11: Export Orders (CSV/Excel)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can export filtered orders for reporting

**Description:**

As a **shop admin**, I want to **export the current order list (with applied filters) to CSV or Excel**, so that **I can use it for accounting or reports**.

**Acceptance Criteria:**

- Export button/API uses same filters as order list (store, date range, status).
- Format: CSV or Excel; columns align with list (order ID, date, store, customer, items, total, status, payment status).
- Limit export size (e.g. max 50k rows) or async job with download link for large sets.

**Labels:** `orders`, `export`, `reporting`

**Story Points:** 3

---

## Story 12: Shipping Management (Carriers, Tracking, Labels)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can manage shipping: carriers, tracking, and optional labels

**Description:**

As a **shop admin**, I want to **select a carrier, add tracking number when I ship, and optionally generate shipping labels**, so that **orders are fulfilled and customers can track packages**.

**Acceptance Criteria:**

- Master list of carriers (platform-defined) or shop admin can add preferred carriers per store.
- When marking order as SHIPPED, admin selects carrier and enters tracking number (and optional URL).
- Optional: integrate with carrier API for label generation (or upload custom label); store tracking link with order.
- Shipping SLA: optional expected delivery date (calculated or manual) for display to customer.

**Labels:** `shipping`, `tracking`, `carriers`

**Story Points:** 8

---

## Story 13: Refund Management (Full and Partial)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can process full or partial refunds with reason and approval

**Description:**

As a **shop admin**, I want to **initiate full or partial refunds** with **reason and (if required) approval workflow**, so that **payments are reversed correctly and disputes are documented**.

**Acceptance Criteria:**

- Refund is linked to an order (and optionally to specific line items).
- Refund types: full or partial; amount and currency; reason (dropdown or free text).
- Optional: refund request → platform or auto-approve → payment gateway reversal (integration story later).
- Refund status: PENDING, APPROVED, PROCESSING, COMPLETED, FAILED.
- Order or payment status reflects “refunded” (full) or “partially refunded” where applicable.
- Audit: who initiated, when, amount, reason.

**Labels:** `refunds`, `payments`, `orders`

**Story Points:** 8

---

## Story 14: Return Request and Return Management

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Customers can request returns; shop admin can approve, receive, and complete returns

**Description:**

As a **shop admin**, I want to **see return requests from customers**, **approve or reject them**, and **mark return received and then process refund/replacement**, so that **returns are handled in a clear workflow**.

**Acceptance Criteria:**

- Return request: linked to order (and line items); reason; optional photos; status REQUESTED.
- Shop admin can list return requests (filter by store, order, status).
- Actions: Approve (with optional return shipping instructions) or Reject (with reason).
- After approval: customer ships item; admin marks “return received” and can inspect.
- Then: process refund (link to refund story) or replacement; mark return as COMPLETED.
- Status flow: REQUESTED → APPROVED / REJECTED → RETURN_RECEIVED → REFUNDED / REPLACED → COMPLETED.

**Labels:** `returns`, `fulfillment`, `orders`

**Story Points:** 13

---

## Story 15: Payout Account Setup and Payout Preferences

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can add bank/payout account and set payout schedule

**Description:**

As a **shop admin**, I want to **add my bank account (or payout method) and choose payout schedule** (e.g. weekly), so that **I can receive settlements from the platform**.

**Acceptance Criteria:**

- Shop admin can add bank account: account holder name, bank name, account number, IFSC/code, optional proof.
- Payout schedule: e.g. weekly, bi-weekly; cutoff day and payout day.
- Admin can view and update payout method; only one primary payout method per shop (or per store if needed).
- Sensitive data masked in UI; stored securely.

**Labels:** `payouts`, `onboarding`, `bank`

**Story Points:** 5

---

## Story 16: Payout Statements and History

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can view payout statements and history

**Description:**

As a **shop admin**, I want to **view my payout history and statements** (amount, date, deductions like commission/shipping/refunds), so that **I can reconcile my earnings**.

**Acceptance Criteria:**

- List of payouts: date, period, gross amount, deductions (commission, shipping, refunds, etc.), net amount, status (pending, processed, failed).
- Statement view or download (PDF/CSV) for a payout period.
- Filters: date range, status.

**Labels:** `payouts`, `reporting`, `statements`

**Story Points:** 5

---

## Story 17: Tax Settings (GST/VAT) per Store

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can configure tax registration and rates per store

**Description:**

As a **shop admin**, I want to **set my GST/VAT registration and tax rates per store**, so that **orders and payouts are tax-compliant**.

**Acceptance Criteria:**

- Per store: tax registration number (e.g. GSTIN), tax-inclusive or -exclusive pricing.
- Optional: default tax rate or tax code per product; override at product level.
- Tax amount shown in order breakdown and in payout statements where applicable.
- (Stretch) Tax report export for a period.

**Labels:** `tax`, `compliance`, `store-settings`

**Story Points:** 5

---

## Story 18: Basic Analytics and Dashboard for Shop Admin

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin sees basic sales and order analytics on a dashboard

**Description:**

As a **shop admin**, I want to **see a simple dashboard** with **sales summary, order trends, and top products** (by store or all), so that **I can understand my performance**.

**Acceptance Criteria:**

- Dashboard widgets: total sales (today/week/month), order count, average order value.
- Simple chart: orders or revenue over time (daily/weekly).
- Top products by quantity or revenue (configurable period).
- Filter by store or “all stores”.
- Data scoped to shop admin’s stores only.

**Labels:** `analytics`, `dashboard`, `reporting`

**Story Points:** 8

---

## Story 19: Notification Preferences for Shop Admin

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Shop admin can manage notification preferences (email, in-app)

**Description:**

As a **shop admin**, I want to **choose which notifications I receive** (e.g. new order, low stock, return request, payout processed) and **channel (email, in-app)**, so that **I am not overwhelmed and don’t miss important events**.

**Acceptance Criteria:**

- Preference toggles per event type: new order, order cancelled, low stock, return request, refund processed, payout processed, etc.
- Channel: email on/off, in-app on/off (if in-app exists).
- Saved per shop admin (or per user if multiple users per shop).
- Notifications respect these preferences when sending.

**Labels:** `notifications`, `preferences`, `shop-admin`

**Story Points:** 5

---

## Story 20: Store Suspension and Reinstatement (Platform)

**Story Key:** `LIVO`

**Type:** Story

**Summary:** Platform can suspend a store; admin can view reason and request reinstatement

**Description:**

As a **platform/super-admin**, I want to **suspend a store or shop** (e.g. policy violation, fraud) so that **they cannot sell until resolved**. As a **shop admin**, I want to **see the reason and submit a request for reinstatement**.

**Acceptance Criteria:**

- Super-admin can suspend a store or entire shop; reason and effective date are recorded.
- Suspended store: products not visible to customers; admin cannot create new orders or shipments (or can only view).
- Admin sees banner or message: “Store suspended – reason: …” and “Request reinstatement” (form or ticket).
- Reinstatement: platform reviews and can reinstate; status moves back to APPROVED/ACTIVE.
- Optional: appeal workflow with comments and document upload.

**Labels:** `platform-admin`, `moderation`, `stores`, `compliance`

**Story Points:** 5

---

## Summary: Story Count and Suggested Order


| Order | Story                                            | Points |
| ----- | ------------------------------------------------ | ------ |
| 1     | Shop Admin Registration                          | 5      |
| 2     | KYC / Document Upload                            | 5      |
| 3     | Shop Admin Approval Workflow                     | 5      |
| 4     | Create and Manage Multiple Stores                | 8      |
| 5     | Product Catalog & Categories                     | 5      |
| 6     | Product Onboarding and Management at Store Level | 13     |
| 7     | Bulk Product Import                              | 8      |
| 8     | Inventory Alerts and Low Stock                   | 5      |
| 9     | Unified Orders Screen                            | 8      |
| 10    | Order Status Workflow                            | 5      |
| 11    | Export Orders                                    | 3      |
| 12    | Shipping Management                              | 8      |
| 13    | Refund Management                                | 8      |
| 14    | Return Request and Return Management             | 13     |
| 15    | Payout Account Setup                             | 5      |
| 16    | Payout Statements and History                    | 5      |
| 17    | Tax Settings (GST/VAT) per Store                 | 5      |
| 18    | Basic Analytics and Dashboard                    | 8      |
| 19    | Notification Preferences                         | 5      |
| 20    | Store Suspension and Reinstatement               | 5      |


**Total: 20 stories, 122 story points** (adjust points to your team’s scale).

---

## Optional / Future

- **Multi-user access per shop**: store staff with roles (manager, support) and data filtering so they only see assigned stores/orders.
- **Dispute escalation**: formal dispute entity and workflow between customer and shop/platform.
- **Bulk order actions**: bulk status update, bulk export, bulk print labels.
- **API for 3rd party**: webhooks for order/return events; API keys for ERP/inventory sync.
- **Re-verification**: annual or event-based document refresh for KYC.

You can copy each **Epic** and **Story** block into Jira (Create Issue → Epic / Story) and paste the Summary and Description. Use the same structure for **Acceptance Criteria** (e.g. as checklist or in description). Adjust **Story Key** and **Labels** to match your project.