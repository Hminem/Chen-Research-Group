"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface News {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  coverImage: string | null;
  createdAt: string;
}

const categoryMap: Record<string, string> = {
  GROUP: "组内新闻",
  ACADEMIC: "学术动态",
  AWARD: "获奖通知",
};

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`/api/news/${id}`);
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
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
            加载中...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">未找到该新闻</p>
            <Link href="/news" className="text-blue-400 hover:underline">
              返回新闻列表
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回新闻列表
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                {categoryMap[news.category] || news.category}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(news.createdAt).toLocaleDateString("zh-CN")}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-6">{news.title}</h1>

            {news.coverImage && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={news.coverImage}
                  alt={news.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {news.summary && (
              <p className="text-gray-300 text-lg mb-8 pb-8 border-b border-white/10">
                {news.summary}
              </p>
            )}

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </motion.article>
        </div>
      </main>
      <Footer />
    </>
  );
}
