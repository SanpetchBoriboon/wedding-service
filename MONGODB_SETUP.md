# MongoDB Setup Guide

## การติดตั้งและเชื่อมต่อ MongoDB

### 1. ติดตั้ง MongoDB

#### macOS (ใช้ Homebrew)

```bash
# ติดตั้ง MongoDB
brew tap mongodb/brew
brew install mongodb-community

# เริ่มต้น MongoDB service
brew services start mongodb-community
```

#### Ubuntu/Debian

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. การตั้งค่า Environment Variables

แก้ไขไฟล์ `.env`:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=wedding_cards
```

### 3. การทดสอบการเชื่อมต่อ

```bash
# เริ่มเซิร์ฟเวอร์
npm run dev

# ตรวจสอบ health check
curl http://localhost:3000/health
```

**Response ที่ควรได้รับ:**

```json
{
  "status": "OK",
  "uptime": 5.123,
  "timestamp": 1677123456789,
  "database": {
    "connected": true,
    "name": "wedding_cards"
  }
}
```

### 4. การใช้งาน MongoDB CLI

```bash
# เชื่อมต่อ MongoDB shell
mongosh

# สลับไปยัง database
use wedding_cards

# ดู collections
show collections

# ดูข้อมูลในการ์ด
db.cards.find().pretty()

# นับจำนวนการ์ด
db.cards.countDocuments()
```

### 5. Database Schema

#### Cards Collection

```javascript
{
  _id: ObjectId("..."),
  title: "Wedding Invitation",
  message: "You're invited to our wedding!",
  template: "elegant",
  createdBy: "weddingday20260226",
  userId: 1,
  status: "active",
  createdAt: ISODate("2026-02-04T..."),
  updatedAt: ISODate("2026-02-04T...")
}
```

### 6. Indexes ที่ถูกสร้าง

- `userId`: สำหรับค้นหาการ์ดของผู้ใช้แต่ละคน
- `createdAt`: สำหรับเรียงลำดับตามเวลา
- `status`: สำหรับกรองการ์ดที่ active

### 7. การ Backup และ Restore

```bash
# Backup database
mongodump --db wedding_cards --out /path/to/backup

# Restore database
mongorestore --db wedding_cards /path/to/backup/wedding_cards
```

## การใช้งาน API กับ Database

### สร้างการ์ดใหม่

```bash
curl -X POST http://localhost:3000/api/cards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Our Wedding Day",
    "message": "Join us for our special day!",
    "template": "romantic"
  }'
```

### ดูการ์ดทั้งหมด

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/cards
```

### อัปเดตการ์ด

```bash
curl -X PUT http://localhost:3000/api/cards/CARD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "message": "Updated message"
  }'
```

### ลบการ์ด (admin เท่านั้น)

```bash
curl -X DELETE http://localhost:3000/api/cards/CARD_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## หมายเหตุ

1. **Local Development**: MongoDB จะทำงานบน port 27017
2. **Production**: ควรใช้ MongoDB Atlas หรือ managed service
3. **Security**: ในการใช้งานจริงควรเพิ่ม authentication และ SSL
4. **Monitoring**: ควรเพิ่ม logging และ monitoring สำหรับ database operations
