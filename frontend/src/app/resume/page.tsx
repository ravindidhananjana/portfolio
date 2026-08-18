"use client"

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ResumePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-accent" />
              <span className="text-sm font-mono text-accent uppercase tracking-wider">Resume</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Experience &amp; <span className="text-accent">Skills</span>
            </h1>
          </div>
          
          <Link href="/cv/ravindi-gunasekara-cv.pdf" target="_blank">
            <Button className="gap-2 whitespace-nowrap h-12 px-8">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-16">
          {/* Education */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-8">Education</h2>
            <div className="rounded-2xl border border-surface-border/50 bg-surface/40 backdrop-blur p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
                <h3 className="text-lg font-semibold">BSc (Hons) Computing</h3>
                <span className="text-sm font-mono text-foreground/50 whitespace-nowrap">2020 - Present</span>
              </div>
              <p className="text-foreground/80 mb-2">Specializing in AI &amp; Machine Learning</p>
              <p className="text-sm text-foreground/60">
                National Institute of Business Management (NIBM) • Final Year
              </p>
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-8">Technical Skills</h2>
            
            <div className="space-y-6">
              {/* Languages */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-foreground/90">Programming Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "JavaScript", "TypeScript", "C++", "Java"].map(skill => (
                    <motion.span 
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 rounded-lg border border-surface-border/50 bg-surface/50 text-sm font-medium hover:border-accent/30 hover:bg-accent/5 transition-all"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* ML Frameworks */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-foreground/90">AI / ML Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {["PyTorch", "TensorFlow", "Scikit-Learn", "Keras", "OpenCV", "LangChain"].map(skill => (
                    <motion.span 
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 rounded-lg border border-surface-border/50 bg-surface/50 text-sm font-medium hover:border-accent/30 hover:bg-accent/5 transition-all"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Web & Cloud */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-foreground/90">Web &amp; Cloud</h3>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "React", "FastAPI", "Docker", "AWS", "Git"].map(skill => (
                    <motion.span 
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 rounded-lg border border-surface-border/50 bg-surface/50 text-sm font-medium hover:border-accent/30 hover:bg-accent/5 transition-all"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-foreground/90">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {["Computer Vision", "Multimodal AI", "RAG Systems", "Predictive Modeling"].map(skill => (
                    <motion.span 
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 rounded-lg border border-accent/30 bg-accent/10 text-accent text-sm font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
