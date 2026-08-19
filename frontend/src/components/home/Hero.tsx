"use client"

import Link from "next/link";
import { Button } from "@/components/ui/Button";
// Replace lucide-react icons with react-icons/fi equivalents
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiTerminal } from "react-icons/fi";
import { TbSparkles } from "react-icons/tb";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-soft/25 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-accent-pale/40 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[110px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-surface border border-surface-border rounded-full px-3 py-1 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-mono text-foreground/80">Available for Opportunities</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Ravindi Gunasekara
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl font-medium mb-8 bg-gradient-to-r from-accent via-accent-light to-accent-soft bg-clip-text text-transparent"
          >
            Artificial Intelligence &amp; Machine Learning Undergraduate
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-foreground/70 mb-12 text-balance leading-relaxed"
          >
            Building AI systems with a focus on Deep Learning, Computer Vision, Multimodal AI, and Generative AI — applied to Healthcare, Remote Sensing, Space Technology, and Autonomous Systems.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                View Projects <FiArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/agent">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20">
                <TbSparkles className="w-4 h-4" /> Ask Elara about my work
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-6 text-foreground/50"
          >
            <Link href="/cv/ravindi-gunasekara-cv.pdf" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
              <FiDownload className="w-4 h-4" /> CV
            </Link>
            <Link href="https://github.com/ravindidhananjana" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
              <FiGithub className="w-4 h-4" /> GitHub
            </Link>
            <Link href="https://www.linkedin.com/in/ravindi-gunasekara-b83483334" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
              <FiLinkedin className="w-4 h-4" /> LinkedIn
            </Link>
            <Link href="https://www.kaggle.com/hansinigunasekara/competitions" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
              <FiTerminal className="w-4 h-4" /> Kaggle
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
