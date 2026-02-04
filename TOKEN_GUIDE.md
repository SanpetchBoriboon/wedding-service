# Token Generation Guide

## วิธีการใช้งาน

### 1. สร้าง Token

```bash
npm run generate-token
```

### 2. ตรวจสอบ Token

```bash
# ดู token ใน .env file
cat .env | grep TOKEN

# หรือเรียก API
curl http://localhost:3000/api/auth/tokens
```

### 3. ใช้ Token ใน API

```bash
# ตัวอย่างการใช้งาน
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/api/cards
```

## คำสั่งที่มี

- `npm run generate-token` - สร้าง JWT token ใหม่
- `npm run dev` - เริ่ม development server
- `npm start` - เริ่ม production server

## Token Details

- **Username:** benmeaweddingday (จาก JWT_USERNAME ใน .env)
- **Role:** admin
- **Expires:** 30 วันหลังจากสร้าง
- **Storage:** เก็บใน .env file

## หมายเหตุ

1. ต้องรัน `npm run generate-token` ก่อนใช้ API ที่ต้อง authentication
2. Token จะถูกเก็บใน .env file
3. หาก token หมดอายุ ให้รัน generate-token ใหม่อีกครั้ง
