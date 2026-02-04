# Authentication Documentation

## การใช้งาน Bearer Token Authentication

### 1. รับ Pre-generated Tokens

```bash
GET /api/auth/tokens
```

**Response:**

```json
{
  "message": "Available auth tokens",
  "tokens": {
    "admin": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "admin",
        "role": "admin"
      }
    },
    "user": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 2,
        "username": "user",
        "role": "user"
      }
    }
  },
  "usage": {
    "header": "Authorization: Bearer <token>",
    "adminExample": "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userExample": "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. ใช้ Token ในการเรียก API

```bash
GET /api/cards
Authorization: Bearer your-jwt-token-here
```

### 3. ตรวจสอบความถูกต้องของ Token

```bash
POST /api/auth/verify
Authorization: Bearer your-jwt-token-here
```

## Pre-generated Tokens

เซิร์ฟเวอร์จะ generate tokens อัตโนมัติเมื่อเริ่มต้น:

- **Admin Token:** มี role `admin` - สามารถทำทุกอย่างได้
- **User Token:** มี role `user` - สิทธิ์จำกัด

Tokens จะถูกเก็บใน environment variables:

- `ADMIN_TOKEN`
- `USER_TOKEN`

## API Endpoints และการ Authentication

### Auth Routes

- `GET /api/auth/tokens` - รับ pre-generated tokens (ไม่ต้อง auth)
- `POST /api/auth/verify` - ตรวจสอบ token (ใช้ token ใน header)

### Cards Routes

- `GET /api/cards` - List cards (optional auth)
- `POST /api/cards` - Create card (requires auth)
- `GET /api/cards/:id` - Get card details (requires auth)
- `PUT /api/cards/:id` - Update card (requires auth)
- `DELETE /api/cards/:id` - Delete card (requires admin role)

## Middleware Types

1. **authenticateToken** - บังคับต้องมี valid token
2. **optionalAuthenticateToken** - token ไม่บังคับ แต่ถ้ามีจะ verify
3. **requireRole(['admin'])** - ต้องมี role ที่ระบุ

## Environment Variables

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
ADMIN_TOKEN=auto-generated-on-server-start
USER_TOKEN=auto-generated-on-server-start
```

## การใช้งานใน Frontend

```javascript
// รับ tokens
const tokensResponse = await fetch("/api/auth/tokens");
const { tokens } = await tokensResponse.json();

// ใช้ admin token ในการเรียก API
const cardsResponse = await fetch("/api/cards", {
  headers: {
    Authorization: `Bearer ${tokens.admin.token}`,
  },
});

// หรือใช้ user token
const userCardsResponse = await fetch("/api/cards", {
  headers: {
    Authorization: `Bearer ${tokens.user.token}`,
  },
});
```

## วิธีการทำงาน

1. เมื่อเซิร์ฟเวอร์เริ่มต้น จะ generate JWT tokens สำหรับ admin และ user role
2. Tokens เหล่านี้จะถูกเก็บใน environment variables
3. เรียกใช้ `GET /api/auth/tokens` เพื่อรับ tokens
4. ใช้ tokens เหล่านั้นใน Authorization header สำหรับ API calls

## Error Responses

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Access token is required"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Invalid or expired token"
}
```

### 403 Insufficient Permissions

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```
