# Wedding Card Online Service

# บริการการ์แต่งงานออนไลน์

A modern Express.js web service for creating and managing digital wedding invitation cards with image upload, Firebase Storage integration, and JWT authentication.

_บริการเว็บแอปพลิเคชันที่พัฒนาด้วย Express.js สำหรับสร้างและจัดการการ์เชิญงานแต่งงานดิจิทัล พร้อมระบบอัปโหลดรูปภาพ การเชื่อมต่อ Firebase Storage และระบบยืนยันตัวตน JWT_

## 🚀 Live Demo | ทดสอบระบบจริง

- **Production URL | ลิงก์เว็บไซต์**: https://wedding-card-online-service.fly.dev
- **Health Check | ตรวจสอบสถานะ**: https://wedding-card-online-service.fly.dev/health

## ✨ Features | คุณสมบัติหลัก

- 🎯 **RESTful API** for wedding card management | _API สำหรับจัดการการ์แต่งงาน_
- 🔐 **JWT-based authentication** system | _ระบบยืนยันตัวตนด้วย JWT_
- 📸 **Image upload** with Firebase Storage integration | _อัปโหลดรูปภาพผ่าน Firebase Storage_
- 🌐 **CORS-friendly image proxy** for Firebase Storage | _Image proxy ที่รองรับ CORS_
- 🗄️ **MongoDB** with Mongoose ODM | _ฐานข้อมูล MongoDB พร้อม Mongoose_
- 🚀 **Auto-deployment** with GitHub Actions | _Deploy อัตโนมัติด้วย GitHub Actions_
- 🛡️ **Express.js server** with security middleware | _เซิร์ฟเวอร์ Express.js พร้อมความปลอดภัย_
- 💊 **Health monitoring** and status endpoints | _ตรวจสอบสุขภาพระบบ_
- 🎫 **Token-based access control** (limited by date) | _ควบคุมการเข้าถึงด้วย Token (จำกัดตามวันที่)_

## 🛠 Tech Stack | เทคโนโลยีที่ใช้

### Backend | แบ็กเอนด์

- **Express.js, Node.js** | _เฟรมเวิร์กเว็บสำหรับ JavaScript_

### Database & Storage | ฐานข้อมูลและที่เก็บไฟล์

- **MongoDB** with Mongoose | _ฐานข้อมูล NoSQL พร้อม ODM_
- **Firebase Storage** | _บริการเก็บไฟล์ของ Google_

### Security & Auth | ความปลอดภัยและการยืนยันตัวตน

- **JWT** (JSON Web Tokens) | _Token สำหรับยืนยันตัวตน_
- **Multer** | _Middleware สำหรับอัปโหลดไฟล์_

### Deployment | การ Deploy

- **Fly.io** | _แพลตฟอร์มสำหรับ Host เว็บแอป_
- **GitHub Actions** | _CI/CD อัตโนมัติ_

## 🚀 Getting Started | เริ่มต้นใช้งาน

### Prerequisites | สิ่งที่ต้องเตรียม

- ✅ **Node.js** (version 18 or higher) | _เวอร์ชัน 18 ขึ้นไป_
- ✅ **npm** package manager | _ตัวจัดการ package_
- ✅ **MongoDB** database | _ฐานข้อมูล MongoDB_
- ✅ **Firebase project** (optional, for image storage) | _โปรเจ็ค Firebase (ไม่บังคับ)_

### Installation | วิธีติดตั้ง

**Step 1:** Clone the repository | _โคลนโปรเจ็ค_

```bash
git clone <repository-url>
cd wedding-card-online-service
```

**Step 2:** Install dependencies | _ติดตั้ง dependencies_

```bash
npm install
```

**Step 3:** Set up environment variables | _ตั้งค่าตัวแปรสภาพแวดล้อม_

```bash
cp .env.example .env
# Edit .env with your configuration
# แก้ไขไฟล์ .env ตามการตั้งค่าของคุณ
```

**Step 4:** Generate JWT token | _สร้าง JWT token_

```bash
npm run generate-token
```

**Step 5:** Start development server | _รันเซิร์ฟเวอร์พัฒนา_

```bash
npm run dev
```

**Step 6:** For production | _สำหรับ production_

```bash
npm start
```

## 🔧 Environment Variables | ตัวแปรสภาพแวดล้อม

Create a `.env` file with the following variables: | _สร้างไฟล์ `.env` พร้อมตัวแปรดังนี้:_

```env
# Database | ฐานข้อมูล
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=wedding_cards

# JWT Configuration | การตั้งค่า JWT
JWT_SECRET=your_super_secure_secret
JWT_USERNAME=your_username

# Firebase (Optional) | Firebase (ไม่บังคับ)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=project.firebasestorage.app

# Application | แอปพลิเคชัน
NODE_ENV=development
PORT=3000
TOKEN=generated_jwt_token
```

## 📚 API Endpoints | จุดเชื่อมต่อ API

### Base URL | URL หลัก

- **Local | ท้องถิ่น**: `http://localhost:3000`
- **Production | เซิร์ฟเวอร์จริง**: `https://wedding-card-online-service.fly.dev`

---

### 🔐 Authentication Endpoints | API ยืนยันตัวตน

#### Get Guest Token | รับ Token แขก (Available only on 2026-02-26 | _ใช้ได้เฉพาะวันที่ 26 กุมภาพันธ์ 2026_)

```bash
POST /api/auth/:role/tokens
Content-Type: application/json
```

#### Verify Token | ตรวจสอบ Token

```bash
POST /api/auth/verify
Authorization: Bearer your_jwt_token
```

---

### 💌 Card Management | จัดการการ์ดแต่งงาน

#### List Cards | ดูรายการการ์ด

```bash
GET /api/cards
Authorization: Bearer your_jwt_token (optional | ไม่บังคับ)
```

#### Delete Card | ลบการ์ด (Admin only | _เฉพาะแอดมิน_)

```bash
DELETE /api/cards/:id
Authorization: Bearer your_jwt_token
```

---

### 📸 File Upload | อัปโหลดไฟล์

#### Upload Card with Image | อัปโหลดการ์ดพร้อมรูปภาพ

```bash
POST /api/upload/card-image
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data

Form Data:
- title: "Wedding Card Title"          # ชื่อการ์ดแต่งงาน
- message: "Your wedding message"      # ข้อความในการ์ด
- image: [file]                        # ไฟล์รูปภาพ
```

---

### 🔧 Utilities | เครื่องมือเสริม

#### Health Check | ตรวจสอบสถานะระบบ

```bash
GET /health
```

#### Image Proxy | Proxy รูปภาพ (CORS-friendly | _รองรับ CORS_)

```bash
GET /api/cards/image-proxy?url=firebase_storage_url
```

## 💾 Data Models | โครงสร้างข้อมูล

### Card Model | โมเดลการ์ด

```javascript
{
  _id: ObjectId,                        // ID เฉพาะของการ์ด
  title: String (required),             // ชื่อการ์ด (จำเป็น)
  message: String (required),           // ข้อความ (จำเป็น)
  template: String (default: "default"), // เทมเพลต (ค่าเริ่มต้น: "default")
  imageUrl: String,                     // URL รูปภาพ
  createdBy: String (required),         // ผู้สร้าง (จำเป็น)
  userId: Number (required),            // ID ผู้ใช้ (จำเป็น)
  status: String (enum: ["active", "inactive", "deleted"]), // สถานะ
  createdAt: Date,                      // วันที่สร้าง
  updatedAt: Date                       // วันที่อัปเดต
}
```

## 📁 Project Structure | โครงสร้างโปรเจ็ค

```
wedding-card-online-service/
├── .github/                           # GitHub Actions และการตั้งค่า
│   ├── workflows/
│   │   └── fly-deploy.yml            # การ Deploy อัตโนมัติ
│   └── copilot-instructions.md       # คำแนะนำสำหรับ GitHub Copilot
├── public/                           # ไฟล์สาธารณะ
│   └── index.html                    # หน้าแรก
├── scripts/                          # สคริปต์เสริม
│   └── generate-token.js             # สร้าง JWT token
├── src/                              # ซอร์สโค้ดหลัก
│   ├── config/                       # การตั้งค่า
│   │   ├── mongoose.js               # เชื่อมต่อ MongoDB
│   │   └── firebase.js               # ตั้งค่า Firebase
│   ├── middleware/                   # Middleware
│   │   └── auth.js                   # ยืนยันตัวตน JWT
│   ├── models/                       # โมเดลข้อมูล
│   │   └── cardModel.js              # Schema การ์ด
│   └── routes/                       # เส้นทาง API
│       ├── index.js                  # รวม Route ทั้งหมด
│       ├── auth/                     # เส้นทางยืนยันตัวตน
│       │   └── auth.js
│       ├── cards/                    # เส้นทางการ์ด
│       │   └── cards.js
│       └── upload/                   # เส้นทางอัปโหลด
│           └── upload.js
├── .dockerignore                     # ไฟล์ที่ไม่รวมใน Docker
├── .env.example                      # ตัวอย่างไฟล์ environment
├── .gitignore                        # ไฟล์ที่ไม่ติดตาม Git
├── DEPLOYMENT.md                     # คู่มือการ Deploy
├── Dockerfile                        # การตั้งค่า Docker
├── fly.toml                          # การตั้งค่า Fly.io
├── package.json                      # การตั้งค่า npm
├── README.md                         # คู่มือโปรเจ็ค
├── server.js                         # ไฟล์หลักแอปพลิเคชัน
└── setup-fly-secrets.sh              # ตั้งค่า secrets ใน Fly.io
```

## 🔧 Technologies Used | เทคโนโลยีที่ใช้งาน

### Backend | แบ็กเอนด์

- 🚀 **Express.js** - Web framework | _เฟรมเวิร์กเว็บ_
- 🗄️ **Mongoose** - MongoDB ODM | _เครื่องมือจัดการ MongoDB_
- 🎫 **JWT** - JSON Web Tokens for authentication | _Token สำหรับยืนยันตัวตน_
- 📁 **Multer** - File upload middleware | _Middleware อัปโหลดไฟล์_
- 🌐 **Axios** - HTTP client for image proxy | _HTTP client สำหรับ image proxy_

### Security & Middleware | ความปลอดภัยและ Middleware

- 🛡️ **Helmet** - Security headers | _ส่วนหัวความปลอดภัย_
- 🔗 **CORS** - Cross-origin resource sharing | _แชร์ทรัพยากรข้ามโดเมน_
- 📋 **Morgan** - HTTP request logger | _บันทึก HTTP request_

### Storage & Database | ที่เก็บข้อมูลและฐานข้อมูล

- 🗃️ **MongoDB** - Document database | _ฐานข้อมูลเอกสาร_
- 🔥 **Firebase Storage** - File storage service | _บริการเก็บไฟล์_

### Deployment & CI/CD | การ Deploy และ CI/CD

- ✈️ **Fly.io** - Application hosting | _แพลตฟอร์ม Host แอป_
- 🔄 **GitHub Actions** - Continuous deployment | _Deploy ต่อเนื่อง_
- 🐳 **Docker** - Containerization | _การใส่คอนเทนเนอร์_

## 🚀 Deployment | การ Deploy

### Fly.io Deployment | Deploy ไปยัง Fly.io

This project is configured for automatic deployment to Fly.io using GitHub Actions.  
_โปรเจ็คนี้ตั้งค่าให้ Deploy อัตโนมัติไปยัง Fly.io ผ่าน GitHub Actions_

#### Manual Deployment | Deploy ด้วยตนเอง

```bash
# Install Fly CLI | ติดตั้ง Fly CLI
brew install flyctl

# Login to Fly.io | เข้าสู่ระบบ Fly.io
flyctl auth login

# Deploy application | Deploy แอปพลิเคชัน
flyctl deploy --remote-only
```

#### Auto Deployment | Deploy อัตโนมัติ

- ✅ Push to `main` branch triggers automatic deployment | _Push ไปยัง branch `main` จะทำการ Deploy อัตโนมัติ_
- ✅ GitHub Actions workflow handles the deployment process | _GitHub Actions จัดการกระบวนการ Deploy_
- ✅ Health checks ensure successful deployment | _ตรวจสอบสุขภาพเพื่อให้แน่ใจว่า Deploy สำเร็จ_

#### Environment Setup | ตั้งค่าสภาพแวดล้อม

```bash
# Setup Fly.io secrets from .env file | ตั้งค่า secrets จากไฟล์ .env
./setup-fly-secrets.sh

# Or manually set secrets | หรือตั้งค่า secrets ด้วยตนเอง
flyctl secrets set MONGODB_URI="your_connection_string"
flyctl secrets set JWT_SECRET="your_secret"
```

📖 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.  
_ดูรายละเอียดการ Deploy ใน [DEPLOYMENT.md](DEPLOYMENT.md)_

## 🔐 Authentication | การยืนยันตัวตน

### Token-Based Access Control | ระบบควบคุมการเข้าถึงด้วย Token

- 🎫 **Guest tokens | Token แขก**: Available only on February 26, 2026 | _ใช้ได้เฉพาะวันที่ 26 กุมภาพันธ์ 2026_
- ⏰ **JWT expiration | หมดอายุ JWT**: 24 hours | _24 ชั่วโมง_
- 🚦 **Rate limiting | จำกัดอัตรา**: Based on date restrictions | _ตามข้อจำกัดวันที่_
- 👑 **Admin functions | ฟังก์ชันแอดมิน**: Require special role permissions | _ต้องการสิทธิพิเศษ_

### Usage Example | ตัวอย่างการใช้งาน

```javascript
// Request guest token (only on 2026-02-26)
// ขอ guest token (เฉพาะวันที่ 2026-02-26)
const response = await fetch("/api/auth/tokens/guest", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "wedding_guest" }),
});

const { token } = await response.json();

// Use token for API calls | ใช้ token สำหรับเรียก API
fetch("/api/cards", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 🤝 Contributing | การมีส่วนร่วม

1. 🍴 Fork the repository | _Fork โปรเจ็ค_
2. 🌟 Create a feature branch | _สร้าง feature branch_
3. ✏️ Make your changes | _ทำการเปลี่ยนแปลง_
4. 🧪 Test your changes | _ทดสอบการเปลี่ยนแปลง_
5. 📤 Submit a pull request | _ส่ง pull request_

---

## 📄 License | ลิขสิทธิ์

ISC License - see package.json for details | _ลิขสิทธิ์ ISC - ดูรายละเอียดใน package.json_

---

## 💬 Support | การสนับสนุน

For support or questions, please refer to the project documentation or create an issue in the repository.  
_สำหรับการสนับสนุนหรือคำถาม กรุณาอ้างอิงเอกสารโปรเจ็คหรือสร้าง issue ในที่เก็บโค้ด_

---

**✨ Made with ❤️ for beautiful wedding invitations | สร้างด้วย ❤️ เพื่อการ์เชิญงานแต่งงานที่สวยงาม**
