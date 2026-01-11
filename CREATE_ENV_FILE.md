# .env файл үүсгэх зааварчилгаа

## Windows дээр үүсгэх:

### Арга 1: PowerShell ашиглах

1. PowerShell нээх (edu-portal folder дээр)
2. Дараах командыг ажиллуулах:

```powershell
cd edu-portal
New-Item -Path .env -ItemType File
```

3. `.env` файлд дараах агуулгыг оруулах (Notepad эсвэл VS Code ашиглах):

```env
DATABASE_URL="mongodb+srv://benztruck66:YOUR_PASSWORD@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"
```

**Анхаар:** `YOUR_PASSWORD`-ийг өөрийн бодит нууц үгээр солино уу!

### Арга 2: VS Code ашиглах (Хамгийн хялбар)

1. VS Code дээр `edu-portal` folder нээх
2. File → New File (Ctrl+N)
3. Дараах агуулгыг бичих:

```env
DATABASE_URL="mongodb+srv://benztruck66:YOUR_PASSWORD@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"
```

4. File → Save As (Ctrl+Shift+S)
5. Файлын нэрийг `.env` гэж бичих (бүх extension-ийг солих)
6. Save товч дарна

### Арга 3: Notepad ашиглах

1. Notepad нээх
2. Дараах агуулгыг бичих:

```env
DATABASE_URL="mongodb+srv://benztruck66:YOUR_PASSWORD@cluster0.tx470lz.mongodb.net/edu-portal?retryWrites=true&w=majority&appName=Cluster0"
```

3. File → Save As
4. File name: `.env` (бүх файлын төрөл солих: "All Files")
5. Save location: `C:\Users\vivse\Desktop\edu\edu-portal\`
6. Save товч дарна

## ⚠️ Анхаарах зүйлс:

1. **Файлын нэрийг яг `.env` гэж бичих** (өмнөх цэг байх ёстой)
2. **`YOUR_PASSWORD`-ийг солих** - MongoDB Atlas дээр database user үүсгэхдээ өгсөн нууц үг
3. **Нууц үгэнд тусгай тэмдэгт байвал URL encode хийх:**
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `=` → `%3D`
   - `?` → `%3F`

## ✅ Шалгах:

`.env` файл үүсгэсний дараа:

```bash
cd edu-portal
npm run db:generate
npm run db:push
npm run db:seed
```

Хэрэв алдаа гарвал `.env` файлын байршил, нэрийг шалгана уу.










