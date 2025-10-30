import { mockUniversities } from "@/mock/data";
import { notFound } from "next/navigation";
import { UniversityCard } from "@/components/UniversityCard";

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const decoded = decodeURIComponent(city);
  const list = mockUniversities.filter((u) => u.city === decoded);
  if (list.length === 0) return notFound();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">{decoded}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((u) => (
          <UniversityCard key={u.id} uni={u} />
        ))}
      </div>
    </section>
  );
}


