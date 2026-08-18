import Link from "next/link";
import { Mail } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link
              href="https://github.com/ravindidhananjana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-accent transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <FiGithub className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/ravindi-gunasekara-b83483334"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-accent transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <FiLinkedin className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:dananjanagunasekara@gmail.com"
              className="text-foreground/50 hover:text-accent transition-colors"
            >
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-foreground/50 font-mono">
              &copy; {new Date().getFullYear()} Ravindi Gunasekara. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
