"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Award, Code, Trophy } from "lucide-react";

export function StatsSection() {
  const [stats, setStats] = useState([
    { icon: FileText, label: "发表论文", value: 0, color: "text-blue-400" },
    { icon: Award, label: "授权专利", value: 0, color: "text-purple-400" },
    { icon: Code, label: "软件著作权", value: 0, color: "text-cyan-400" },
    { icon: Trophy, label: "获奖记录", value: 0, color: "text-yellow-400" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [papersRes, patentsRes, copyrightsRes, awardsRes] = await Promise.all([
          fetch("/api/papers"),
          fetch("/api/patents"),
          fetch("/api/copyrights"),
          fetch("/api/awards"),
        ]);

        const papers = papersRes.ok ? await papersRes.json() : [];
        const patents = patentsRes.ok ? await patentsRes.json() : [];
        const copyrights = copyrightsRes.ok ? await copyrightsRes.json() : [];
        const awards = awardsRes.ok ? await awardsRes.json() : [];

        setStats([
          { icon: FileText, label: "发表论文", value: papers.length, color: "text-blue-400" },
          { icon: Award, label: "授权专利", value: patents.length, color: "text-purple-400" },
          { icon: Code, label: "软件著作权", value: copyrights.length, color: "text-cyan-400" },
          { icon: Trophy, label: "获奖记录", value: awards.length, color: "text-yellow-400" },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="py-20 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">科研成果</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
