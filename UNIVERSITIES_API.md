# Сургуулиудын мэдээллийн API - Зааварчилгаа

## 📋 API Endpoints

### 1. Бүх сургуулиудын жагсаалт

**GET** `/api/universities`

**Query Parameters:**
- `city` (optional) - Хот шүүх (жишээ: "Улаанбаатар")
- `program` (optional) - Хөтөлбөр шүүх (жишээ: "Компьютер")
- `search` (optional) - Хайлт (нэр, тайлбар, хот)
- `sortBy` (optional) - Эрэмбэлэх: "rank" (default), "name", "tuition", "acceptance"
- `page` (optional) - Хуудасны дугаар (default: 1)
- `pageSize` (optional) - Хуудас бүрт хэдэн (default: 50)

**Жишээ:**
```bash
# Бүх сургууль
GET /api/universities

# Улаанбаатар хотын сургуулиуд
GET /api/universities?city=Улаанбаатар

# Компьютер хөтөлбөртэй сургуулиуд
GET /api/universities?program=Компьютер

# Хайлт
GET /api/universities?search=МУИС

# Эрэмбэлэлт
GET /api/universities?sortBy=name

# Pagination
GET /api/universities?page=1&pageSize=10
```

**Response:**
```json
{
  "universities": [
    {
      "id": "...",
      "name": "Монгол Улсын Их Сургууль",
      "city": "Улаанбаатар",
      "qsRank": 751,
      "programs": ["Компьютер", "Эдийн засаг"],
      "description": "...",
      "website": "https://...",
      "email": "...",
      "phone": "...",
      "tuitionMntPerYear": 4500000,
      "acceptanceRatePct": 35,
      "logo": "...",
      "images": [],
      "scholarships": [...],
      "payments": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 12,
    "totalPages": 1
  }
}
```

---

### 2. Тодорхой сургуулийн дэлгэрэнгүй

**GET** `/api/universities/[id]`

**Жишээ:**
```bash
GET /api/universities/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "university": {
    "id": "...",
    "name": "...",
    "city": "...",
    "qsRank": 751,
    "programs": [...],
    "description": "...",
    "website": "...",
    "email": "...",
    "phone": "...",
    "tuitionMntPerYear": 4500000,
    "acceptanceRatePct": 35,
    "logo": "...",
    "images": [...],
    "scholarships": [
      {
        "id": "...",
        "name": "Суралцагчийн тэтгэлэг",
        "type": "MERIT",
        "amountMnt": 1500000,
        "description": "...",
        "requirements": [...],
        "deadline": "...",
        "isActive": true
      }
    ],
    "payments": [
      {
        "id": "...",
        "program": "Компьютер",
        "tuitionMnt": 4500000,
        "period": "жил",
        "academicYear": "2024"
      }
    ],
    "admins": [
      {
        "id": "...",
        "canEditInfo": true,
        "canManageScholarships": true,
        "canViewReports": true,
        "user": {
          "id": "...",
          "name": "...",
          "email": "..."
        }
      }
    ]
  }
}
```

---

### 3. Шинэ сургууль нэмэх

**POST** `/api/universities`

**Request Body:**
```json
{
  "name": "Монгол Улсын Их Сургууль",
  "city": "Улаанбаатар",
  "qsRank": 751,
  "programs": ["Компьютер", "Эдийн засаг", "Физик"],
  "description": "Монголын тэргүүлэгч судалгааны их сургууль",
  "website": "https://www.num.edu.mn",
  "email": "info@num.edu.mn",
  "phone": "+976-11-123456",
  "tuitionMntPerYear": 4500000,
  "acceptanceRatePct": 35,
  "logo": "https://...",
  "images": ["https://...", "https://..."]
}
```

**Response:** 201 Created
```json
{
  "university": { ... }
}
```

---

### 4. Сургуулийн мэдээлэл засах

**PATCH** `/api/universities/[id]`

**Request Body:**
```json
{
  "name": "Шинэ нэр",
  "qsRank": 700,
  "programs": ["Шинэ хөтөлбөр"]
}
```

**Response:**
```json
{
  "university": { ... }
}
```

---

### 5. Сургууль устгах

**DELETE** `/api/universities/[id]`

**Response:**
```json
{
  "message": "University deleted successfully"
}
```

---

## 🔧 Frontend дээр ашиглах

### React Hook үүсгэх

```typescript
// src/hooks/useUniversities.ts
import { useState, useEffect } from 'react';

export function useUniversities(filters?: {
  city?: string;
  program?: string;
  search?: string;
  sortBy?: string;
  page?: number;
}) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUniversities() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters?.city) params.append('city', filters.city);
        if (filters?.program) params.append('program', filters.program);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.page) params.append('page', filters.page.toString());

        const res = await fetch(`/api/universities?${params}`);
        const data = await res.json();
        setUniversities(data.universities);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUniversities();
  }, [filters]);

  return { universities, loading, error };
}
```

### Компонент дээр ашиглах

```typescript
// src/app/universities/page.tsx
"use client";
import { useUniversities } from "@/hooks/useUniversities";

export default function UniversitiesPage() {
  const { universities, loading, error } = useUniversities({
    city: "Улаанбаатар",
    sortBy: "rank"
  });

  if (loading) return <div>Уншиж байна...</div>;
  if (error) return <div>Алдаа гарлаа</div>;

  return (
    <div>
      {universities.map(uni => (
        <div key={uni.id}>{uni.name}</div>
      ))}
    </div>
  );
}
```

---

## 📝 Тэмдэглэл

- MongoDB-д ObjectId ашигладаг
- Array fields (programs, images) нь MongoDB array
- Pagination дэмжигдсэн
- Шүүлтүүр, хайлт, эрэмбэлэлт дэмжигдсэн
- Тэтгэлэг, төлбөрийн мэдээлэл автоматаар join хийгдэнэ

---

## 🚀 Дараагийн алхам

1. Frontend компонентуудыг API-тай холбох
2. Mock data-г database-д оруулах (seed script)
3. Error handling сайжруулах
4. Caching нэмэх (optional)










