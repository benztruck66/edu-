# MongoDB Atlas Setup - Алхам алхмаар зааварчилгаа

## ✅ 1. Cluster үүсгэсэн
- Free tier сонгосон ✓
- Cluster0 нэртэй ✓
- AWS provider ✓
- Seoul region ✓

## 🔐 2. Database User үүсгэх

1. MongoDB Atlas dashboard дээр **"Database Access"** (зүүн талын menu) дарна
2. **"Add New Database User"** товч дарна
3. Дараах мэдээллийг оруулна:
   - **Username**: `edu-portal-user` (эсвэл өөрийн нэр)
   - **Password**: Хүчтэй нууц үг (эсвэл "Autogenerate Secure Password" дарж автоматаар үүсгэнэ)
   - **Database User Privileges**: "Read and write to any database" сонгоно
4. **"Add User"** товч дарна
5. **Нууц үгийг хадгална уу!** (дараа дахин харах боломжгүй)

## 🌐 3. Network Access тохируулах

1. **"Network Access"** (зүүн талын menu) дарна
2. **"Add IP Address"** товч дарна
3. **"Allow Access from Anywhere"** сонгоно (0.0.0.0/0)
   - Эсвэл зөвхөн өөрийн IP address нэмнэ
4. **"Confirm"** товч дарна

## 🔗 4. Connection String авах

1. **"Database"** (зүүн талын menu) дарна
2. **"Connect"** товч дарна (Cluster0-ийн хажууд)
3. **"Connect your application"** сонгоно
4. **Driver**: Node.js
5. **Version**: Latest
6. Connection string харагдана, жишээ:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. `<username>` болон `<password>`-ийг өөрийн database user мэдээллээр солино
8. Connection string-ийг хуулж авна

## ⚙️ 5. .env файлд оруулах

Project root дээр `.env` файл үүсгэх (эсвэл засах):

```env
DATABASE_URL="mongodb+srv://edu-portal-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/edu-portal?retryWrites=true&w=majority"
```

**Анхаар:** 
- `YOUR_PASSWORD`-ийг өөрийн нууц үгээр солино
- Нууц үгэнд тусгай тэмдэгт байвал URL encode хийх хэрэгтэй:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`
  - `?` → `%3F`

## 🚀 6. Database Setup

```bash
# Prisma client generate
npm run db:generate

# Database schema push
npm run db:push

# Seed data оруулах
npm run db:seed
```

## ✅ 7. Шалгах

```bash
# Development server асаах
npm run dev
```

Browser дээр `http://localhost:3000` нээж, их сургуулиудын жагсаалт харагдах эсэхийг шалгана.

## 🔍 Troubleshooting

### Connection error гарч байна?
1. Network Access дээр IP address нэмсэн эсэхийг шалгах
2. Database user нууц үг зөв эсэхийг шалгах
3. Connection string-д database нэр (`edu-portal`) байгаа эсэхийг шалгах

### Authentication failed?
- Database user-ийн нууц үг зөв эсэхийг шалгах
- Нууц үгэнд тусгай тэмдэгт байвал URL encode хийх

### Timeout error?
- Network Access дээр IP address нэмсэн эсэхийг шалгах
- Firewall эсвэл VPN ашиглаж байгаа эсэхийг шалгах

## 📝 Тэмдэглэл

- Free tier нь 512 MB storage, shared resources
- Development/test зориулалтаар хангалттай
- Production-д upgrade хийх боломжтой
- Cluster үүсгэхэд 1-3 минут зарцуулна

## 🎯 Дараагийн алхам

1. ✅ Cluster үүсгэсэн
2. ⏳ Database User үүсгэх
3. ⏳ Network Access тохируулах
4. ⏳ Connection String авах
5. ⏳ .env файлд оруулах
6. ⏳ Database setup хийх










