"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Integrate with Resend.com for email subscription
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-primary dark:bg-primary/95 text-background pt-16 pb-8 border-t border-accent/30">
      <div className="container-max px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4 cursor-interactive hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo0.png"
                alt="Invio Social"
                width={80}
                height={30}
                className="h-5 w-auto drop-shadow-lg"
              />
              <span className="font-bold text-background">Invio Social</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed mb-6">
              A digital growth agency helping local businesses improve discoverability, SEO, and reputation.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="mailto:inviosocial@gmail.com" className="flex items-center gap-2 text-background/70 hover:text-accent transition-colors cursor-interactive">
                <Mail className="w-4 h-4" />
                inviosocial@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    className="text-background/70 hover:text-accent transition-colors text-sm cursor-interactive"
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-background mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <motion.a
                  href="#"
                  className="text-background/70 hover:text-accent transition-colors cursor-interactive"
                  whileHover={{ x: 4 }}
                >
                  Digital Discovery
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  className="text-background/70 hover:text-accent transition-colors cursor-interactive"
                  whileHover={{ x: 4 }}
                >
                  Reputation Growth
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  className="text-background/70 hover:text-accent transition-colors cursor-interactive"
                  whileHover={{ x: 4 }}
                >
                  Local SEO
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  className="text-background/70 hover:text-accent transition-colors cursor-interactive"
                  whileHover={{ x: 4 }}
                >
                  Digital Presence
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  className="text-background/70 hover:text-accent transition-colors cursor-interactive"
                  whileHover={{ x: 4 }}
                >
                  Web Development
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  className="text-background/70 hover:text-accent transition-colors cursor-interactive"
                  whileHover={{ x: 4 }}
                >
                  Automation Systems
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-background mb-4">Newsletter</h4>
            <p className="text-background/70 text-sm mb-4">
              Stay updated with latest insights and strategies
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-primary/50 text-background placeholder-background/50 text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent cursor-text"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-background font-medium rounded-r-lg transition-colors text-sm cursor-interactive shadow-md hover:shadow-lg hover:shadow-accent/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-4 h-4" />
                </motion.button>
              </div>
              {subscribed && (
                <motion.p
                  className="text-accent text-xs"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 my-8"></div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <p className="text-background/70 text-sm">
            © 2026 Invio Social. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="w-10 h-10 rounded-full bg-primary/20 hover:bg-accent flex items-center justify-center transition-colors shadow-md hover:shadow-lg hover:shadow-accent/40 cursor-interactive"
                  aria-label={link.label}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 text-background hover:text-background" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
