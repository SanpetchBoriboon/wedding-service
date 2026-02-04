# Upload API Documentation

## Overview

API สำหรับอัพโหลดรูปภาพไปยัง Firebase Storage และเก็บ URL ใน MongoDB

## Prerequisites

1. Firebase project with Storage enabled
2. Service Account credentials
3. Authentication token (Bearer token)

## Environment Variables

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

## API Endpoints

### 1. Upload Image Only

**POST** `/api/upload/image`

อัพโหลดรูปภาพแล้วได้ URL กลับมา

**Headers:**

```
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data
```

**Body (Form Data):**

- `image`: Image file (required)

**Response (200):**

```json
{
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://storage.googleapis.com/your-bucket/wedding-cards/user123/uuid.jpg",
    "fileName": "wedding-cards/user123/uuid.jpg",
    "originalName": "photo.jpg",
    "size": 1234567,
    "mimeType": "image/jpeg",
    "uploadedBy": "username",
    "uploadedAt": "2026-02-04T10:00:00.000Z"
  }
}
```

### 2. Upload Image and Create/Update Card

**POST** `/api/upload/card-image`

อัพโหลดรูปภาพและสร้าง/อัพเดท wedding card พร้อมกัน

**Headers:**

```
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data
```

**Body (Form Data):**

- `image`: Image file (required)
- `title`: Card title (optional)
- `message`: Card message (optional)
- `cardId`: Card ID for update (optional, ถ้าไม่ใส่จะสร้างใหม่)

**Response (200):**

```json
{
  "message": "Card created with image successfully",
  "data": {
    "card": {
      "_id": "card_id",
      "title": "Beautiful Wedding Card",
      "message": "Wedding invitation message",
      "template": "default",
      "imageUrl": "https://storage.googleapis.com/your-bucket/wedding-cards/user123/uuid.jpg",
      "createdBy": "username",
      "userId": "user_id",
      "createdAt": "2026-02-04T10:00:00.000Z",
      "updatedAt": "2026-02-04T10:00:00.000Z",
      "status": "active"
    },
    "image": {
      "url": "https://storage.googleapis.com/your-bucket/wedding-cards/user123/uuid.jpg",
      "fileName": "wedding-cards/user123/uuid.jpg",
      "originalName": "photo.jpg",
      "size": 1234567,
      "mimeType": "image/jpeg"
    }
  }
}
```

### 3. Delete Image

**DELETE** `/api/upload/image/:fileName`

ลบรูปภาพจาก Firebase Storage (เฉพาะรูปของตัวเอง)

**Headers:**

```
Authorization: Bearer your_jwt_token
```

**URL Parameters:**

- `fileName`: Full file path (e.g., `wedding-cards/user123/uuid.jpg`)

**Response (200):**

```json
{
  "message": "Image deleted successfully",
  "fileName": "wedding-cards/user123/uuid.jpg",
  "deletedBy": "username",
  "deletedAt": "2026-02-04T10:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "No file uploaded",
  "message": "Please select an image to upload"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "You can only delete your own images"
}
```

### 404 Not Found

```json
{
  "error": "File not found",
  "message": "The specified image does not exist"
}
```

### 503 Service Unavailable

```json
{
  "error": "Service unavailable",
  "message": "Firebase storage is not configured"
}
```

## File Constraints

- **Maximum file size:** 5MB
- **Allowed file types:** Images only (image/\*)
- **Storage path:** `wedding-cards/{userId}/{uuid}{extension}`

## Security Features

- JWT authentication required
- Users can only upload to their own directory
- Users can only delete their own files
- File type validation
- File size limits

## Usage Examples

### Postman Testing

#### 1. **Upload Image Only** - `/api/upload/image`

**Request Setup:**

1. Method: **POST**
2. URL: `http://localhost:3000/api/upload/image`
3. **Headers:**
   - `Authorization: Bearer your_jwt_token`
4. **Body:**
   - เลือก **form-data** (ไม่ใช่ raw)
   - เพิ่ม key `image` → เปลี่ยน Type เป็น **File**
   - เลือกไฟล์รูปภาพ

#### 2. **Upload Image and Create Card** - `/api/upload/card-image`

**Request Setup:**

1. Method: **POST**
2. URL: `http://localhost:3000/api/upload/card-image`
3. **Headers:**
   - `Authorization: Bearer your_jwt_token`
4. **Body (form-data):**

| Key       | Type     | Value                                 |
| --------- | -------- | ------------------------------------- |
| `image`   | **File** | เลือกไฟล์รูปภาพ                       |
| `title`   | Text     | "Our Wedding Day"                     |
| `message` | Text     | "Join us on our special day"          |
| `cardId`  | Text     | (optional - ใส่เพื่ออัพเดท card เดิม) |

#### 3. **Delete Image** - `/api/upload/image/:fileName`

**Request Setup:**

1. Method: **DELETE**
2. URL: `http://localhost:3000/api/upload/image/wedding-cards/user123/uuid.jpg`
3. **Headers:**
   - `Authorization: Bearer your_jwt_token`

**⚠️ สำคัญ:** ต้องเปลี่ยน Type ของ `image` field จาก **Text** เป็น **File** ใน form-data

### cURL Examples

1. **Upload Image:**

```bash
curl -X POST \
  http://localhost:3000/api/upload/image \
  -H 'Authorization: Bearer your_jwt_token' \
  -F 'image=@/path/to/your/image.jpg'
```

2. **Create Card with Image:**

```bash
curl -X POST \
  http://localhost:3000/api/upload/card-image \
  -H 'Authorization: Bearer your_jwt_token' \
  -F 'image=@/path/to/your/image.jpg' \
  -F 'title=Our Wedding' \
  -F 'message=Join us on our special day'
```

3. **Delete Image:**

```bash
curl -X DELETE \
  http://localhost:3000/api/upload/image/wedding-cards/user123/uuid.jpg \
  -H 'Authorization: Bearer your_jwt_token'
```

## Firebase Setup Steps

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project

2. **Enable Storage**
   - Go to Storage section
   - Get started with Storage
   - Set up security rules

3. **Generate Service Account**
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file

4. **Extract Credentials**
   - Copy values from downloaded JSON to environment variables
   - Set FIREBASE_STORAGE_BUCKET to `your-project-id.appspot.com`

5. **Storage Security Rules (Optional)**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wedding-cards/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
