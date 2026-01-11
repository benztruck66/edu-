# 🚀 Хурдан эхлэх заавар - Edu Portal

## 1️⃣ MongoDB холбох

### Local MongoDB:
```bash
# MongoDB суулгах (Windows)
# https://www.mongodb.com/try/download/community

# MongoDB service эхлүүлэх
net start MongoDB
```

### MongoDB Atlas (Cloud - Зөвлөмж):
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) дээр бүртгүүлэх
2. Free cluster үүсгэх
3. Database User үүсгэх
4. Network Access дээр IP address нэмэх (0.0.0.0/0)
5. Connection string авах

## 2️⃣ Environment Variables

`.env` файл үүсгэх (project root дээр):

```env
# Local MongoDB
DATABASE_URL="mongodb://localhost:27017/edu-portal"

# MongoDB Atlas (жишээ)
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/edu-portal?retryWrites=true&w=majority"
```

## 3️⃣ Database Setup

```bash
# Prisma client generate
npm run db:generate

# Database schema push
npm run db:push

# Seed data оруулах (mock data database-д оруулах)
npm run db:seed
```

## 4️⃣ Асаах

```bash
npm run dev
```

Browser дээр: `http://localhost:3000`

## ✅ Бэлэн!

Одоо систем database-тай холбогдож, бодит мэдээлэл ашиглаж байна.

## 🔧 Troubleshooting

### Database холбогдохгүй байна?
- `.env` файл байгаа эсэхийг шалгах
- `DATABASE_URL` зөв эсэхийг шалгах
- MongoDB service ажиллаж байгаа эсэхийг шалгах

### Seed data оруулаагүй байна?
```bash
npm run db:seed
```

### Prisma client generate хийх хэрэгтэй?
```bash
npm run db:generate
```

## 📝 Командууд

- `npm run dev` - Development server асаах
- `npm run build` - Production build хийх
- `npm run db:generate` - Prisma client generate
- `npm run db:push` - Database schema push
- `npm run db:seed` - Seed data оруулах

## 🎯 Дараагийн алхам

1. ✅ Database холбох
2. ✅ Seed data оруулах
3. ⏳ Authentication систем сайжруулах
4. ⏳ Сургуулийн админ эрх олгох
5. ⏳ Тэтгэлэг, төлбөрийн мэдээлэл нэмэх










