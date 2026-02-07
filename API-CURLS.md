# API cURL Reference

Base URL: `http://localhost:3000`

Replace `YOUR_ACCESS_TOKEN`, `YOUR_REFRESH_TOKEN`, `USER_ID`, and placeholder tokens with real values after login/register.

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

| API           | Method | Endpoint                          |
|---------------|--------|-----------------------------------|
| Register      | POST   | /api/auth/register                |
| Login         | POST   | /api/auth/login                   |
| Refresh       | POST   | /api/auth/refresh                 |
| Logout        | POST   | /api/auth/logout                  |
| Verify Email  | GET    | /api/auth/verify-email?token=     |
| Verify Email  | POST   | /api/auth/verify-email            |
| Forgot Pass   | POST   | /api/auth/forgot-password         |
| Reset Pass    | POST   | /api/auth/reset-password          |
| Get User      | GET    | /api/users/:id (Bearer token)    |
