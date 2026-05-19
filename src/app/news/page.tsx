"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface News {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  coverImage: string | null;
  createdAt: string;
}

const categoryMap: Record<string, string> = {
  GROUP: "组内新闻",
  ACADEMIC: "学术动态",
  AWARD: "获奖通知",
};

const categoryColorMap: Record<string, string> = {
  GROUP: "bg-blue-500/20 text-blue-400",
  ACADEMIC: "bg-purple-500/20 text-purple-400",
  AWARD: "bg-yellow-500/20 text-yellow-400",
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?published=true");
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

    fetchNews();
  }, []);

  const filteredNews =
    filter === "all"
      ? news
      : news.filter((n) => n.category === filter);

  const categories = ["GROUP", "ACADEMIC", "AWARD"];

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-4">
              <span className="gradient-text">新闻动态</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              了解课题组最新动态、学术成果和获奖信息
            </p>
          </motion.div>

          {/* Filter buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {categoryMap[cat]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center text-gray-400">暂无新闻</div>
          ) : (
            <div className="space-y-6">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/news/${item.id}`}>
                    <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-start gap-6">
                        {item.coverImage && (
                          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                categoryColorMap[item.category] || "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {categoryMap[item.category] || item.category}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          {item.summary && (
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
