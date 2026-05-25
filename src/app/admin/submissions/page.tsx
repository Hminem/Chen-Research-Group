"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Award, Code, Trophy, Check, X, Clock, MessageSquare } from "lucide-react";

interface Submission {
  id: string;
  type: string;
  targetId: string;
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

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("PENDING");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");

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

  async function handleReview(id: string, status: "APPROVED" | "REJECTED") {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNote: reviewNote || null }),
      });

      if (res.ok) {
        setSubmissions(
          submissions.map((s) =>
            s.id === id
              ? { ...s, status, reviewNote: reviewNote || null }
              : s
          )
        );
        setReviewingId(null);
        setReviewNote("");
      } else {
        alert("审核失败");
      }
    } catch (error) {
      console.error("Error reviewing submission:", error);
      alert("审核失败");
    }
  }

  const filteredSubmissions =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

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
              <h1 className="text-3xl font-bold">成果审核</h1>
              <p className="text-gray-400 mt-1">
                审核用户提交的论文、专利、软著和获奖
                {pendingCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    {pendingCount} 条待审核
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 mb-6">
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
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400">暂无{filter === "PENDING" ? "待审核" : ""}提交记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission, index) => {
              const TypeIcon = typeIconMap[submission.type] || FileText;

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
                            className={`px-2 py-1 rounded-full text-xs ${
                              statusColorMap[submission.status]
                            }`}
                          >
                            {statusMap[submission.status]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          提交人：{submission.user.name} ({submission.user.email})
                        </p>
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

                    {/* 审核按钮 */}
                    {submission.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        {reviewingId === submission.id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={reviewNote}
                              onChange={(e) => setReviewNote(e.target.value)}
                              placeholder="审核备注（可选）"
                              rows={2}
                              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReview(submission.id, "APPROVED")}
                                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                              >
                                通过
                              </button>
                              <button
                                onClick={() => handleReview(submission.id, "REJECTED")}
                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                              >
                                拒绝
                              </button>
                              <button
                                onClick={() => {
                                  setReviewingId(null);
                                  setReviewNote("");
                                }}
                                className="px-3 py-2 border border-white/20 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setReviewingId(submission.id)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="审核"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReview(submission.id, "APPROVED")}
                              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="直接通过"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReview(submission.id, "REJECTED")}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="直接拒绝"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
