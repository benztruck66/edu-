# 🔗 MongoDB Connection String - Зааварчилгаа

## Таны Connection String:

```
mongodb+srv://benztruck66:<db_password>@cluster0.tx470lz.mongodb.net/?appName=Cluster0
```

## ⚠️ Анхаарах зүйлс:

1. **`<db_password>`-ийг солих хэрэгтэй!**
   - MongoDB Atlas дээр database user үүсгэхдээ өгсөн нууц үгээр солино
   - Нууц үгэнд тусгай тэмдэгт байвал URL encode хийх:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `=` → `%3D`
     - `?` → `%3F`

2. **Database нэрийг нэмэх хэрэгтэй!**
   - Connection string-д `/edu-portal` нэмэх хэрэгтэй

## ✅ Зөв формат:

```
mongodb+srv://benztruck66:YOUR_ACTUAL_PASSWORD@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0
```

## 📝 .env файл үүсгэх:

Project root дээр (edu-portal/) `.env` файл үүсгэх:

```env
# MongoDB Atlas Connection String
DATABASE_URL="mongodb+srv://benztruck66:YOUR_ACTUAL_PASSWORD@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"

# JWT Secret (optional)
JWT_SECRET="your-secret-key-change-this-in-production"
```

## 🚀 Дараагийн алхам:

1. `.env` файл үүсгэх
2. `YOUR_ACTUAL_PASSWORD`-ийг өөрийн нууц үгээр солих
3. Database setup хийх:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. Server асаах:

```bash
npm run dev
```

## 🔍 Шалгах:

Browser дээр `http://localhost:3000` нээж, их сургуулиудын жагсаалт харагдах эсэхийг шалгана.

Хэрэв алдаа гарвал:
- Database user нууц үг зөв эсэхийг шалгах
- Network Access дээр IP address нэмсэн эсэхийг шалгах
- Connection string-д database нэрийг (`/edu-portal`) нэмсэн эсэхийг шалгах










