<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Invio Social - Pitch Website

### Project Overview

Building a modern, high-performance pitch website for digital agency "Invio Social" using:
- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12
- **Theme**: next-themes 1.1 (dark mode support)
- **Hosting**: Vercel
- **Email**: Resend.com (free tier, 3,000/month)

### Key Principles

- **Design**: Modern, minimal, high-trust aesthetic with dark navy/charcoal + electric blue accent
- **Performance**: Mobile-first, accessible, optimized Web Vitals
- **Code Quality**: Clean, TypeScript, semantic HTML, ARIA labels, well-commented
- **Styling**: Tailwind utilities only—no inline styles

### Project Structure

```
components/
├── ThemeProvider.tsx           # Dark mode provider
└── sections/
    ├── Navbar.tsx              # Sticky nav with theme toggle
    ├── Hero.tsx                # Full-height landing
    ├── SocialProof.tsx         # Marquee + mission
    ├── Services.tsx            # 6 flip-cards (3x2 grid)
    ├── WhyChooseUs.tsx         # Differentiators + icons
    ├── OurBelief.tsx           # Brand manifesto
    └── Footer.tsx              # Newsletter + links
app/
├── layout.tsx                  # Root layout
├── page.tsx                    # Main page
└── globals.css                 # Global Tailwind + utility classes
```

### Development Guidelines

1. **Components**: Use `"use client"` for interactive features
2. **Animations**: Framer Motion with `whileInView` for scroll triggers
3. **Responsive**: Mobile-first Tailwind breakpoints (sm, md, lg, xl)
4. **Dark Mode**: Use Tailwind's `dark:` prefix; test both themes
5. **Accessibility**: Semantic HTML, ARIA labels on buttons/icons
6. **Icons**: lucide-react (tree-shakeable)
7. **Comments**: Document non-obvious logic clearly
8. **Git**: Meaningful commit messages, one feature per commit

### Color Palette

- Primary (Navy): `#1a1f3a` / `navy` in Tailwind config
- Secondary (Charcoal): `#2d3142` / `charcoal` in config
- Accent (Blue): `#0066ff` / `blue` in Tailwind
- Light (Slate): `#f5f5f7` / `slate` in config
- Dark BG: `#0f1121` / `bg-dark` in config

### Services

1. Digital Discovery Optimization
2. Reputational Growth System
3. Local SEO Optimization
4. Digital Presence Setup
5. Website Development
6. Automation System

### Common Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
```

### Deployment

- **Vercel**: Push to GitHub, auto-deploy on commits
- **DNS**: Cloudflare (free tier)
- **Database**: Supabase (free, 500MB PostgreSQL) — if needed
- **Analytics**: Vercel Analytics

### Next Steps / TODO

- [ ] Newsletter signup integration with Resend.com
- [ ] FAQ section with expandable items
- [ ] Contact form with validation
- [ ] Case studies / testimonials section
- [ ] Image optimization and lazy loading
- [ ] Meta tags for SEO
- [ ] Form validation library (react-hook-form or zod)
- [ ] Analytics dashboard
