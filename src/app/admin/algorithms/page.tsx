"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

interface Algorithm {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string | null;
  fileName: string | null;
}

export default function AlgorithmsManagementPage() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlgorithms();
  }, []);

  async function fetchAlgorithms() {
    try {
      const res = await fetch("/api/algorithms");
      if (res.ok) {
        const data = await res.json();
        setAlgorithms(data);
      }
    } catch (error) {
      console.error("Error fetching algorithms:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此算法资源吗？")) return;

    try {
      const res = await fetch(`/api/algorithms/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlgorithms(algorithms.filter((a) => a.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting algorithm:", error);
      alert("删除失败");
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">算法资源管理</h1>
              <p className="text-gray-400 mt-1">管理算法和工具包</p>
            </div>
          </div>
          <Link
            href="/admin/algorithms/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加资源
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : algorithms.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无算法资源</p>
            <Link
              href="/admin/algorithms/new"
              className="text-blue-400 hover:underline"
            >
              添加第一个算法资源
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">名称</th>
                  <th className="text-left p-4 text-gray-400 font-medium">描述</th>
                  <th className="text-left p-4 text-gray-400 font-medium">文件</th>
                  <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {algorithms.map((algo) => (
                  <tr key={algo.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-medium">{algo.name}</td>
                    <td className="p-4 text-gray-400 text-sm max-w-xs truncate">
                      {algo.description || "-"}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {algo.fileName || "无文件"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/algorithms/${algo.id}/edit`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(algo.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
