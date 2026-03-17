# Invio Social - Digital Agency Pitch Website

A modern, high-performance pitch website for Invio Social built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## 🎯 Features

- **Modern Design**: Clean, minimal aesthetic with dark mode support
- **High Performance**: Optimized for Web Vitals with Vercel hosting
- **Responsive**: Mobile-first design works seamlessly across all devices
- **Animations**: Smooth scroll animations and interactions with Framer Motion
- **Accessibility**: Semantic HTML with ARIA labels for inclusive experience
- **Dark Mode**: Built-in theme switching with next-themes

## 📋 Sections

1. **Navbar** - Sticky navigation with theme toggle and CTA
2. **Hero** - Full-height landing section with animated logo
3. **Social Proof** - Marquee strip with mission statement
4. **Services** - 6 interactive flip-cards showcasing core services
5. **Why Choose Us** - Differentiators with alternating layout
6. **Our Belief** - Brand manifesto and values
7. **Footer** - Links, newsletter signup, and social media

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12
- **Theme**: next-themes 1.1
- **Icons**: lucide-react
- **Email**: Resend (integrated for newsletter)
- **Hosting**: Vercel
- **DNS/CDN**: Cloudflare

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🔨 Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
invio-social/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── ThemeProvider.tsx   # Dark mode provider
│   └── sections/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── SocialProof.tsx
│       ├── Services.tsx
│       ├── WhyChooseUs.tsx
│       ├── OurBelief.tsx
│       └── Footer.tsx
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```

## 🎨 Color Palette

- **Primary**: Navy (`#1a1f3a`)
- **Secondary**: Deep Charcoal (`#2d3142`)
- **Accent**: Electric Blue (`#0066ff`)
- **Light**: Slate (`#f5f5f7`)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Resend Email Setup

1. Sign up at [Resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:

```env
NEXT_PUBLIC_RESEND_KEY=your_api_key
```

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ✅ Best Practices Implemented

- ✓ Semantic HTML structure
- ✓ ARIA labels on interactive elements
- ✓ Mobile-first responsive design
- ✓ Dark mode support throughout
- ✓ Performance-optimized animations
- ✓ Type-safe TypeScript
- ✓ Clean component architecture
- ✓ Tailwind utility-only styling
- ✓ ESLint configuration
- ✓ Clear code comments

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel dashboard
3. Deploy with a single click

### Custom Server

```bash
npm run build
npm start
```

## 📊 Analytics

Configure Vercel Analytics:

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Then add to `layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 📄 License

Private - Invio Social

## 👨‍💻 Development Notes

- All components use `"use client"` directive for client-side features
- Animations use Framer Motion with viewport detection for performance
- Theme switching is handled via next-themes with client-side hydration
- Icons from lucide-react are tree-shakeable
- Responsive images use Next.js Image component (ready for implementation)

## 🚧 TODO / Future Enhancements

- [ ] Integrate Resend.com for newsletter emails
- [ ] Add FAQ section with expandable items
- [ ] Implement contact form with email validation
- [ ] Add testimonials/case studies section
- [ ] SEO optimization with meta tags
- [ ] Image optimization and lazy loading
- [ ] Form validation library integration
- [ ] Analytics dashboard integration
# INVIOSocial
