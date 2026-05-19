"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditPaperPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    abstract: "",
  });

  useEffect(() => {
    async function fetchPaper() {
      try {
        const res = await fetch(`/api/papers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title || "",
            authors: data.authors || "",
            journal: data.journal || "",
            year: data.year || new Date().getFullYear(),
            doi: data.doi || "",
            abstract: data.abstract || "",
          });
        }
      } catch (error) {
        console.error("Error fetching paper:", error);
      } finally {
        setFetching(false);
      }
    }

    fetchPaper();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/papers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/papers");
      } else {
        alert("更新失败");
      }
    } catch (error) {
      console.error("Error updating paper:", error);
      alert("更新失败");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 text-center text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/papers" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">编辑论文</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">论文标题 <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">作者 <span className="text-red-400">*</span></label>
            <input type="text" value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">期刊/会议 <span className="text-red-400">*</span></label>
              <input type="text" value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">年份 <span className="text-red-400">*</span></label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">DOI</label>
            <input type="text" value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">摘要</label>
            <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none" />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors">
              {loading ? "保存中..." : "保存修改"}
            </button>
            <Link href="/admin/papers" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">取消</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
