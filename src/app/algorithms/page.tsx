"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileCode, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Algorithm {
  id: string;
  name: string;
  description: string | null;
  useCases: string | null;
  fileUrl: string | null;
  fileName: string | null;
  readmeContent: string | null;
}

export default function AlgorithmsPage() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
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

    fetchAlgorithms();
  }, []);

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
              <span className="gradient-text">算法资源</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              我们开源的部分算法和工具包，欢迎使用和引用
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : algorithms.length === 0 ? (
            <div className="text-center text-gray-400">暂无算法资源</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {algorithms.map((algo, index) => (
                <motion.div
                  key={algo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileCode className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1">{algo.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {algo.description}
                      </p>
                    </div>
                  </div>

                  {algo.useCases && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">适用场景：</p>
                      <p className="text-sm text-gray-300">{algo.useCases}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {algo.fileUrl ? (
                      <a
                        href={algo.fileUrl}
                        download={algo.fileName}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-400 text-sm rounded-lg cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        暂无文件
                      </button>
                    )}

                    {algo.readmeContent && (
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === algo.id ? null : algo.id)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        {expandedId === algo.id ? "收起说明" : "使用说明"}
                      </button>
                    )}
                  </div>

                  {expandedId === algo.id && algo.readmeContent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-black/30 rounded-lg overflow-hidden"
                    >
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {algo.readmeContent}
                      </pre>
                    </motion.div>
                  )}
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
