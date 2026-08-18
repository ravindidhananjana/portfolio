import { LabExperiment } from "@/data/lab";
import { FlaskConical, Play } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

interface LabCardProps {
  experiment: LabExperiment;
  index: number;
}

export default function LabCard({ experiment, index }: LabCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-panel p-6 flex flex-col h-full group border-l-4 border-l-transparent hover:border-l-accent transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-accent">
          <FlaskConical className="w-5 h-5" />
          <span className="text-xs font-mono uppercase tracking-wider bg-accent/10 px-2 py-1 rounded">
            {experiment.status}
          </span>
        </div>
        <span className="text-sm font-mono text-foreground/50">
          {experiment.date}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
        {experiment.title}
      </h3>
      
      <p className="text-foreground/70 mb-6 flex-grow">
        {experiment.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {experiment.tags.map(tag => (
          <span 
            key={tag} 
            className="text-xs font-mono px-2 py-1 bg-surface-light border border-surface-border rounded-md text-foreground/80"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 mt-auto pt-4 border-t border-surface-border">
        {experiment.githubUrl && (
          <Link 
            href={experiment.githubUrl}
            target="_blank"
            className="flex items-center gap-1 text-sm font-medium text-foreground/60 hover:text-white transition-colors"
          >
            <FiGithub className="w-4 h-4" /> Code
          </Link>
        )}
        {experiment.demoUrl && (
          <Link 
            href={experiment.demoUrl}
            target="_blank"
            className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-light transition-colors"
          >
            <Play className="w-4 h-4" /> View Demo
          </Link>
        )}
      </div>
    </motion.div>
  );
}
