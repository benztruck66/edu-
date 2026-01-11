# AI Features - Edu Portal

Энэхүү системд AI-д суурилсан хэд хэдэн функц нэмэгдсэн.

## Нэмэгдсэн AI функцүүд

### 1. AI Чатбот 🤖
- **Байршил**: Баруун доод буланд floating button байрлана
- **Функц**: 
  - Их сургуулиудын мэдээлэл өгөх
  - Хөтөлбөр сонголтод зөвлөмж өгөх
  - Элсэлтийн асуудлаар туслах
  - Тэтгэлэг, төлбөрийн мэдээлэл өгөх

**API**: `/api/ai/chat` (POST)

### 2. AI-д суурилсан ухаалаг хайлт 🔍
- **Байршил**: Нүүр хуудас дээр хайлтын хэсэг
- **Функц**:
  - Их сургуулиудын нэр, хот, хөтөлбөрөөр хайх
  - Семантик хайлт (ухаалаг matching)
  - Хөтөлбөрүүдийг шууд хайх
  - Score-оор эрэмбэлэх

**API**: `/api/ai/search` (POST)

### 3. AI зөвлөмж систем 💡
- **Байршил**: `/guidance` хуудас
- **Функц**:
  - Хэрэглэгчийн сонирхол, чадварт суурилсан зөвлөмж
  - Карьерын зорилготой тохирох хөтөлбөр санал болгох
  - Их сургуулиудын зэрэглэлийг харгалзан зөвлөмж өгөх
  - AI болон энгийн зөвлөмжийг toggle-оор солих боломжтой

**API**: `/api/ai/recommend` (POST)

## Хэрхэн ашиглах

### AI Чатбот
1. Баруун доод буланд байрлах AI button дарах
2. Асуулт асуух (жишээ: "Компьютер хөтөлбөртэй их сургуулиуд юу вэ?")
3. AI хариулт авна

### Ухаалаг хайлт
1. Нүүр хуудас дээр хайлтын талбарт бичих
2. AI автоматаар илүү нарийвчлалтай үр дүн өгнө
3. Хөтөлбөр эсвэл их сургууль сонгох

### AI зөвлөмж
1. `/guidance` хуудас руу орох
2. Сонирхол, чадвараа slider-ээр тохируулах
3. Карьерын зорилго сонгох
4. "AI зөвлөмж" checkbox-ийг идэвхжүүлэх
5. AI-ийн зөвлөмжийг харах

## Дараагийн шат

### OpenAI API интеграци
Илүү хүчирхэг AI функц хэрэглэхийн тулд OpenAI API эсвэл өөр AI сервис холбож болно:

1. **OpenAI API** ашиглах:
   ```bash
   npm install openai
   ```

2. Environment variable нэмэх (`.env.local`):
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. `/api/ai/chat/route.ts` файлд OpenAI integration нэмэх

### Өөр AI сервисүүд
- Google Gemini API
- Anthropic Claude API
- Local LLM (Ollama, LM Studio)

## Техникийн мэдээлэл

- **Frontend**: React + TypeScript + Next.js
- **API Routes**: Next.js API Routes
- **AI Logic**: Rule-based system (OpenAI API болгох боломжтой)
- **State Management**: React hooks (useState, useEffect)

## Файлууд

- `src/components/AIChatbot.tsx` - AI чатбот компонент
- `src/components/AISearchBar.tsx` - AI хайлт компонент
- `src/app/api/ai/chat/route.ts` - Чатбот API
- `src/app/api/ai/search/route.ts` - Хайлт API
- `src/app/api/ai/recommend/route.ts` - Зөвлөмж API

## Тэмдэглэл

Одоогоор AI функцүүд rule-based системийг ашиглаж байна. OpenAI API эсвэл өөр AI сервис холбосноор илүү ухаалаг хариулт авах боломжтой.
