import { Project } from "@/data/projects";
import { ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col glass-panel overflow-hidden group hover:border-accent/50 transition-colors"
    >
      <div className="h-48 bg-surface-light border-b border-surface-border relative overflow-hidden flex items-center justify-center">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-light to-surface flex items-center justify-center">
            <span className="text-foreground/20 font-mono text-4xl font-bold opacity-50 select-none">
              {project.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        
        <p className="text-foreground/70 mb-4 flex-grow line-clamp-3">
          {project.description}
        </p>
        
        {project.keyResult && (
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold">
            <span>⭐</span>
            <span>{project.keyResult}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs font-mono px-2 py-1 bg-surface-light border border-surface-border rounded-md text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-surface-border/50">
          {project.githubUrl && (
            <Link 
              href={project.githubUrl}
              target="_blank"
              className="flex items-center gap-1 text-sm font-medium text-foreground/60 hover:text-white transition-colors"
            >
              <FiGithub className="w-4 h-4" /> Code
            </Link>
          )}
          {project.liveUrl && (
            <Link 
              href={project.liveUrl}
              target="_blank"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-light transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
