"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface News {
  id: string;
  title: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

const categoryMap: Record<string, string> = {
  GROUP: "组内新闻",
  ACADEMIC: "学术动态",
  AWARD: "获奖通知",
};

export default function NewsManagementPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此新闻吗？")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("删除失败");
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.ok) {
        setNews(
          news.map((n) =>
            n.id === id ? { ...n, isPublished: !currentStatus } : n
          )
        );
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
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
              <h1 className="text-3xl font-bold">新闻管理</h1>
              <p className="text-gray-400 mt-1">管理新闻动态</p>
            </div>
          </div>
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            发布新闻
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : news.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无新闻</p>
            <Link
              href="/admin/news/new"
              className="text-blue-400 hover:underline"
            >
              发布第一篇新闻
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">标题</th>
                  <th className="text-left p-4 text-gray-400 font-medium">分类</th>
                  <th className="text-left p-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left p-4 text-gray-400 font-medium">发布时间</th>
                  <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-medium max-w-md truncate">{item.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        {categoryMap[item.category] || item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(item.id, item.isPublished)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          item.isPublished
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {item.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" /> 已发布
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> 草稿
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
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
