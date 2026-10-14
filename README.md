Edu Portal — Их, дээд сургуулиудын мэдээллийн нэгдсэн систем

## 🚀 Хөгжүүлэлт

### Ажиллуулах:
```bash
# 1. Dependencies суулгах
npm install

# 2. MongoDB холбох (.env файл үүсгэх)
# DATABASE_URL="mongodb://localhost:27017/edu-portal"

# 3. Database setup
npm run db:generate
npm run db:push
npm run db:seed

# 4. Асаах
npm run dev
```

Дэлгэрэнгүй: `QUICK_START.md` файлд байна.

## ✨ Гол боломжууд

### Хэрэглэгчид
- QS хэв маягтай UI, light/dark theme toggle
- Нүүр, Их сургуулиуд, Зэрэглэл, Хөтөлбөрүүд, Харьцуулах хуудсууд
- Хайлт, шүүлтүүр, эрэмбэлэлт, pagination
- AI чатбот, ухаалаг хайлт, зөвлөмж систем
- Skeleton loading, 404, SEO meta

### 🆕 Шинэ функцүүд

#### Сургуулиудын мэдээллийн API 🎓
- Database-аас сургуулиудын мэдээлэл авах
- Шүүлтүүр, хайлт, эрэмбэлэлт, pagination дэмжигдсэн
- CRUD операцууд (Create, Read, Update, Delete)
- API: `/api/universities`
- React hooks: `useUniversities`, `useUniversity`

#### Сургуулийн админ эрх 🎓
- Сургууль бүрт өөрийн админ эрх олгох
- Бусад сургуулиас хамаарахгүй, зөвхөн өөрийн сургуулийн мэдээлэл удирдах
- Эрхийн scope: мэдээлэл засах, тэтгэлэг удирдах, тайлан харах
- API: `/api/university-admin`

### Database
- ✅ MongoDB + Prisma ORM
- ✅ Бүрэн database schema (User, University, Scholarship, Payment, Request)
- ✅ Role-based access control (SUPER_ADMIN, UNIVERSITY_ADMIN, TEACHER, ALUMNI, USER)

## 📁 Файлууд

### Database
- `prisma/schema.prisma` - Database schema
- `src/lib/db.ts` - Prisma client

### API Routes
- `src/app/api/universities/` - Сургуулиудын мэдээллийн API (GET, POST)
- `src/app/api/universities/[id]/` - Тодорхой сургуулийн API (GET, PATCH, DELETE)
- `src/app/api/university-admin/` - Сургуулийн админ эрх API

### Frontend
- `src/app/admin/page.tsx` - Админ хуудас
- `src/hooks/useUniversities.ts` - Сургуулиудын жагсаалт авах hook
- `src/hooks/useUniversity.ts` - Тодорхой сургуулийн мэдээлэл авах hook

## 📚 Документаци

- `QUICK_START.md` - Хурдан эхлэх заавар ⚡
- `MONGODB_SETUP.md` - MongoDB setup зааварчилгаа
- `UNIVERSITIES_API.md` - Сургуулиудын API зааварчилгаа
- `UPGRADE_RECOMMENDATIONS.md` - Сайжруулалтын зөвлөмж

## ✨ Онцлог

- ✅ **Database Integration** - MongoDB + Prisma ORM
- ✅ **API Routes** - RESTful API бүрэн дэмжигдсэн
- ✅ **Fallback System** - Database холбогдохгүй бол mock data ашиглана
- ✅ **Seed Script** - Mock data-г database-д оруулах
- ✅ **Error Handling** - Алдааны мэдэгдэл, fallback механизм

## 🔧 Дараагийн шат

- [x] Database integration
- [x] API routes
- [x] Seed script
- [x] Frontend API integration
- [ ] Authentication систем сайжруулах (JWT, bcrypt)
- [ ] Email систем
- [ ] File upload
- [ ] Real AI integration (OpenAI API)
