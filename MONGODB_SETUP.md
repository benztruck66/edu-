# MongoDB Setup Guide - Edu Portal

## 📋 Шаардлага

1. MongoDB суулгасан эсвэл MongoDB Atlas бүртгэлтэй байх
2. Node.js 18+ суулгасан байх
3. Prisma суулгасан (аль хэдийн хийгдсэн)

## 🔧 Setup алхамууд

### 1. MongoDB суулгах (Local)

**Windows:**
```bash
# MongoDB Community Edition татаж авах
# https://www.mongodb.com/try/download/community

# MongoDB service эхлүүлэх
net start MongoDB
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. MongoDB Atlas (Cloud) ашиглах (Зөвлөмж)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) дээр бүртгүүлэх
2. Free cluster үүсгэх
3. Database User үүсгэх
4. Network Access дээр IP address нэмэх (0.0.0.0/0 - бүх IP зөвшөөрөх)
5. Connection string авах

### 3. Environment Variables тохируулах

`.env` файл үүсгэх (project root дээр):

```env
# Local MongoDB
DATABASE_URL="mongodb://localhost:27017/edu-portal"

# MongoDB Atlas (жишээ)
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/edu-portal?retryWrites=true&w=majority"

# JWT Secret
JWT_SECRET="your-secret-key-change-this-in-production"
```

### 4. Prisma Client Generate

```bash
npx prisma generate
```

### 5. Database Schema Push

```bash
# Schema-г database-д push хийх
npx prisma db push

# Эсвэл migration ашиглах
npx prisma migrate dev --name init
```

### 6. Seed Data (Optional)

Mock data-г database-д оруулах:

```bash
# prisma/seed.ts файл үүсгэх хэрэгтэй
npx prisma db seed
```

## 📊 Database Schema

### Models:

1. **User** - Хэрэглэгчид (SUPER_ADMIN, UNIVERSITY_ADMIN, TEACHER, ALUMNI, USER)
2. **University** - Их сургуулиуд
3. **UniversityAdmin** - Сургуулийн админ эрх
4. **Review** - Багш нарын шалгуур
5. **Alumni** - Төгсөгчид
6. **Scholarship** - Тэтгэлгүүд
7. **Payment** - Төлбөрийн мэдээлэл
8. **Request** - Хүсэлтүүд

## 🔍 Prisma Studio

Database-г visual харах:

```bash
npx prisma studio
```

Browser дээр `http://localhost:5555` нээгдэнэ.

## 🚀 API Endpoints

### Багш нарын шалгуур

- `GET /api/reviews` - Шалгуурын жагсаалт
- `GET /api/reviews?universityId=xxx` - Тодорхой сургуулийн шалгуур
- `POST /api/reviews` - Шинэ шалгуур нэмэх
- `GET /api/reviews/[id]` - Шалгуурын дэлгэрэнгүй
- `PATCH /api/reviews/[id]` - Шалгуур засах
- `DELETE /api/reviews/[id]` - Шалгуур устгах

### Сургуулийн админ эрх

- `GET /api/university-admin` - Админуудын жагсаалт
- `GET /api/university-admin?universityId=xxx` - Тодорхой сургуулийн админууд
- `POST /api/university-admin` - Админ эрх олгох
- `GET /api/university-admin/[id]` - Админы дэлгэрэнгүй
- `PATCH /api/university-admin/[id]` - Админы эрх засах
- `DELETE /api/university-admin/[id]` - Админ эрх хязгаарлах

### Төгсөгчид

- `GET /api/alumni` - Төгсөгчдийн жагсаалт
- `GET /api/alumni?universityId=xxx` - Тодорхой сургуулийн төгсөгчид
- `POST /api/alumni` - Төгсөгч бүртгэх/шинэчлэх
- `GET /api/alumni/[id]` - Төгсөгчийн дэлгэрэнгүй
- `PATCH /api/alumni/[id]` - Төгсөгчийн мэдээлэл засах
- `DELETE /api/alumni/[id]` - Төгсөгчийн профайл устгах

## 🎯 Дараагийн алхамууд

1. ✅ MongoDB connection
2. ✅ Prisma schema
3. ✅ API routes
4. ⏳ Authentication систем сайжруулах (JWT)
5. ⏳ Frontend компонентууд сайжруулах
6. ⏳ Seed data оруулах

## 📝 Тэмдэглэл

- MongoDB-д ObjectId ашигладаг
- Prisma MongoDB-д embedded documents дэмжихгүй, зөвхөн references
- `@default(auto())` нь MongoDB-д ObjectId үүсгэнэ
- `@db.ObjectId` annotation MongoDB-д заавал шаардлагатай

## 🔗 Холбоосууд

- [Prisma MongoDB Docs](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Prisma Studio](https://www.prisma.io/studio)










