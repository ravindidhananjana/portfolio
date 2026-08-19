"use client"

import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Sparkles } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-accent" />
            <span className="text-sm font-mono text-accent uppercase tracking-wider">Connect</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Let&apos;s <span className="gradient-text">Talk</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            I&apos;m always interested in new opportunities, collaborations, and conversations about AI and computer vision.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-8">Direct Contact</h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="group cursor-pointer">
                <Link href="mailto:dananjanagunasekara@gmail.com">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-surface-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all">
                    <div className="p-3 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-sm text-foreground/70 break-all">dananjanagunasekara@gmail.com</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-surface-border/50">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-sm text-foreground/70">Sri Lanka</p>
                    <p className="text-xs text-foreground/50 mt-1">Open to remote & relocation</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-mono text-accent uppercase tracking-wider mb-4">Follow</h3>
                <div className="flex gap-3">
                  <a href="https://github.com/ravindidhananjana" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-surface-border hover:border-accent/30 hover:bg-accent/5 text-foreground/70 hover:text-accent transition-all">
                    <FiGithub className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/ravindi-gunasekara-b83483334" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-surface-border hover:border-accent/30 hover:bg-accent/5 text-foreground/70 hover:text-accent transition-all">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Elara CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-6 rounded-xl border border-accent/20 bg-accent/5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="font-semibold">Chat with Elara</h4>
              </div>
              <p className="text-sm text-foreground/70 mb-4">Ask my AI assistant about my work and experience.</p>
              <Link href="/agent">
                <Button size="sm" className="w-full">
                  Open Chat
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-surface-border/50 bg-surface/40 backdrop-blur p-8"
          >
            <h2 className="text-sm font-mono text-accent uppercase tracking-wider mb-8">Send a Message</h2>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-surface/50 border border-surface-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-surface/50 border border-surface-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground/80 mb-2">
                  Subject
                </label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full bg-surface/50 border border-surface-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">
                  Message
                </label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-surface/50 border border-surface-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <Button className="w-full" type="submit">
                Send Message
              </Button>

              <p className="text-xs text-foreground/50 text-center">
                Please email directly for faster response.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
