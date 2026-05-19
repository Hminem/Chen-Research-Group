"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Award, Code, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string | null;
}

interface Patent {
  id: string;
  name: string;
  patentNumber: string;
  patentType: string;
  status: string;
  applicationDate: string | null;
  authorizationDate: string | null;
  inventors: string | null;
}

interface Copyright {
  id: string;
  name: string;
  registrationNumber: string;
  version: string | null;
  registrationDate: string | null;
}

const patentTypeMap: Record<string, string> = {
  INVENTION: "发明专利",
  UTILITY: "实用新型",
  DESIGN: "外观设计",
};

const patentStatusMap: Record<string, string> = {
  APPLIED: "申请中",
  AUTHORIZED: "已授权",
};

type TabType = "papers" | "patents" | "copyrights";

export default function PublicationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("papers");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [copyrights, setCopyrights] = useState<Copyright[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [papersRes, patentsRes, copyrightsRes] = await Promise.all([
          fetch("/api/papers"),
          fetch("/api/patents"),
          fetch("/api/copyrights"),
        ]);

        if (papersRes.ok) {
          const data = await papersRes.json();
          setPapers(data);
        }
        if (patentsRes.ok) {
          const data = await patentsRes.json();
          setPatents(data);
        }
        if (copyrightsRes.ok) {
          const data = await copyrightsRes.json();
          setCopyrights(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);

  const filteredPapers =
    selectedYear === "all"
      ? papers
      : papers.filter((p) => p.year === selectedYear);

  const tabs = [
    { id: "papers" as TabType, label: "学术论文", icon: FileText, count: papers.length },
    { id: "patents" as TabType, label: "专利", icon: Award, count: patents.length },
    { id: "copyrights" as TabType, label: "软件著作权", icon: Code, count: copyrights.length },
  ];

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
              <span className="gradient-text">科研成果</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              展示课题组在学术论文、专利和软件著作权方面的成果
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Papers */}
              {activeTab === "papers" && (
                <div>
                  <div className="flex justify-center gap-3 mb-8 flex-wrap">
                    <button
                      onClick={() => setSelectedYear("all")}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedYear === "all"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      全部年份
                    </button>
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedYear === year
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {filteredPapers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="glass-card p-6 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">
                              {paper.doi ? (
                                <a
                                  href={`https://doi.org/${paper.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                                >
                                  {paper.title}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                paper.title
                              )}
                            </h3>
                            <p className="text-sm text-gray-400 mb-1">
                              {paper.authors}
                            </p>
                            <p className="text-sm text-gray-500">
                              {paper.journal} • {paper.year}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-gray-600">
                            {paper.year}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patents */}
              {activeTab === "patents" && (
                <div className="space-y-4">
                  {patents.map((patent, index) => (
                    <motion.div
                      key={patent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">{patent.name}</h3>
                          <p className="text-sm text-gray-400 mb-1">
                            专利号：{patent.patentNumber}
                          </p>
                          <p className="text-sm text-gray-400 mb-1">
                            发明人：{patent.inventors}
                          </p>
                          <p className="text-sm text-gray-500">
                            申请日期：{patent.applicationDate}
                            {patent.authorizationDate &&
                              ` • 授权日期：${patent.authorizationDate}`}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              patent.patentType === "INVENTION"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {patentTypeMap[patent.patentType] || patent.patentType}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              patent.status === "AUTHORIZED"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {patentStatusMap[patent.status] || patent.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Copyrights */}
              {activeTab === "copyrights" && (
                <div className="space-y-4">
                  {copyrights.map((copyright, index) => (
                    <motion.div
                      key={copyright.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glass-card p-6"
                    >
                      <h3 className="font-semibold mb-2">{copyright.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>登记号：{copyright.registrationNumber}</span>
                        {copyright.version && <span>版本：{copyright.version}</span>}
                        {copyright.registrationDate && (
                          <span>登记日期：{copyright.registrationDate}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
