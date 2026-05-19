"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">陈老师课题组</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            致力于前沿科学研究，推动技术创新与突破
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            我们专注于人工智能、机器学习、计算机视觉等领域的研究工作，
            在顶级期刊和会议上发表了多篇高水平论文，
            培养了一批优秀的研究生人才。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/members"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              了解团队
            </a>
            <a
              href="/publications"
              className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors duration-200"
            >
              查看成果
            </a>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
