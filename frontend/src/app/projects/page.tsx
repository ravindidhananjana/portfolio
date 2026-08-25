"use client";

import { useState } from "react";
import { projects, Project } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">Portfolio</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Featured <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl leading-relaxed">
            Real-world AI applications focusing on impact and technical depth. Click any project card to inspect its complete methodology, dataset citations, and architecture.
          </p>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2">Want to collaborate?</h3>
            <p className="text-foreground/70 text-sm">Let&apos;s discuss your AI and ML needs.</p>
          </div>
          <Link href="/contact" className="flex-shrink-0">
            <Button className="gap-2 whitespace-nowrap">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Detail Popup Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
