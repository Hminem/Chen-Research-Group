"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, CreditCard, Shield, Clock, FileText, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  role: string;
  status: string;
  createdAt: string;
  member: {
    id: string;
    name: string;
    title: string;
    researchDirection: string | null;
    bio: string | null;
  } | null;
  submissions: Array<{
    id: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
}

const roleMap: Record<string, string> = {
  SUPER_ADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "普通成员",
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

const submissionTypeMap: Record<string, string> = {
  PUBLICATION: "论文",
  PATENT: "专利",
  COPYRIGHT: "软著",
  AWARD: "获奖",
};

const submissionStatusMap: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
};

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm({
            name: data.name || "",
            studentId: data.studentId || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (sessionStatus === "authenticated") {
      fetchProfile();
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [sessionStatus]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditing(false);
      } else {
        alert("保存失败");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (sessionStatus === "loading" || loading) {
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

  if (sessionStatus === "unauthenticated") {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">请先登录</p>
            <a href="/admin/login" className="text-blue-400 hover:underline">
              去登录
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
            获取用户信息失败
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-12">
              <span className="gradient-text">个人中心</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 左侧：用户信息卡片 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-1"
            >
              <div className="glass-card p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
                  {profile.name[0]}
                </div>
                <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{profile.email}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    {roleMap[profile.role] || profile.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      statusColorMap[profile.status] || "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {statusMap[profile.status] || profile.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/profile/submissions"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    我的成果
                  </Link>
                  <Link
                    href="/profile/submissions/new"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    提交新成果
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* 右侧：详细信息 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2 space-y-6"
            >
              {/* 基本信息 */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    基本信息
                  </h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      编辑
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">姓名</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">学号/工号</label>
                      <input
                        type="text"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                      >
                        {saving ? "保存中..." : "保存"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            name: profile.name || "",
                            studentId: profile.studentId || "",
                          });
                        }}
                        className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">姓名</span>
                      <span>{profile.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">邮箱</span>
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">学号/工号</span>
                      <span>{profile.studentId || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">角色</span>
                      <span>{roleMap[profile.role] || profile.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">注册时间</span>
                      <span>
                        {new Date(profile.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 关联成员信息 */}
              {profile.member && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    成员信息
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 w-20">职称</span>
                      <span>{profile.member.title}</span>
                    </div>
                    {profile.member.researchDirection && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-20">研究方向</span>
                        <span>{profile.member.researchDirection}</span>
                      </div>
                    )}
                    {profile.member.bio && (
                      <div>
                        <p className="text-gray-400 mb-1">个人简介</p>
                        <p className="text-gray-300">{profile.member.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 我的提交 */}
              {profile.submissions.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4">我的提交</h3>
                  <div className="space-y-3">
                    {profile.submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">
                            {submissionTypeMap[sub.type] || sub.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(sub.createdAt).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            sub.status === "APPROVED"
                              ? "bg-green-500/20 text-green-400"
                              : sub.status === "REJECTED"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {submissionStatusMap[sub.status] || sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 账号状态提示 */}
              {profile.status === "PENDING" && (
                <div className="glass-card p-6 border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-400">账号审核中</h3>
                      <p className="text-sm text-gray-400">
                        您的账号正在等待管理员审核，审核通过后即可正常使用。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {profile.status === "REJECTED" && (
                <div className="glass-card p-6 border border-red-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-400">账号未通过审核</h3>
                      <p className="text-sm text-gray-400">
                        您的账号未通过审核，请联系管理员了解详情。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
