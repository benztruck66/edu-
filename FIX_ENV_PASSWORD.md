# ⚠️ .env файлд нууц үг оруулах

## Одоогийн байдал:

`.env` файлд connection string оруулсан, гэхдээ `YOUR_PASSWORD` гэж placeholder байна.

## 🔧 Засах:

### Арга 1: VS Code ашиглах (Хамгийн хялбар)

1. VS Code дээр `.env` файл нээх
2. `YOUR_PASSWORD`-ийг олох
3. MongoDB Atlas дээр database user үүсгэхдээ өгсөн **бодит нууц үгээр** солих
4. Save (Ctrl+S)

**Жишээ:**
```env
# Өмнө:
DATABASE_URL="mongodb+srv://benztruck66:YOUR_PASSWORD@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"

# Дараа (нууц үг: mypassword123):
DATABASE_URL="mongodb+srv://benztruck66:mypassword123@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"
```

### Арга 2: PowerShell ашиглах

PowerShell дээр дараах командыг ажиллуулах (нууц үгээ солих):

```powershell
$password = "YOUR_ACTUAL_PASSWORD"
$connectionString = "mongodb+srv://benztruck66:$password@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"
@"
DATABASE_URL="$connectionString"
JWT_SECRET="your-secret-key-change-this-in-production"
"@ | Out-File -FilePath .env -Encoding utf8
```

## ⚠️ Нууц үгэнд тусгай тэмдэгт байвал:

Нууц үгэнд дараах тэмдэгтүүд байвал URL encode хийх хэрэгтэй:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

**Жишээ:** Нууц үг: `pass@word#123`
- URL encoded: `pass%40word%23123`

## ✅ Шалгах:

Нууц үг оруулсны дараа:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Хэрэв алдаа гарвал:
- Нууц үг зөв эсэхийг шалгах
- Network Access дээр IP address нэмсэн эсэхийг шалгах
- Database user үүсгэсэн эсэхийг шалгах










