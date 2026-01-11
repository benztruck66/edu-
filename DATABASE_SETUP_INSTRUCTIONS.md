# Database Schema Setup - Event Registration

## ⚠️ Алдаа: "Cannot read properties of undefined (reading 'findUnique')"

Энэ алдаа нь database schema push хийгдээгүй эсвэл Prisma client generate хийгдээгүй гэсэн үг.

## 🔧 Шийдэл:

### 1. Dev Server зогсоох
- Terminal дээр `Ctrl+C` дарах
- Эсвэл VS Code/Cursor дээрх terminal-ийг хаах

### 2. Database Schema Push хийх

```bash
cd edu-portal

# 1. Prisma client generate хийх
npm run db:generate

# 2. Database-д schema push хийх
npm run db:push
```

### 3. Dev Server дахин эхлүүлэх

```bash
npm run dev
```

## ✅ Хийгдсэн зүйлс:

- ✅ Event model schema-д нэмсэн
- ✅ EventRegistration model schema-д нэмсэн  
- ✅ NewsletterSubscription model schema-д нэмсэн
- ✅ API routes бэлэн
- ⏳ Database schema push хийх шаардлагатай

## 📝 Тайлбар:

Schema push хийсний дараа:
- `prisma.event` ажиллана
- `prisma.eventRegistration` ажиллана
- `prisma.newsletterSubscription` ажиллана
- 500 алдаа арилна

## 🚨 Хэрэв алдаа гарвал:

**File lock алдаа:**
```bash
# Windows PowerShell дээр:
Get-Process node | Stop-Process

# Дараа нь дахин оролдох:
cd edu-portal
npm run db:generate
npm run db:push
```

**Prisma client алдаа:**
```bash
# node_modules/.prisma-г устгаад дахин generate хийх:
rm -rf node_modules/.prisma
npm run db:generate
```




