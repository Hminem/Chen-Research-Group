"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditCopyrightPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    version: "",
    registrationDate: "",
  });

  useEffect(() => {
    async function fetchCopyright() {
      try {
        const res = await fetch(`/api/copyrights/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            registrationNumber: data.registrationNumber || "",
            version: data.version || "",
            registrationDate: data.registrationDate ? data.registrationDate.split("T")[0] : "",
          });
        }
      } catch (error) {
        console.error("Error fetching copyright:", error);
      } finally {
        setFetching(false);
      }
    }

    fetchCopyright();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/copyrights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/copyrights");
      } else {
        alert("更新失败");
      }
    } catch (error) {
      console.error("Error updating copyright:", error);
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
          <Link href="/admin/copyrights" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">编辑软件著作权</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">软件名称 <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">登记号 <span className="text-red-400">*</span></label>
            <input type="text" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">版本</label>
              <input type="text" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">登记日期</label>
              <input type="date" value={form.registrationDate} onChange={(e) => setForm({ ...form, registrationDate: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors">
              {loading ? "保存中..." : "保存修改"}
            </button>
            <Link href="/admin/copyrights" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">取消</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
