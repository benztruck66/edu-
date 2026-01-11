# 🔐 Админ эрхийн мэдээлэл

## Системийн Админ (SUPER_ADMIN)

### Нэвтрэх мэдээлэл:
- **Email:** `admin@edu-portal.mn`
- **Password:** `admin123`
- **Name:** Системийн Админ
- **Role:** SUPER_ADMIN
- **Phone:** +976-99112233

## ⚠️ Анхаарах зүйлс:

1. **Production дээр нууц үгээ солих хэрэгтэй!**
   - Одоогийн нууц үг: `admin123` (development зориулалт)
   - Production дээр хүчтэй нууц үг ашиглах

2. **Админ хэрэглэгч үүсгэх:**
   ```bash
   npm run db:seed
   ```
   Энэ командыг ажиллуулахад админ хэрэглэгч автоматаар үүснэ.

3. **Нэвтрэх:**
   - `/login` хуудас руу орох
   - Email: `admin@edu-portal.mn`
   - Password: `admin123`

4. **Админ хуудас:**
   - Нэвтрэсний дараа `/admin` хуудас руу орох боломжтой

## 🔒 Security:

- Password нь bcrypt ашиглан hash хийгдсэн байна
- JWT token ашиглан authentication хийгддэг
- Token 7 хоногийн хугацаатай

