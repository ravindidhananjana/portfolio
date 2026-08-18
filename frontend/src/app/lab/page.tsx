"use client"

import { labExperiments } from "@/data/lab";
import LabCard from "@/components/lab/LabCard";
import { motion } from "framer-motion";
import { FlaskConical, Sparkles } from "lucide-react";

export default function LabPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <FlaskConical className="w-5 h-5 text-accent" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">Lab</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Research &amp; <span className="text-accent">Experiments</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl leading-relaxed">
            My experimental space for testing cutting-edge architectures and documenting research learnings. This is where ideas come to life.
          </p>
        </motion.div>
      </div>

      {/* Experiments Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labExperiments.map((experiment, index) => (
            <LabCard key={experiment.id} experiment={experiment} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-semibold">Interested in my research?</h3>
          </div>
          <p className="text-foreground/70 text-sm">Explore my GitHub for code and detailed documentation.</p>
        </motion.div>
      </div>
    </div>
  );
}
