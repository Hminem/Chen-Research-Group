"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditPatentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    patentNumber: "",
    patentType: "INVENTION",
    status: "APPLIED",
    applicationDate: "",
    authorizationDate: "",
    inventors: "",
  });

  useEffect(() => {
    async function fetchPatent() {
      try {
        const res = await fetch(`/api/patents/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            patentNumber: data.patentNumber || "",
            patentType: data.patentType || "INVENTION",
            status: data.status || "APPLIED",
            applicationDate: data.applicationDate ? data.applicationDate.split("T")[0] : "",
            authorizationDate: data.authorizationDate ? data.authorizationDate.split("T")[0] : "",
            inventors: data.inventors || "",
          });
        }
      } catch (error) {
        console.error("Error fetching patent:", error);
      } finally {
        setFetching(false);
      }
    }

    fetchPatent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/patents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/patents");
      } else {
        alert("更新失败");
      }
    } catch (error) {
      console.error("Error updating patent:", error);
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
          <Link href="/admin/patents" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">编辑专利</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">专利名称 <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">专利号 <span className="text-red-400">*</span></label>
            <input type="text" value={form.patentNumber} onChange={(e) => setForm({ ...form, patentNumber: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">类型</label>
              <select value={form.patentType} onChange={(e) => setForm({ ...form, patentType: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                <option value="INVENTION">发明专利</option>
                <option value="UTILITY">实用新型</option>
                <option value="DESIGN">外观设计</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">状态</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                <option value="APPLIED">申请中</option>
                <option value="AUTHORIZED">已授权</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">发明人</label>
            <input type="text" value={form.inventors} onChange={(e) => setForm({ ...form, inventors: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">申请日期</label>
              <input type="date" value={form.applicationDate} onChange={(e) => setForm({ ...form, applicationDate: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">授权日期</label>
              <input type="date" value={form.authorizationDate} onChange={(e) => setForm({ ...form, authorizationDate: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors">
              {loading ? "保存中..." : "保存修改"}
            </button>
            <Link href="/admin/patents" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">取消</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
