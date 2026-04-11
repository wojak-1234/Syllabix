"use client"

import { Github, Twitter, Linkedin } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Docs", href: "#" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-white/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="group inline-flex items-center gap-2 text-xl font-bold">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 teacher:from-emerald-500 teacher:to-teal-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span className="bg-gradient-to-r from-orange-600 to-amber-500 teacher:from-emerald-600 teacher:to-teal-500 bg-clip-text text-transparent">
                Syllabix
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI 기반 교육 플랫폼으로, 학생과 교사의 학습 경험을 혁신합니다.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-100 hover:to-amber-50 teacher:hover:from-emerald-100 teacher:hover:to-teal-50 hover:scale-110"
                >
                  <social.icon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-orange-600 teacher:group-hover:text-emerald-600" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-orange-600 teacher:hover:text-emerald-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Syllabix. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with{" "}
            <span className="inline-block animate-pulse text-orange-500 teacher:text-emerald-500">♥</span>
            {" "}by the Syllabix team
          </p>
        </div>
      </div>
    </footer>
  )
}
