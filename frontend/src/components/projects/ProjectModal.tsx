"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, BookOpen, Layers, Cpu, Target, Database, BarChart3, Radio } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/Button";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const details = project.details;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface border border-surface-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 border-b border-surface-border bg-surface-light/50 backdrop-blur">
              <div className="pr-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-md text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.keyResult && (
                    <span className="text-xs font-semibold px-2.5 py-1 bg-accent/20 border border-accent/40 rounded-md text-accent flex items-center gap-1">
                      ⭐ {project.keyResult}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {project.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-foreground/50 hover:text-foreground hover:bg-surface-light border border-transparent hover:border-surface-border transition-all flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
              {/* Overview */}
              {details?.overview && (
                <section>
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-base">
                    {details.overview}
                  </p>
                </section>
              )}

              {/* Objectives */}
              {details?.objectives && details.objectives.length > 0 && (
                <section className="bg-surface-light/30 border border-surface-border/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>Key Objectives</span>
                  </div>
                  <ul className="space-y-2">
                    {details.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-foreground/80 text-sm">
                        <span className="text-accent mt-1">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Key Features (e.g. Clinical Simulator) */}
              {details?.keyFeatures && details.keyFeatures.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-accent font-mono text-sm uppercase tracking-wider">
                    <Radio className="w-4 h-4" />
                    <span>Key Features</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.keyFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className="bg-surface-light/40 border border-surface-border/60 rounded-xl p-4 space-y-2"
                      >
                        <h4 className="font-semibold text-foreground text-sm">{feat.title}</h4>
                        {feat.points && (
                          <ul className="space-y-1.5 text-xs text-foreground/70">
                            {feat.points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="text-accent">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Dataset Details */}
              {details?.dataset && (
                <section className="bg-surface-light/30 border border-surface-border/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <Database className="w-4 h-4" />
                    <span>Dataset Information</span>
                  </div>
                  {details.dataset.source && (
                    <p className="text-sm font-medium text-foreground mb-2">
                      <strong className="text-foreground/60">Source:</strong> {details.dataset.source}
                    </p>
                  )}
                  {details.dataset.citation && (
                    <blockquote className="border-l-2 border-accent/40 pl-3 my-2 text-xs text-foreground/60 italic">
                      {details.dataset.citation}
                    </blockquote>
                  )}
                  {details.dataset.doiUrl && (
                    <a
                      href={details.dataset.doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline inline-flex items-center gap-1 mb-3"
                    >
                      <ExternalLink className="w-3 h-3" /> {details.dataset.doiUrl}
                    </a>
                  )}
                  {details.dataset.details && (
                    <ul className="space-y-1.5 mt-2">
                      {details.dataset.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <span className="text-accent">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {/* Project Structure / Notebooks */}
              {details?.projectStructure && details.projectStructure.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Notebooks &amp; Project Structure</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.projectStructure.map((nb, i) => (
                      <div
                        key={i}
                        className="bg-surface-light/40 border border-surface-border/60 rounded-xl p-3.5"
                      >
                        <div className="font-mono text-xs font-semibold text-accent mb-1">
                          {nb.file}
                        </div>
                        <p className="text-xs text-foreground/75">{nb.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Methodology & Pipeline */}
              {details?.methodology && details.methodology.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Methodology &amp; Architecture</span>
                  </div>
                  <div className="space-y-3">
                    {details.methodology.map((m, i) => (
                      <div
                        key={i}
                        className="bg-surface-light/30 border border-surface-border/60 rounded-xl p-4"
                      >
                        <h4 className="font-semibold text-foreground text-sm mb-2">{m.title}</h4>
                        <ul className="space-y-1.5">
                          {m.points.map((p, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2 text-xs text-foreground/80">
                              <span className="text-accent">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Syllabus Case Directory (For MBBS simulator) */}
              {details?.caseDirectory && details.caseDirectory.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Final MBBS Syllabus Case Coverage</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-surface-border/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-light/80 text-foreground/80 font-mono uppercase">
                        <tr>
                          <th className="p-3 border-b border-surface-border">Category</th>
                          <th className="p-3 border-b border-surface-border">Systems / Stations Covered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border/40 text-foreground/70">
                        {details.caseDirectory.map((row, i) => (
                          <tr key={i} className="hover:bg-surface-light/30">
                            <td className="p-3 font-semibold text-foreground whitespace-nowrap">{row.category}</td>
                            <td className="p-3">{row.systems}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Simulation Phases (MBBS) */}
              {details?.simulationPhases && details.simulationPhases.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3 text-accent font-mono text-sm uppercase tracking-wider">
                    <Radio className="w-4 h-4" />
                    <span>Dual-Phase Simulation Engine</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.simulationPhases.map((phase, i) => (
                      <div key={i} className="bg-surface-light/40 border border-surface-border/60 rounded-xl p-4">
                        <span className="text-xs font-mono text-accent font-semibold">{phase.phase}</span>
                        <h4 className="font-bold text-foreground text-sm mb-2">{phase.title}</h4>
                        <p className="text-xs text-foreground/75 leading-relaxed">{phase.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Models & Evaluation Metrics */}
              {(details?.modelsEvaluated || details?.evaluationMetrics) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details.modelsEvaluated && (
                    <div className="bg-surface-light/30 border border-surface-border/60 rounded-xl p-4">
                      <h4 className="font-semibold text-foreground text-xs font-mono uppercase text-accent mb-2">
                        Models Evaluated
                      </h4>
                      <ul className="space-y-1">
                        {details.modelsEvaluated.map((m, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-center gap-2">
                            <span className="text-accent">✓</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.evaluationMetrics && (
                    <div className="bg-surface-light/30 border border-surface-border/60 rounded-xl p-4">
                      <h4 className="font-semibold text-foreground text-xs font-mono uppercase text-accent mb-2">
                        Evaluation Metrics
                      </h4>
                      <ul className="space-y-1">
                        {details.evaluationMetrics.map((em, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-center gap-2">
                            <span className="text-accent">✓</span> {em}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Example Outputs */}
              {details?.exampleOutputs && details.exampleOutputs.length > 0 && (
                <section className="bg-surface-light/30 border border-surface-border/60 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground text-xs font-mono uppercase text-accent mb-2">
                    System Outputs &amp; Artifacts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {details.exampleOutputs.map((out, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-3 py-1 bg-surface-light border border-surface-border rounded-lg text-foreground/80"
                      >
                        {out}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Results & Impact */}
              {details?.results && (
                <section className="bg-accent/5 border border-accent/25 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2 text-accent font-mono text-sm uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4" />
                    <span>Results &amp; Findings</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {details.results}
                  </p>
                </section>
              )}

              {/* Technologies Used */}
              {details?.technologiesUsed && (
                <section>
                  <h4 className="font-semibold text-foreground text-xs font-mono uppercase text-accent mb-3">
                    Technologies &amp; Libraries
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {details.technologiesUsed.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-3 py-1.5 bg-surface-light border border-surface-border rounded-lg text-foreground/90 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-t border-surface-border bg-surface-light/80 backdrop-blur">
              <Button variant="secondary" size="sm" onClick={onClose} className="px-5">
                Close
              </Button>

              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-white px-4 py-2 rounded-xl bg-surface border border-surface-border hover:border-surface-border/80 transition-all"
                  >
                    <FiGithub className="w-4 h-4" /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-black bg-accent hover:bg-accent-light px-5 py-2 rounded-xl transition-all shadow-lg shadow-accent/20"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Live App
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
