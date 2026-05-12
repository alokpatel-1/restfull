# API cURL Reference

Base URL: `http://localhost:3000` (use the same host/port as your `.env` `PORT` if not 3000)

Replace `YOUR_ACCESS_TOKEN`, `YOUR_REFRESH_TOKEN`, `USER_ID`, `INVITATION_ID`, `ROLE_ID`, `SHOP_ID`, and placeholder tokens with real values after login/register.

---

## Health check (`GET /api/health`)

Confirms this Express app is the process answering the port (not another dev server). No auth, not rate-limited.

```bash
curl -s http://localhost:3000/api/health
```

Expected: `{"ok":true,"name":"restfull-api"}`. If this fails or returns something else, fix the URL/port or stop the other process using that port.

---

## Troubleshooting 404 on `POST /api/auth/login`

Invitation email / accept-invite URL changes do **not** affect auth routes. A login 404 is almost always environment or URL, not invite code.

| Response body | Meaning |
|----------------|--------|
| HTML with `<pre>Cannot POST /api/auth/login</pre>` | Express **default** 404: that process has no matching route. Often **another app** on the same port (e.g. Angular/Vite), or not this API. |
| JSON `{ "success": false, "message": "Route not found" }` | This app’s 404 handler: request reached this server but path/method did not match (typo in URL, wrong prefix). |

**Checks**

1. Ping health (above). If you do not get `restfull-api`, you are not talking to this repo’s server.
2. Login probe (replace port if needed):

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'
```

- Any **JSON** body (even 400 validation) means this API handled the request — align Postman URL/method with curl.
- **HTML** `Cannot POST` means something else is on that port — free it or change `PORT` in `.env` and restart.

3. See what listens on the port (macOS/Linux):

```bash
lsof -iTCP:3000 -sTCP:LISTEN
```

4. Prefer **`npm run dev`** during development from this project root. If you use **`npm start`**, run **`npm run build`** first so `dist/` matches current routes.

---

## Invite APIs (`/api/invite`)

Flow overview:

1. **Self-invite** – Shop admin requests an invite with email only (`POST /self`). Server assigns default admin role and sends a link with token.
2. **Shop / seller invite** – Logged-in shop admin invites someone to a shop with `email`, `roleId`, `shopId` (`POST /seller`). `invitedBy` is taken from the authenticated user when auth middleware is attached to this route.
3. **Validate token** – Invitation emails link to `{FRONTEND_URL}/accept-invite?token=...` only (`FRONTEND_URL` in `.env`, default `http://localhost:4200`). The accept-invite page reads `token` from the query, then calls **`GET /api/invite/validate?token=...`** or **`POST /api/invite/validate`** (API base, e.g. port 3000) to load `email`, `type`, `roleId`, `shopId`, etc., before showing the set-password form.
4. **Accept** – User sets password (and optional name) (`POST /accept`); account is created and invitation is completed.
5. **Manage** – List pending (`GET /`), cancel (`DELETE /:id`), resend (`POST /:id/resend`).

### Self-invitation (email only)

```bash
curl -X POST http://localhost:3000/api/invite/self \
  -H "Content-Type: application/json" \
  -d '{"email":"newadmin@example.com"}'
```

### Shop / seller invitation (email + role + shop)

Use real MongoDB-style IDs for `roleId` and `shopId`. If your app protects this route with JWT, add the header below.

```bash
curl -X POST http://localhost:3000/api/invite/seller \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "email":"teammember@example.com",
    "roleId":"ROLE_ID",
    "shopId":"SHOP_ID",
    "name":"Optional Display Name"
  }'
```

### Validate invitation token (GET)

```bash
curl -X GET "http://localhost:3000/api/invite/validate?token=INVITATION_JWT_FROM_EMAIL"
```

### Validate invitation token (POST)

```bash
curl -X POST http://localhost:3000/api/invite/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"INVITATION_JWT_FROM_EMAIL"}'
```

### Accept invitation (set password, create user)

Password minimum length: **6** characters. `name` is optional.

```bash
curl -X POST http://localhost:3000/api/invite/accept \
  -H "Content-Type: application/json" \
  -d '{
    "token":"INVITATION_JWT_FROM_EMAIL",
    "password":"password123",
    "name":"Jane Doe"
  }'
```

### List pending invitations (paginated)

Query: `skip` (default `0`), `limit` (default `20`, max `50`).

```bash
curl -X GET "http://localhost:3000/api/invite?skip=0&limit=20"
```

### Cancel a pending invitation

`INVITATION_ID` is the invitation document `_id` from your database or list response.

```bash
curl -X DELETE http://localhost:3000/api/invite/INVITATION_ID
```

### Resend invitation (new token and expiry)

```bash
curl -X POST http://localhost:3000/api/invite/INVITATION_ID/resend \
  -H "Content-Type: application/json"
```

---

## Auth APIs

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

### Verify Email (GET)
```bash
curl -X GET "http://localhost:3000/api/auth/verify-email?token=VERIFICATION_TOKEN_HERE"
```

### Verify Email (POST)
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"VERIFICATION_TOKEN_HERE"}'
```

### Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"RESET_TOKEN_FROM_EMAIL","newPassword":"newPassword123"}'
```

---

## User APIs

### Get User By ID
```bash
curl -X GET http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Quick copy-paste (replace placeholders)

| API                 | Method | Endpoint                                      |
|---------------------|--------|-----------------------------------------------|
| Health              | GET    | /api/health                                   |
| Register            | POST   | /api/auth/register                            |
| Login               | POST   | /api/auth/login                               |
| Refresh             | POST   | /api/auth/refresh                             |
| Logout              | POST   | /api/auth/logout                              |
| Verify Email        | GET    | /api/auth/verify-email?token=                 |
| Verify Email        | POST   | /api/auth/verify-email                        |
| Forgot Pass         | POST   | /api/auth/forgot-password                     |
| Reset Pass          | POST   | /api/auth/reset-password                      |
| Get User            | GET    | /api/users/:id (Bearer token)               |
| Invite self         | POST   | /api/invite/self                              |
| Invite seller/shop  | POST   | /api/invite/seller (Bearer if protected)    |
| Validate invite     | GET    | /api/invite/validate?token=                   |
| Validate invite     | POST   | /api/invite/validate                          |
| Accept invite       | POST   | /api/invite/accept                            |
| List pending invites| GET    | /api/invite?skip=&limit=                      |
| Cancel invite       | DELETE | /api/invite/:id                               |
| Resend invite       | POST   | /api/invite/:id/resend                        |

### Invite APIs – cURL (copy-paste)

Replace `YOUR_ACCESS_TOKEN`, `INVITATION_JWT`, `INVITATION_ID`, `ROLE_ID`, and `SHOP_ID`. Base URL matches your API (e.g. `http://localhost:3000`).

```bash
# Invite self
curl -X POST http://localhost:3000/api/invite/self \
  -H "Content-Type: application/json" \
  -d '{"email":"newadmin@example.com"}'

# Invite seller / shop (omit Authorization if route is open)
curl -X POST http://localhost:3000/api/invite/seller \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"email":"teammember@example.com","roleId":"ROLE_ID","shopId":"SHOP_ID","name":"Optional Name"}'

# Validate invite (GET)
curl -X GET "http://localhost:3000/api/invite/validate?token=INVITATION_JWT"

# Validate invite (POST)
curl -X POST http://localhost:3000/api/invite/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"INVITATION_JWT"}'

# Accept invite
curl -X POST http://localhost:3000/api/invite/accept \
  -H "Content-Type: application/json" \
  -d '{"token":"INVITATION_JWT","password":"password123","name":"Jane Doe"}'

# List pending invites
curl -X GET "http://localhost:3000/api/invite?skip=0&limit=20"

# Cancel invite
curl -X DELETE "http://localhost:3000/api/invite/INVITATION_ID"

# Resend invite
curl -X POST "http://localhost:3000/api/invite/INVITATION_ID/resend" \
  -H "Content-Type: application/json"
```
