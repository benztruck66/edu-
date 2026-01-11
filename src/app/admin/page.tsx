"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUniversities } from "@/hooks/useUniversities";
import Link from "next/link";

type TabType = "stats" | "universities" | "users" | "university-admins" | "scholarships" | "requests";

// Их сургуулиудын tab компонент
function UniversitiesTab({ universities, loading }: { universities: any[]; loading: boolean }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    qsRank: "",
    programs: [] as string[],
    description: "",
    website: "",
    email: "",
    phone: "",
    tuitionMntPerYear: "",
    acceptanceRatePct: "",
    logo: "",
  });
  const [selectedProgram, setSelectedProgram] = useState("");

  const allPrograms = [
    "Компьютер", "Программ хангамж", "Мэдээллийн технологи", "Мэдээллийн систем",
    "Мультимедиа технологи", "Компьютерын сүлжээ", "Математик", "Физик", "Хими",
    "Биологи", "Газар зүй", "Биотехнологи", "Түүх", "Гадаад хэл", "Хэл шинжлэл",
    "Утга зохиол", "Нийгмийн ажил", "Сэтгүүл зүй", "Эдийн засаг", "Санхүү",
    "Нягтлан бодох бүртгэл", "Маркетинг", "Менежмент", "Худалдаа", "Жуулчлал",
    "Хууль зүй", "Олон улсын харилцаа", "Удирдлага", "Улс төр", "Анагаах ухаан",
    "Эм зүй", "Стоматологи", "Эмнэлгийн лаботори", "Хөдөө аж ахуй", "Мал эмнэлэг",
    "Архитектур", "Барилга", "Инженерчлэл", "Механик инженерчлэл", "Цахилгаан инженерчлэл",
    "Химийн инженерчлэл", "Геологи", "Уул уурхай", "Байгаль хамгаалал", "Бизнес удирдлага",
  ];

  const handleAddProgram = () => {
    if (selectedProgram && !formData.programs.includes(selectedProgram)) {
      setFormData({ ...formData, programs: [...formData.programs, selectedProgram] });
      setSelectedProgram("");
    }
  };

  const handleRemoveProgram = (program: string) => {
    setFormData({ ...formData, programs: formData.programs.filter(p => p !== program) });
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.name || !formData.city || !formData.qsRank || formData.programs.length === 0) {
      alert("Нэр, хот, QS Rank, хөтөлбөр заавал оруулах ёстой");
      return;
    }

    try {
      const url = isEdit ? `/api/universities/${editingUniversity.id}` : "/api/universities";
      const method = isEdit ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          qsRank: parseInt(formData.qsRank),
          tuitionMntPerYear: formData.tuitionMntPerYear ? parseInt(formData.tuitionMntPerYear) : null,
          acceptanceRatePct: formData.acceptanceRatePct ? parseFloat(formData.acceptanceRatePct) : null,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setShowEditModal(false);
        setFormData({
          name: "", city: "", qsRank: "", programs: [], description: "",
          website: "", email: "", phone: "", tuitionMntPerYear: "", acceptanceRatePct: "", logo: "",
        });
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      alert("Алдаа гарлаа");
    }
  };

  const handleEdit = (university: any) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name || "",
      city: university.city || "",
      qsRank: university.qsRank?.toString() || "",
      programs: university.programs || [],
      description: university.description || "",
      website: university.website || "",
      email: university.email || "",
      phone: university.phone || "",
      tuitionMntPerYear: university.tuitionMntPerYear?.toString() || "",
      acceptanceRatePct: university.acceptanceRatePct?.toString() || "",
      logo: university.logo || "",
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Нийт {loading ? "..." : universities.length} их сургууль бүртгэгдсэн
        </p>
        <button
          onClick={() => {
            setFormData({
              name: "", city: "", qsRank: "", programs: [], description: "",
              website: "", email: "", phone: "", tuitionMntPerYear: "", acceptanceRatePct: "", logo: "",
            });
            setShowAddModal(true);
          }}
          className="rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700 transition"
        >
          ➕ Шинэ их сургууль нэмэх
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">Ачааллаж байна...</div>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-white/5">
                <tr>
                  <th className="text-left p-3 font-medium">Нэр</th>
                  <th className="text-left p-3 font-medium">Хот</th>
                  <th className="text-left p-3 font-medium">QS Rank</th>
                  <th className="text-left p-3 font-medium">Хөтөлбөр</th>
                  <th className="text-left p-3 font-medium">Төлбөр</th>
                  <th className="text-left p-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((u) => (
                  <tr key={u.id} className="border-t border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/50 dark:hover:bg-white/5">
                    <td className="p-3 font-medium">
                      <Link href={`/universities/${u.id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                        {u.name}
                      </Link>
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.city}</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.qsRank}</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.programs?.length || 0} хөтөлбөр</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">
                      {u.tuitionMntPerYear ? `${(u.tuitionMntPerYear / 1000000).toFixed(1)}M₮` : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                        >
                          Засах
                        </button>
                        <button 
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (confirm(`"${u.name}" сургуулийг устгах уу?`)) {
                              try {
                                const token = localStorage.getItem("edu_portal_token");
                                if (!token) {
                                  alert("❌ Алдаа: Нэвтрэх шаардлагатай");
                                  return;
                                }
                                
                                const res = await fetch(`/api/universities/${u.id}`, {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                });
                                
                                if (res.ok) {
                                  // Амжилттай бол reload хийх
                                  window.location.reload();
                                } else {
                                  // Алдаа гарвал зөвхөн мэдэгдэл харуулах, login руу чиглүүлэхгүй
                                  const data = await res.json().catch(() => ({ error: "Алдаа гарлаа" }));
                                  const errorMessage = data.error || "Сургууль устгахад алдаа гарлаа";
                                  
                                  if (res.status === 401) {
                                    alert(`❌ Алдаа: Нэвтрэх шаардлагатай. ${errorMessage}`);
                                  } else if (res.status === 403) {
                                    alert(`❌ Алдаа: Эрх хүрэхгүй. ${errorMessage}`);
                                  } else {
                                    alert(`❌ Алдаа: ${errorMessage}`);
                                  }
                                }
                              } catch (error) {
                                console.error("Delete error:", error);
                                alert("❌ Алдаа: Сургууль устгахад алдаа гарлаа");
                              }
                            }
                          }}
                          className="text-red-600 dark:text-red-400 hover:underline text-xs"
                        >
                          Устгах
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Шинэ их сургууль нэмэх</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Нэр *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Хот *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">QS Rank *</label>
                  <input
                    type="number"
                    value={formData.qsRank}
                    onChange={(e) => setFormData({ ...formData, qsRank: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Төлбөр (₮)</label>
                  <input
                    type="number"
                    value={formData.tuitionMntPerYear}
                    onChange={(e) => setFormData({ ...formData, tuitionMntPerYear: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Вебсайт</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">И-мэйл</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Тайлбар</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Хөтөлбөрүүд *</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  >
                    <option value="">Хөтөлбөр сонгох</option>
                    {allPrograms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddProgram}
                    className="rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
                  >
                    Нэмэх
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.programs.map((p) => (
                    <span key={p} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1">
                      {p}
                      <button onClick={() => handleRemoveProgram(p)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
                >
                  Цуцлах
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex-1 rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700"
                >
                  Нэмэх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Их сургууль засах</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Нэр *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Хот *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">QS Rank *</label>
                  <input
                    type="number"
                    value={formData.qsRank}
                    onChange={(e) => setFormData({ ...formData, qsRank: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Төлбөр (₮)</label>
                  <input
                    type="number"
                    value={formData.tuitionMntPerYear}
                    onChange={(e) => setFormData({ ...formData, tuitionMntPerYear: e.target.value })}
                    className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Тайлбар</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Хөтөлбөрүүд *</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                  >
                    <option value="">Хөтөлбөр сонгох</option>
                    {allPrograms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddProgram}
                    className="rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
                  >
                    Нэмэх
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.programs.map((p) => (
                    <span key={p} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1">
                      {p}
                      <button onClick={() => handleRemoveProgram(p)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
                >
                  Цуцлах
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  className="flex-1 rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Хэрэглэгчдийн tab компонент
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("edu_portal_token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await fetch(`/api/users?${params.toString()}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Хэрэглэгчид удирдах ({loading ? "..." : users.length})
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хайх..."
            className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
          />
            <button
              onClick={() => {
                setShowAddUserModal(true);
              }}
              className="rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700 transition"
            >
              ➕ Шинэ хэрэглэгч нэмэх
            </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">Ачааллаж байна...</div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Хэрэглэгч олдсонгүй
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-white/5">
                <tr>
                  <th className="text-left p-3 font-medium">Нэр</th>
                  <th className="text-left p-3 font-medium">И-мэйл</th>
                  <th className="text-left p-3 font-medium">Эрх</th>
                  <th className="text-left p-3 font-medium">Утас</th>
                  <th className="text-left p-3 font-medium">Бүртгүүлсэн</th>
                  <th className="text-left p-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/50 dark:hover:bg-white/5">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        u.role === "SUPER_ADMIN" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" :
                        u.role === "UNIVERSITY_ADMIN" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                        u.role === "TEACHER" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                        u.role === "ALUMNI" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                        "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      }`}>
                        {u.role === "SUPER_ADMIN" ? "Админ" :
                         u.role === "UNIVERSITY_ADMIN" ? "Сургуулийн админ" :
                         u.role === "TEACHER" ? "Багш" :
                         u.role === "ALUMNI" ? "Төгсөгч" :
                         "Хэрэглэгч"}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{u.phone || "-"}</td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('mn-MN') : "-"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          alert("Хэрэглэгч засах функц хөгжүүлэгдэж байна");
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2"
                      >
                        Засах
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`"${u.name}" хэрэглэгчийг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`)) {
                            return;
                          }
                          
                          try {
                            const token = localStorage.getItem("edu_portal_token");
                            const res = await fetch(`/api/users/${u.id}`, {
                              method: "DELETE",
                              headers: token ? {
                                Authorization: `Bearer ${token}`,
                              } : {},
                            });

                            if (res.ok) {
                              alert("✅ Хэрэглэгч амжилттай устгагдлаа");
                              fetchUsers(); // Жагсаалтыг шинэчлэх
                            } else {
                              const data = await res.json();
                              alert(`❌ Алдаа: ${data.error || "Хэрэглэгч устгахад алдаа гарлаа"}`);
                            }
                          } catch (error: any) {
                            console.error("Error deleting user:", error);
                            alert(`❌ Алдаа: ${error.message || "Хэрэглэгч устгахад алдаа гарлаа"}`);
                          }
                        }}
                        className="text-red-600 dark:text-red-400 hover:underline text-xs"
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddUserModal(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Шинэ хэрэглэгч нэмэх</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Нэр *</label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">И-мэйл *</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Нууц үг *</label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Утас</label>
                <input
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-600 dark:text-zinc-400 block mb-1">Эрх</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
                >
                  <option value="USER">Хэрэглэгч</option>
                  <option value="ALUMNI">Төгсөгч</option>
                  <option value="TEACHER">Багш</option>
                  <option value="UNIVERSITY_ADMIN">Сургуулийн админ</option>
                  <option value="SUPER_ADMIN">Системийн админ</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setUserFormData({ name: "", email: "", password: "", phone: "", role: "USER" });
                  }}
                  className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-white/10"
                >
                  Цуцлах
                </button>
                <button
                  onClick={async () => {
                    if (!userFormData.name || !userFormData.email || !userFormData.password) {
                      alert("Нэр, и-мэйл, нууц үг заавал оруулах ёстой");
                      return;
                    }
                    try {
                      const res = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userFormData),
                      });
                      if (res.ok) {
                        setShowAddUserModal(false);
                        setUserFormData({ name: "", email: "", password: "", phone: "", role: "USER" });
                        fetchUsers();
                        alert("Хэрэглэгч амжилттай нэмэгдлээ");
                      } else {
                        const data = await res.json();
                        alert(data.error || "Алдаа гарлаа");
                      }
                    } catch (error) {
                      alert("Алдаа гарлаа");
                    }
                  }}
                  className="flex-1 rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700"
                >
                  Нэмэх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Сургуулийн админуудын tab компонент
function UniversityAdminsTab() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { universities } = useUniversities({ pageSize: 100 });

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (userSearch.length >= 2) {
      searchUsers();
    } else {
      setUserSearchResults([]);
    }
  }, [userSearch]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch("/api/university-admin", {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const token = localStorage.getItem("edu_portal_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch(`/api/users/search?q=${encodeURIComponent(userSearch)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUserSearchResults(data.users || []);
        setShowUserDropdown(true);
      } else {
        console.error("Search failed:", res.status, await res.text());
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleCreateAdmin = async () => {
    console.log("handleCreateAdmin called", { selectedUserId, selectedUniversityId, userSearch });
    
    // Хэрэглэгч сонгогдоогүй бол email-ээр хайх
    let finalUserId = selectedUserId;
    
    if (!finalUserId) {
      if (!userSearch || userSearch.length < 2) {
        alert("Хэрэглэгч хайж олох эсвэл сонгоно уу");
        return;
      }
      
      // Email-ээр хайх
      try {
        console.log("Searching for user:", userSearch);
        const token = localStorage.getItem("edu_portal_token");
        if (!token) {
          alert("Нэвтэрч орно уу");
          return;
        }

        const searchRes = await fetch(`/api/users/search?q=${encodeURIComponent(userSearch)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!searchRes.ok) {
          let errorMessage = "Unknown error";
          try {
            const errorData = await searchRes.json();
            errorMessage = errorData.error || errorMessage;
            console.error("Search API error:", errorData);
          } catch (parseError) {
            errorMessage = `HTTP ${searchRes.status}: ${searchRes.statusText}`;
            console.error("Failed to parse error response:", parseError);
          }
          alert(`Хэрэглэгч хайхад алдаа гарлаа: ${errorMessage}`);
          return;
        }
        
        const searchData = await searchRes.json();
        console.log("Search results:", searchData);
        
        if (searchData.users && searchData.users.length > 0) {
          // Эхний хэрэглэгчийг ашиглах
          const foundUser = searchData.users[0];
          finalUserId = foundUser.id;
          setSelectedUserId(foundUser.id);
          setUserSearch(`${foundUser.name} (${foundUser.email})`);
          console.log("Found user:", foundUser);
        } else {
          alert("Хэрэглэгч олдсонгүй. Эхлээд хэрэглэгч бүртгүүлэх хэрэгтэй.");
          return;
        }
      } catch (error) {
        console.error("Error searching user:", error);
        alert(`Хэрэглэгч хайхад алдаа гарлаа: ${error instanceof Error ? error.message : "Unknown error"}`);
        return;
      }
    }

    if (!finalUserId || !selectedUniversityId) {
      alert(`Хэрэглэгч болон сургууль сонгоно уу. UserId: ${finalUserId}, UniversityId: ${selectedUniversityId}`);
      return;
    }

    try {
      console.log("Creating admin with:", { userId: finalUserId, universityId: selectedUniversityId });
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch("/api/university-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          userId: finalUserId,
          universityId: selectedUniversityId,
        }),
      });

      const responseData = await res.json();
      console.log("API response:", { status: res.status, data: responseData });

      if (res.ok) {
        setShowModal(false);
        setSelectedUserId("");
        setSelectedUniversityId("");
        setUserSearch("");
        setUserSearchResults([]);
        fetchAdmins();
        alert("✅ Админ эрх амжилттай олголоо!");
      } else {
        console.error("API error:", responseData);
        const errorMsg = responseData.error || `Алдаа гарлаа (${res.status})`;
        alert(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      alert(`Алдаа гарлаа: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Сургуулийн админууд удирдах ({loading ? "..." : admins.length})
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700 transition"
        >
          ➕ Шинэ админ эрх олгох
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">Ачааллаж байна...</div>
      ) : admins.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Админ эрх олгогдсон хэрэглэгч байхгүй байна
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-white/5">
                <tr>
                  <th className="text-left p-3 font-medium">Хэрэглэгч</th>
                  <th className="text-left p-3 font-medium">Сургууль</th>
                  <th className="text-left p-3 font-medium">Эрх</th>
                  <th className="text-left p-3 font-medium">Төлөв</th>
                  <th className="text-left p-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-t border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/50 dark:hover:bg-white/5">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{admin.user?.name || "N/A"}</p>
                        <p className="text-xs text-zinc-500">{admin.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      {admin.university ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {admin.university.logo && (
                              <img
                                src={admin.university.logo}
                                alt={admin.university.name}
                                className="w-6 h-6 object-contain rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                            <p className="font-medium">{admin.university.name}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>📍 {admin.university.city}</span>
                            {admin.university.qsRank && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                QS #{admin.university.qsRank}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-red-500 text-xs">⚠️ Сургууль олдсонгүй</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {admin.canEditInfo && <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">Засах</span>}
                        {admin.canManageScholarships && <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">Тэтгэлэг</span>}
                        {admin.canViewReports && <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">Тайлан</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      {admin.isActive ? (
                        <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">Идэвхтэй</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs">Идэвхгүй</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={async () => {
                          if (confirm("Энэ админ эрхийг хязгаарлах уу?")) {
                            try {
                              const token = localStorage.getItem("edu_portal_token");
                              const res = await fetch(`/api/university-admin/${admin.id}`, {
                                method: "DELETE",
                                headers: token ? {
                                  Authorization: `Bearer ${token}`,
                                } : {},
                              });
                              if (res.ok) {
                                fetchAdmins();
                              }
                            } catch (error) {
                              alert("Алдаа гарлаа");
                            }
                          }
                        }}
                        className="text-red-600 dark:text-red-400 hover:underline text-xs"
                      >
                        Хязгаарлах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Шинэ админ эрх олгох */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => {
            setShowModal(false);
            setShowUserDropdown(false);
          }}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">🏛️ Сургуульд админ эрх олгох</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowUserDropdown(false);
                }}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Step 1: Сургууль сонгох */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                  1️⃣ Сургууль сонгох *
                </label>
                <select
                  value={selectedUniversityId}
                  onChange={(e) => setSelectedUniversityId(e.target.value)}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-purple-500 dark:focus:border-purple-400 transition"
                >
                  <option value="">-- Сургууль сонгох --</option>
                  {universities
                    .filter((u) => 
                      !u.name.includes("Эрдэнэтийн") && 
                      !u.name.includes("Дархан") && 
                      !u.name.includes("Ховд")
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.city})</option>
                    ))}
                </select>
                {selectedUniversityId && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    ✓ {universities.find(u => u.id === selectedUniversityId)?.name} сонгогдлоо
                  </p>
                )}
              </div>

              {/* Step 2: Хэрэглэгч хайх */}
              <div className="relative">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                  2️⃣ Хэрэглэгч хайх *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      if (e.target.value.length < 2) {
                        setSelectedUserId("");
                        setShowUserDropdown(false);
                      }
                    }}
                    onFocus={() => {
                      if (userSearchResults.length > 0) setShowUserDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowUserDropdown(false), 200);
                    }}
                    placeholder="И-мэйл эсвэл нэрээр хайх..."
                    className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-purple-500 dark:focus:border-purple-400 transition pr-10"
                  />
                  {userSearch && userSearch.length >= 2 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {showUserDropdown && userSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-zinc-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {userSearchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setUserSearch(`${user.name} (${user.email})`);
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm border-b border-zinc-200 dark:border-white/10 last:border-0 transition"
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{user.email}</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          {user.role === "USER" ? "👤 Хэрэглэгч" :
                           user.role === "ALUMNI" ? "🎓 Төгсөгч" :
                           user.role === "TEACHER" ? "👨‍🏫 Багш" :
                           user.role === "UNIVERSITY_ADMIN" ? "🏛️ Сургуулийн админ" :
                           "🔐 Системийн админ"}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {selectedUserId && (
                  <div className="mt-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      <span>
                        <strong>{userSearchResults.find(u => u.id === selectedUserId)?.name}</strong> сонгогдлоо
                      </span>
                    </p>
                  </div>
                )}
                
                {!selectedUserId && userSearch && userSearchResults.length === 0 && userSearch.length >= 2 && (
                  <div className="mt-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      ⚠️ Хэрэглэгч олдсонгүй. Эхлээд "Хэрэглэгчид" таб дээр хэрэглэгч бүртгүүлэх хэрэгтэй.
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedUserId && selectedUniversityId && (
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">📋 Дүгнэлт:</p>
                  <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <p>• <strong>{userSearchResults.find(u => u.id === selectedUserId)?.name}</strong> хэрэглэгчид</p>
                    <p>• <strong>{universities.find(u => u.id === selectedUniversityId)?.name}</strong> сургуулийн админ эрх олгох</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowUserDropdown(false);
                    setSelectedUserId("");
                    setSelectedUniversityId("");
                    setUserSearch("");
                  }}
                  className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleCreateAdmin}
                  disabled={!selectedUserId || !selectedUniversityId}
                  className="flex-1 rounded-lg bg-purple-600 text-white px-4 py-3 text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  <span>✅</span>
                  <span>Админ эрх олгох</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Тэтгэлгүүдийн tab компонент
function ScholarshipsTab({ universities }: { universities: any[] }) {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [formData, setFormData] = useState({
    universityId: "",
    name: "",
    type: "MERIT",
    amountMnt: "",
    description: "",
    requirements: [] as string[],
    deadline: "",
    isActive: true,
  });
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch("/api/scholarships", {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setScholarships(data.scholarships || []);
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement && !formData.requirements.includes(newRequirement)) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement] });
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (req: string) => {
    setFormData({ ...formData, requirements: formData.requirements.filter(r => r !== req) });
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.universityId || !formData.name || !formData.type || !formData.description) {
      alert("Сургууль, нэр, төрөл, тайлбар заавал оруулах ёстой");
      return;
    }

    try {
      const token = localStorage.getItem("edu_portal_token");
      const url = isEdit ? `/api/scholarships/${editingScholarship.id}` : "/api/scholarships";
      const method = isEdit ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          amountMnt: formData.amountMnt ? parseInt(formData.amountMnt) : null,
          deadline: formData.deadline || null,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setShowEditModal(false);
        setFormData({
          universityId: "", name: "", type: "MERIT", amountMnt: "", description: "",
          requirements: [], deadline: "", isActive: true,
        });
        fetchScholarships();
      } else {
        const data = await res.json();
        alert(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      alert("Алдаа гарлаа");
    }
  };

  const handleEdit = (scholarship: any) => {
    setEditingScholarship(scholarship);
    setFormData({
      universityId: scholarship.universityId || "",
      name: scholarship.name || "",
      type: scholarship.type || "MERIT",
      amountMnt: scholarship.amountMnt?.toString() || "",
      description: scholarship.description || "",
      requirements: scholarship.requirements || [],
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
      isActive: scholarship.isActive ?? true,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ тэтгэлгийг устгах уу?")) return;

    try {
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch(`/api/scholarships/${id}`, {
        method: "DELETE",
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      if (res.ok) {
        fetchScholarships();
      } else {
        alert("Алдаа гарлаа");
      }
    } catch (error) {
      alert("Алдаа гарлаа");
    }
  };

  const scholarshipTypeLabels: Record<string, string> = {
    MERIT: "Чадварын",
    NEED_BASED: "Нийгмийн",
    ATHLETIC: "Спортын",
    INTERNATIONAL: "Олон улсын",
    RESEARCH: "Судалгааны",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Тэтгэлгүүд удирдах ({loading ? "..." : scholarships.length})
        </p>
        <button
          onClick={() => {
            setFormData({
              universityId: "", name: "", type: "MERIT", amountMnt: "", description: "",
              requirements: [], deadline: "", isActive: true,
            });
            setShowAddModal(true);
          }}
          className="rounded-md bg-purple-600 text-white px-4 py-2 text-sm hover:bg-purple-700 transition"
        >
          ➕ Шинэ тэтгэлэг нэмэх
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">Ачааллаж байна...</div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Тэтгэлэг олдсонгүй
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-white/5">
                <tr>
                  <th className="text-left p-3 font-medium">Нэр</th>
                  <th className="text-left p-3 font-medium">Сургууль</th>
                  <th className="text-left p-3 font-medium">Төрөл</th>
                  <th className="text-left p-3 font-medium">Хэмжээ</th>
                  <th className="text-left p-3 font-medium">Төлөв</th>
                  <th className="text-left p-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((s) => (
                  <tr key={s.id} className="border-t border-zinc-200/60 dark:border-white/10 hover:bg-zinc-50/50 dark:hover:bg-white/5">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">
                      <p className="font-medium">{s.university?.name || "N/A"}</p>
                      <p className="text-xs text-zinc-500">{s.university?.city}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                        {scholarshipTypeLabels[s.type] || s.type}
                      </span>
                    </td>
                    <td className="p-3">
                      {s.amountMnt ? `${(s.amountMnt / 1000000).toFixed(1)}M MNT` : "-"}
                    </td>
                    <td className="p-3">
                      {s.isActive ? (
                        <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">Идэвхтэй</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs">Идэвхгүй</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-xs"
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">💰 Шинэ тэтгэлэг нэмэх</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Сургууль *</label>
                <select
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                >
                  <option value="">-- Сургууль сонгох --</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Нэр *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Төрөл *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                >
                  <option value="MERIT">Чадварын</option>
                  <option value="NEED_BASED">Нийгмийн</option>
                  <option value="ATHLETIC">Спортын</option>
                  <option value="INTERNATIONAL">Олон улсын</option>
                  <option value="RESEARCH">Судалгааны</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Хэмжээ (MNT)</label>
                <input
                  type="number"
                  value={formData.amountMnt}
                  onChange={(e) => setFormData({ ...formData, amountMnt: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="1500000"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Тайлбар *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Шалгуурууд</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddRequirement()}
                    className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none"
                    placeholder="Шалгуур нэмэх..."
                  />
                  <button
                    onClick={handleAddRequirement}
                    className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                  >
                    Нэмэх
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((r) => (
                    <span key={r} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1">
                      {r}
                      <button onClick={() => handleRemoveRequirement(r)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Эцсийн хугацаа</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm">Идэвхтэй</label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition"
              >
                Цуцлах
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 rounded-lg bg-purple-600 text-white px-4 py-3 text-sm font-medium hover:bg-purple-700 transition"
              >
                Нэмэх
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">✏️ Тэтгэлэг засах</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Сургууль *</label>
                <select
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                >
                  <option value="">-- Сургууль сонгох --</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Нэр *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Төрөл *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                >
                  <option value="MERIT">Чадварын</option>
                  <option value="NEED_BASED">Нийгмийн</option>
                  <option value="ATHLETIC">Спортын</option>
                  <option value="INTERNATIONAL">Олон улсын</option>
                  <option value="RESEARCH">Судалгааны</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Хэмжээ (MNT)</label>
                <input
                  type="number"
                  value={formData.amountMnt}
                  onChange={(e) => setFormData({ ...formData, amountMnt: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Тайлбар *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Шалгуурууд</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddRequirement()}
                    className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-2 text-sm outline-none"
                    placeholder="Шалгуур нэмэх..."
                  />
                  <button
                    onClick={handleAddRequirement}
                    className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                  >
                    Нэмэх
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((r) => (
                    <span key={r} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1">
                      {r}
                      <button onClick={() => handleRemoveRequirement(r)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Эцсийн хугацаа</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm">Идэвхтэй</label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition"
              >
                Цуцлах
              </button>
              <button
                onClick={() => handleSubmit(true)}
                className="flex-1 rounded-lg bg-purple-600 text-white px-4 py-3 text-sm font-medium hover:bg-purple-700 transition"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Хүсэлтүүдийн tab компонент
function RequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    status: "PENDING",
    adminNotes: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("edu_portal_token");
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      const res = await fetch(`/api/requests?${params.toString()}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request: any) => {
    setEditingRequest(request);
    setFormData({
      status: request.status || "PENDING",
      adminNotes: request.adminNotes || "",
    });
    setShowEditModal(true);
  };

  const handleSubmit = async () => {
    if (!editingRequest) return;

    try {
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch(`/api/requests/${editingRequest.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingRequest(null);
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      alert("Алдаа гарлаа");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ хүсэлтийг устгах уу?")) return;

    try {
      const token = localStorage.getItem("edu_portal_token");
      const res = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      if (res.ok) {
        fetchRequests();
      } else {
        alert("Алдаа гарлаа");
      }
    } catch (error) {
      alert("Алдаа гарлаа");
    }
  };

  const requestTypeLabels: Record<string, string> = {
    INFO_REQUEST: "Мэдээлэл авах",
    SCHOLARSHIP_APPLY: "Тэтгэлэгт өргөдөл",
    FEEDBACK: "Санал хүсэлт",
    COMPLAINT: "Гомдол",
    OTHER: "Бусад",
  };

  const requestStatusLabels: Record<string, string> = {
    PENDING: "Хүлээгдэж байна",
    REVIEWING: "Шалгаж байна",
    APPROVED: "Баталсан",
    REJECTED: "Татгалзсан",
    COMPLETED: "Дууссан",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    REVIEWING: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    APPROVED: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    REJECTED: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    COMPLETED: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Хүсэлтүүд удирдах ({loading ? "..." : requests.length})
        </p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none"
        >
          <option value="all">Бүх төлөв</option>
          <option value="PENDING">Хүлээгдэж байна</option>
          <option value="REVIEWING">Шалгаж байна</option>
          <option value="APPROVED">Баталсан</option>
          <option value="REJECTED">Татгалзсан</option>
          <option value="COMPLETED">Дууссан</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">Ачааллаж байна...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">
            Хүсэлт олдсонгүй
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="rounded-lg border border-zinc-200 dark:border-white/10 p-4 hover:bg-zinc-50/50 dark:hover:bg-white/5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{r.subject}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[r.status] || ""}`}>
                      {requestStatusLabels[r.status] || r.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs">
                      {requestTypeLabels[r.type] || r.type}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{r.message}</p>
                  <div className="text-xs text-zinc-500">
                    <p>Хэрэглэгч: {r.user?.name} ({r.user?.email})</p>
                    <p>Огноо: {new Date(r.createdAt).toLocaleString('mn-MN')}</p>
                    {r.adminNotes && (
                      <p className="mt-1 text-purple-600 dark:text-purple-400">Админы тэмдэглэл: {r.adminNotes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-600 dark:text-red-400 hover:underline text-xs"
                  >
                    Устгах
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRequest && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">✏️ Хүсэлт засах</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Гарчиг</label>
                <input
                  type="text"
                  value={editingRequest.subject}
                  disabled
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Агуулга</label>
                <textarea
                  value={editingRequest.message}
                  disabled
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm outline-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Төлөв *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                >
                  <option value="PENDING">Хүлээгдэж байна</option>
                  <option value="REVIEWING">Шалгаж байна</option>
                  <option value="APPROVED">Баталсан</option>
                  <option value="REJECTED">Татгалзсан</option>
                  <option value="COMPLETED">Дууссан</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Админы тэмдэглэл</label>
                <textarea
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  className="w-full rounded-lg border-2 border-zinc-300 dark:border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  rows={3}
                  placeholder="Тэмдэглэл оруулах..."
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border-2 border-zinc-300 dark:border-white/20 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition"
              >
                Цуцлах
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-purple-600 text-white px-4 py-3 text-sm font-medium hover:bg-purple-700 transition"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const { universities, loading } = useUniversities({ pageSize: 100 });

  useEffect(() => {
    // Зөвхөн auth loading дууссаны дараа шалгах
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, router, authLoading]);

  // Auth loading байх үед харагдахгүй
  if (authLoading) return null;
  
  if (!user || !isAdmin) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">🔐 Админ хяналтын самбар</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Тавтай морил, {user.name}! Та системийн админ эрхтэй байна.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
          Админ
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "stats"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          📊 Статистик
        </button>
        <button
          onClick={() => setActiveTab("universities")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "universities"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          🎓 Их сургуулиуд
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "users"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          👥 Хэрэглэгчид
        </button>
        <button
          onClick={() => setActiveTab("university-admins")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "university-admins"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          🏛️ Сургуулийн админууд
        </button>
        <button
          onClick={() => setActiveTab("scholarships")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "scholarships"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          💰 Тэтгэлгүүд
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
            activeTab === "requests"
              ? "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          📝 Хүсэлтүүд
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Нийт их сургууль</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {loading ? "..." : universities.length}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Нийт хөтөлбөр</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {loading ? "..." : new Set(universities.flatMap(u => u.programs || [])).size}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Байршлууд</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {loading ? "..." : new Set(universities.map(u => u.city)).size}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Дундаж зэрэглэл</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {loading ? "..." : universities.length > 0 
                  ? Math.round(universities.reduce((sum, u) => sum + u.qsRank, 0) / universities.length)
                  : 0}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6">
            <h2 className="font-medium mb-4">Сүүлийн үйл ажиллагаа</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-zinc-600 dark:text-zinc-400">Систем амжилттай ажиллаж байна</span>
                <span className="ml-auto text-xs text-zinc-500">Одоо</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-zinc-600 dark:text-zinc-400">{universities.length} их сургууль бүртгэгдсэн</span>
                <span className="ml-auto text-xs text-zinc-500">Өнөөдөр</span>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="rounded-lg border border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 p-6">
            <h2 className="font-medium text-purple-900 dark:text-purple-100 mb-3">ℹ️ Админ эрхийн мэдээлэл</h2>
            <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <p>• Та бүх их сургуулийн мэдээллийг харж, засах, устгах эрхтэй</p>
              <p>• Шинэ их сургууль нэмэх боломжтой</p>
              <p>• Хэрэглэгчид удирдах (харж, засах, устгах)</p>
              <p>• Сургуулийн админууд удирдах (эрх олгох, хязгаарлах)</p>
              <p>• Тэтгэлгүүд удирдах</p>
              <p>• Хүсэлтүүд удирдах</p>
              <p>• Статистик мэдээллийг харж болно</p>
            </div>
          </div>
        </div>
      )}

      {/* Universities Tab */}
      {activeTab === "universities" && (
        <UniversitiesTab universities={universities} loading={loading} />
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <UsersTab />
      )}

      {/* University Admins Tab */}
      {activeTab === "university-admins" && (
        <UniversityAdminsTab />
      )}

      {/* Scholarships Tab */}
      {activeTab === "scholarships" && (
        <ScholarshipsTab universities={universities} />
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <RequestsTab />
      )}
    </section>
  );
}



