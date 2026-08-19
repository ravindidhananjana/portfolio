"use client"

import { motion } from "framer-motion";
import { GraduationCap, Code, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function AboutPage() {
  const interests = [
    "Computer Vision",
    "Medical Imaging AI",
    "Multimodal Models",
    "Predictive Analytics",
    "AI Agents",
    "Full-Stack ML"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">About</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Hi, I&apos;m <span className="gradient-text">Ravindi</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl leading-relaxed">
            I&apos;m a final-year AI student bridging cutting-edge research with real-world impact. I build intelligent systems that perceive, understand, and solve complex problems.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Two Column Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-surface-border/50 bg-gradient-to-br from-surface/50 to-surface/30 backdrop-blur p-6 hover:border-accent/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-xl bg-accent/10 mb-4">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-mono text-accent mb-2 uppercase tracking-wider">Education</h3>
              <h4 className="text-lg font-semibold mb-2">BSc (Hons) Computing</h4>
              <p className="text-sm text-foreground/60 mb-3">Specializing in AI</p>
              <p className="text-xs text-foreground/50">NIBM • Final Year</p>
            </div>
          </motion.div>

          {/* Focus Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-surface-border/50 bg-gradient-to-br from-surface/50 to-surface/30 backdrop-blur p-6 hover:border-accent/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-xl bg-accent/10 mb-4">
                <Code className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-mono text-accent mb-2 uppercase tracking-wider">Focus</h3>
              <h4 className="text-lg font-semibold mb-2">AI Engineering</h4>
              <p className="text-sm text-foreground/60 mb-3">Vision & Intelligence</p>
              <p className="text-xs text-foreground/50">Research & Production</p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative overflow-hidden rounded-2xl border border-surface-border/50 bg-gradient-to-br from-surface/50 to-surface/30 backdrop-blur p-6 hover:border-accent/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="inline-flex p-3 rounded-xl bg-accent/10 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-mono text-accent mb-2 uppercase tracking-wider">Mission</h3>
              <h4 className="text-lg font-semibold mb-2">Impact Through AI</h4>
              <p className="text-sm text-foreground/60 mb-3">Solving hard problems</p>
              <p className="text-xs text-foreground/50">Real-world applications</p>
            </div>
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-24"
        >
          <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-8">Technical Interests</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interests.map((interest, i) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 hover:border-accent/50 hover:bg-accent/10 transition-all cursor-default"
              >
                <p className="text-sm font-medium text-foreground/80 group-hover:text-accent transition-colors">
                  {interest}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl border border-surface-border/50 bg-surface/40 backdrop-blur p-10 md:p-12 mb-24"
        >
          <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-6">My Journey</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            I&apos;m passionate about bridging the gap between cutting-edge AI research and practical applications. What excites me most is working on complex problems—from multimodal medical imaging diagnostics to space-related AI applications—that require deep understanding of both software engineering and advanced machine learning.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            My goal is to become an AI/Computer Vision Engineer where I can build scalable, high-impact intelligent systems that make a real difference. I believe technology should solve meaningful problems.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent p-8"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to see my work?</h3>
            <p className="text-foreground/70 text-sm">Explore my AI projects and research.</p>
          </div>
          <Link href="/projects" className="flex-shrink-0">
            <Button className="gap-2 whitespace-nowrap">
              View Projects <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
