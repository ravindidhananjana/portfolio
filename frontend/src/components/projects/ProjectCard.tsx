"use client";

import { Project } from "@/data/projects";
import { ExternalLink, Info } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: (project: Project) => void;
}

export default function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onSelect && onSelect(project)}
      className="flex flex-col glass-panel overflow-hidden group hover:border-accent/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-accent/5 relative"
    >
      <div className="h-48 bg-surface-light border-b border-surface-border relative overflow-hidden flex items-center justify-center">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-light to-surface flex items-center justify-center relative">
            <span className="text-foreground/20 font-mono text-4xl font-bold opacity-50 select-none">
              {project.title.substring(0, 2).toUpperCase()}
            </span>
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-surface/80 border border-surface-border/60 text-xs font-mono text-foreground/60 flex items-center gap-1 group-hover:text-accent group-hover:border-accent/30 transition-colors">
              <Info className="w-3 h-3" /> Click for details
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors flex items-center justify-between">
          <span>{project.title}</span>
        </h3>
        
        <p className="text-foreground/70 mb-4 flex-grow line-clamp-3 text-sm leading-relaxed">
          {project.description}
        </p>
        
        {project.keyResult && (
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold self-start">
            <span>⭐</span>
            <span>{project.keyResult}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs font-mono px-2 py-0.5 bg-surface-light border border-surface-border rounded-md text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div 
          className="flex items-center justify-between mt-auto pt-4 border-t border-surface-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onSelect && onSelect(project)}
            className="text-xs font-mono font-medium text-foreground/60 hover:text-accent transition-colors flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" /> View Details
          </button>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-foreground/60 hover:text-white transition-colors"
              >
                <FiGithub className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-light transition-colors px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 hover:bg-accent/20"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
