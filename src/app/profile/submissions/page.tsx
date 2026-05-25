"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FileText, Award, Code, Trophy, Clock, Check, X, Trash2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Submission {
  id: string;
  type: string;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const typeMap: Record<string, string> = {
  PUBLICATION: "论文",
  PATENT: "专利",
  COPYRIGHT: "软著",
  AWARD: "获奖",
};

const typeIconMap: Record<string, any> = {
  PUBLICATION: FileText,
  PATENT: Award,
  COPYRIGHT: Code,
  AWARD: Trophy,
};

const statusMap: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
};

const statusColorMap: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

const statusIconMap: Record<string, any> = {
  PENDING: Clock,
  APPROVED: Check,
  REJECTED: X,
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此提交吗？")) return;

    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("删除失败");
    }
  }

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="gradient-text">我的成果</span>
                </h1>
                <p className="text-gray-400 mt-1">管理您提交的论文、专利、软著和获奖</p>
              </div>
              <Link
                href="/profile/submissions/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                提交新成果
              </Link>
            </div>
          </motion.div>

          {/* Filter buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              全部 ({submissions.length})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "PENDING"
                  ? "bg-yellow-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              待审核 ({submissions.filter((s) => s.status === "PENDING").length})
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "APPROVED"
                  ? "bg-green-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              已通过 ({submissions.filter((s) => s.status === "APPROVED").length})
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "REJECTED"
                  ? "bg-red-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              已拒绝 ({submissions.filter((s) => s.status === "REJECTED").length})
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-400 mb-4">暂无提交记录</p>
              <Link
                href="/profile/submissions/new"
                className="text-blue-400 hover:underline"
              >
                提交您的第一个成果
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => {
                const TypeIcon = typeIconMap[submission.type] || FileText;
                const StatusIcon = statusIconMap[submission.status] || Clock;

                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <TypeIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">
                              {typeMap[submission.type] || submission.type}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                                statusColorMap[submission.status]
                              }`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusMap[submission.status]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            提交时间：{new Date(submission.createdAt).toLocaleString("zh-CN")}
                          </p>
                          {submission.reviewNote && (
                            <p className="text-sm text-gray-400 mt-2">
                              审核备注：{submission.reviewNote}
                            </p>
                          )}
                        </div>
                      </div>

                      {submission.status === "PENDING" && (
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
