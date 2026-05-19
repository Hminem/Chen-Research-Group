"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Member {
  id: string;
  name: string;
  title: string;
  researchDirection: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string | null;
  publications?: Array<{
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi: string | null;
  }>;
}

const titleMap: Record<string, string> = {
  TEACHER: "老师",
  PHD: "博士生",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/members/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMember(data);
        }
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
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

  if (!member) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">未找到该成员</p>
            <Link href="/members" className="text-blue-400 hover:underline">
              返回成员列表
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
            href="/members"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回成员列表
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Member header */}
            <div className="glass-card p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-3xl font-bold text-white">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    member.name[0]
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
                  <p className="text-blue-400 text-lg mb-4">
                    {titleMap[member.title] || member.title}
                  </p>
                  <p className="text-gray-300 mb-4">
                    {member.researchDirection}
                  </p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  个人简介
                </h2>
                <p className="text-gray-300 leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Papers */}
            {member.publications && member.publications.length > 0 && (
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  发表论文
                </h2>
                <div className="space-y-4">
                  {member.publications.map((paper) => (
                    <div
                      key={paper.id}
                      className="border-l-2 border-blue-500/30 pl-4 py-2"
                    >
                      <h3 className="font-medium mb-1">
                        {paper.doi ? (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors"
                          >
                            {paper.title}
                          </a>
                        ) : (
                          paper.title
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {paper.authors} - {paper.journal}, {paper.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
