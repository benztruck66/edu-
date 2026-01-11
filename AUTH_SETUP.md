# Authentication Setup - Бүртгүүлэх, Нэвтрэх Систем

## ✅ Хийсэн сайжруулалтууд

### 1. **Database Integration**
- Бүртгүүлэх, нэвтрэх одоо database-тай холбогдож байна
- MongoDB User model ашиглаж байна
- Password bcrypt-ээр hash хадгална

### 2. **Security Features**
- Password hashing (bcrypt, 10 salt rounds)
- JWT token authentication
- Token expiration (7 хоног)
- Password strength validation (хамгийн багадаа 6 тэмдэгт)

### 3. **API Endpoints**
- `POST /api/auth/register` - Бүртгүүлэх
- `POST /api/auth/login` - Нэвтрэх
- `GET /api/auth/me` - Одоогийн хэрэглэгчийн мэдээлэл

### 4. **AuthContext сайжруулсан**
- Database-тай холбогдож байна
- JWT token management
- Auto user loading from token
- Error handling сайжруулсан

## 🚀 Setup Алхамууд

### 1. Packages суулгах

```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 2. Environment Variables

`.env` файлд дараах нэмэх:

```env
# JWT Secret (production дээр өөрчлөх хэрэгтэй!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# MongoDB Connection (аль хэдийн байгаа)
DATABASE_URL="mongodb+srv://..."
```

### 3. Database Schema Push

```bash
# Schema-г database-д push хийх
npm run db:push
```

## 📝 API Usage

### Бүртгүүлэх

```typescript
POST /api/auth/register
Content-Type: application/json

{
  "name": "Бат",
  "email": "bat@example.com",
  "password": "password123",
  "phone": "99112233" // Optional
}

Response:
{
  "user": {
    "id": "...",
    "name": "Бат",
    "email": "bat@example.com",
    "role": "USER",
    "phone": "99112233"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Нэвтрэх

```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "bat@example.com",
  "password": "password123"
}

Response:
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Хэрэглэгчийн мэдээлэл авах

```typescript
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "...",
    "name": "Бат",
    "email": "bat@example.com",
    "role": "USER",
    "phone": "99112233",
    "favorites": [],
    "createdAt": "..."
  }
}
```

## 🔒 Security Features

### Password Hashing
- bcrypt ашиглаж байна
- 10 salt rounds
- Plain password database-д хадгалдаггүй

### JWT Tokens
- 7 хоногийн expiration
- Secure token storage (localStorage)
- Auto token validation

### Validation
- Email format validation
- Password minimum length (6 тэмдэгт)
- Duplicate email check

## 🎯 User Roles

Database schema-д дараах roles байна:
- `USER` - Энгийн хэрэглэгч
- `ALUMNI` - Төгсөгч
- `TEACHER` - Багш
- `UNIVERSITY_ADMIN` - Сургуулийн админ
- `SUPER_ADMIN` - Системийн админ

## ⚠️ Анхаарах зүйлс

1. **JWT_SECRET**: Production дээр хүчтэй, санамсаргүй string ашиглах
2. **Password**: Хамгийн багадаа 6 тэмдэгт шаардлагатай
3. **Token Storage**: localStorage-д хадгална (security-ийн хувьд httpOnly cookies илүү сайн)
4. **HTTPS**: Production дээр HTTPS ашиглах шаардлагатай

## 🔧 Troubleshooting

### "bcryptjs module not found"
```bash
npm install bcryptjs @types/bcryptjs
```

### "jsonwebtoken module not found"
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### "JWT_SECRET is not defined"
`.env` файлд `JWT_SECRET` нэмэх хэрэгтэй

### "Email already exists"
Энэ и-мэйл аль хэдийн бүртгэлтэй байна

### "Invalid token"
Token хүчингүй эсвэл дууссан байна. Дахин нэвтрэх хэрэгтэй

## 📈 Дараагийн Алхамууд

1. ✅ Database integration
2. ✅ Password hashing
3. ✅ JWT tokens
4. ⏳ Password reset functionality
5. ⏳ Email verification
6. ⏳ Two-factor authentication
7. ⏳ Session management improvements

