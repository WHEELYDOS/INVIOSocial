# Invio Social 2.0 — AI Agent Integration & Service Wiring Guide

> **Purpose:** This document is an exhaustive, copy-paste-ready instruction manual for any AI agent or developer tasked with connecting buttons, modals, forms, APIs, and backend automation services in this repository.

---

## 1. System & Architecture Overview

* **Framework:** React 19 + TypeScript + Vite 8
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` without PostCSS config)
* **3D / Visuals:** Three.js, `@react-three/fiber`, `@react-three/drei`, Spline
* **Smooth Scrolling:** Lenis smooth scrolling (disabled automatically on touch devices)
* **Current Backend / DB:** Supabase (`@supabase/supabase-js`)
* **Live Dev Server:** Vite runs on `http://localhost:8443` (or `$PORT`)

---

## 2. Master Interactive Elements & Button Directory

Every interactive element in the frontend is mapped below with its exact file location, line number range, current handler, and integration target.

| Button / UI Element | Component & File Location | Line Range | Current Action | Integration Target / What It Should Do |
| :--- | :--- | :--- | :--- | :--- |
| **"Start a project" (Desktop Nav)** | `ArrowCta` in `src/App.tsx` | `~L964` | `onClick={openBooking}` | Opens `BookingModal` or launches Calendly / Cal.com scheduler |
| **Mobile Hamburger Button** | `<button>` in `src/App.tsx` | `~L967-L974` | `setMobileNavOpen(true)` | Opens mobile slide-out drawer (`MobileNav`) |
| **Mobile Drawer "Start a project"** | `ArrowCta` in `src/App.tsx` | `~L719` | `handleClose(); onBooking()` | Closes mobile nav and opens `BookingModal` |
| **Hero "Book a call" (Pulse CTA)** | `ArrowCta` in `src/App.tsx` | `~L1100` | `onClick={openBooking}` | Opens `BookingModal` |
| **Hero "See what we build"** | `<a>` link in `src/App.tsx` | `~L1102-L1108` | `href="#services"` | Lenis smooth scroll to `#services` anchor |
| **Service Cards "Explore this system →"** | `<span>` in `src/App.tsx` | `~L1192-L1195` | Static visual indicator | Can be turned into `<button>` to open modal pre-selecting that service |
| **Services Section "Ready to automate?"** | `ArrowCta` in `src/App.tsx` | `~L1202` | `onClick={openBooking}` | Opens `BookingModal` |
| **Mid-Page Band "Book a call"** | `MagneticButton` in `src/App.tsx` | `~L1459-L1461` | `onClick={openBooking}` | Opens `BookingModal` |
| **Floating Mobile Action Button** | `FloatingCta` in `src/App.tsx` | `~L746-L753` | `onClick={onOpen}` | Appears after scrolling 80vh on mobile; opens `BookingModal` |
| **Intro Sequence "Skip →" Button** | `<button>` in `src/IntroSequence.tsx` | `~L154-L158` | `onClick={finish}` | Skips splash screen, persists `invio-intro-played` to `sessionStorage` |
| **Booking Modal Submit Button** | `<button type="submit">` in `src/BookingModal.tsx` | `~L288-L306` | Calls `handleSubmit` -> `bookConsultation()` | Inserts into Supabase `consultations`, fires webhooks / email |
| **Booking Modal Close Buttons** | Backdrop & X `<button>` in `src/BookingModal.tsx` | `~L130, L146` | `onClick={handleClose}` | Closes modal with exit spring animation |
| **Newsletter "Join →" Button** | `<button type="submit">` in `src/NewsletterSignup.tsx` | `~L91-L113` | Calls `handleSubmit` -> `subscribeNewsletter()` | Inserts into Supabase `newsletter_subscribers`, triggers welcome loop |
| **Footer Contact Link** | `<a>` in `src/App.tsx` | `~L1508-L1513` | `href="mailto:hello@invio.social"` | Opens mail client (`hello@invio.social`) |
| **Footer Social: LinkedIn** | `<a>` in `src/App.tsx` | `~L1546` | `href="#"` (Placeholder) | Needs real LinkedIn company/profile URL |
| **Footer Social: X / Twitter** | `<a>` in `src/App.tsx` | `~L1547` | `href="#"` (Placeholder) | Needs real X / Twitter handle URL |
| **FAQ Accordions** | `<details>` / `<summary>` in `src/App.tsx` | `~L821-L841` | Native toggle + CSS animation | Expandable Q&A accordion |

---

## 3. Current APIs, Database Schemas & Credentials

### 3.1 Supabase Configuration (`src/supabase.ts`)

* **Project URL:** `https://ctflhihpyxtdacjwqojm.supabase.co`
* **Current Anon Key:** Defined in `src/supabase.ts` (Row Level Security enabled for anon INSERT).
* **Client Instance:** Exported as `supabase` from `src/supabase.ts`.

### 3.2 Database Tables & Structure

#### Table 1: `consultations`
Stores incoming leads from `BookingModal.tsx`.
```sql
create table if not exists consultations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  message text,
  status text default 'pending', -- 'pending' | 'contacted' | 'booked' | 'archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policy: Allow anonymous users to submit consultation requests
alter table consultations enable row level security;
create policy "Enable insert for anon users" on consultations
  for insert with check (true);
```

#### Table 2: `newsletter_subscribers`
Stores emails subscribed from `NewsletterSignup.tsx`.
```sql
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policy: Allow anonymous users to subscribe
alter table newsletter_subscribers enable row level security;
create policy "Enable insert for anon subscribers" on newsletter_subscribers
  for insert with check (true);
```

---

## 4. Key Services to Connect & Step-by-Step Recipes

### Step 1: Environment Variables Setup (Security Best Practice)
Currently, credentials are hardcoded in `src/supabase.ts`. Have your agent migrate them to Vite environment variables:

1. Create `.env` in the project root:
```env
VITE_SUPABASE_URL=https://ctflhihpyxtdacjwqojm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Optional Integrations:
VITE_CALENDLY_URL=https://calendly.com/your-organization/strategy-call
VITE_MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-id
VITE_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
```

2. Update `src/supabase.ts`:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

---

### Step 2: Connecting the Booking Form to Automation Webhooks (Make.com / Zapier / n8n)

To instantly trigger workflows (e.g. notify Slack, WhatsApp, add to Notion/Airtable/HubSpot, send an SMS):

**Location:** `src/supabase.ts` -> `bookConsultation()`

Add webhook dispatch alongside the Supabase insert:
```typescript
export async function bookConsultation(data: ConsultationFormData): Promise<ActionResult> {
  // 1. Validate inputs...
  // 2. Insert into Supabase...
  const { error } = await supabase.from('consultations').insert({
    full_name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    status: 'pending',
  })

  if (error) {
    return { success: false, message: 'Something went wrong. Please try again.' }
  }

  // 3. Fire Webhook to Make / Zapier / n8n (non-blocking or awaited)
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL
  if (webhookUrl) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          message: cleanMessage,
          source: 'Website Consultation Modal',
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error('[webhook error]', err))
    } catch (e) {
      console.warn('Webhook trigger skipped:', e)
    }
  }

  return { success: true, message: "We'll be in touch within 24 hours!" }
}
```

---

### Step 3: Integrating Direct Calendar Booking (Calendly / Cal.com)

If you prefer clients to directly book on a calendar instead of or after filling the consultation form:

#### Option A: Redirect to Calendly on Successful Form Submission
In `src/BookingModal.tsx` (~L117):
```typescript
if (res.success) {
  setForm({ full_name: '', email: '', phone: '', message: '' })
  setTimeout(() => {
    handleClose()
    // Open calendar with prefilled params:
    const calUrl = `https://calendly.com/your-org/call?name=${encodeURIComponent(form.full_name)}&email=${encodeURIComponent(form.email)}`
    window.open(calUrl, '_blank')
  }, 1500)
}
```

#### Option B: Embed Cal.com or Calendly Popup Directly on the Button
In `src/App.tsx`:
Replace `openBooking` handler with Calendly popup trigger or Cal.com embed:
```typescript
// Add Calendly widget script to index.html or load dynamically:
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

const openBooking = useCallback(() => {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: 'https://calendly.com/your-org/strategy-session'
    })
  } else {
    setBookingModalOpen(true) // Fallback to glassmorphic modal
  }
}, [])
```

---

### Step 4: Connecting Service Cards to Prefill Booking Requests

Currently, the 4 service cards in `SERVICES` (`src/App.tsx` ~L293-318):
1. **Web Design**
2. **Automation Workflows**
3. **Social Systems**
4. **Integrations**

To make the "Explore this system →" button clickable and prefill the message in `BookingModal`:

1. Update `BookingModal.tsx` to accept an optional `defaultService?: string`:
```typescript
export default function BookingModal({
  open,
  onClose,
  defaultService,
}: {
  open: boolean
  onClose: () => void
  defaultService?: string
}) {
  // when defaultService changes, set message:
  useEffect(() => {
    if (defaultService) {
      setForm(prev => ({
        ...prev,
        message: `I'm interested in ${defaultService}. Here's what we need:`
      }))
    }
  }, [defaultService, open])
  // ...
```

2. In `src/App.tsx`:
```typescript
const [selectedService, setSelectedService] = useState<string | undefined>()

const handleServiceClick = (serviceTitle: string) => {
  setSelectedService(serviceTitle)
  setBookingModalOpen(true)
}
```

3. Update the card button in `src/App.tsx` (~L1192):
```tsx
<button
  type="button"
  onClick={() => handleServiceClick(s.title)}
  className="relative mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel/70 transition-all duration-400 group-hover:gap-3 group-hover:text-steel cursor-pointer"
>
  Explore this system
  <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
</button>
```

---

### Step 5: Connecting Transactional Email (Resend / SendGrid / Postmark)

When a lead submits `BookingModal` or `NewsletterSignup`, you may want an email notification sent to `hello@invio.social` or a welcome email to the lead.

#### Method 1: Supabase Database Webhook (Zero Frontend Changes)
1. Go to **Supabase Dashboard** -> **Database** -> **Webhooks**.
2. Create webhook on table `consultations` for `INSERT` event.
3. Target URL: Your **Make.com / Zapier webhook** or **Resend API Edge Function**.

#### Method 2: Supabase Edge Function (`supabase/functions/notify-booking/index.ts`)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { record } = await req.json()
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Invio Social <notifications@invio.social>',
      to: ['hello@invio.social'],
      subject: `New Lead: ${record.full_name}`,
      html: `<p><strong>Name:</strong> ${record.full_name}</p>
             <p><strong>Email:</strong> ${record.email}</p>
             <p><strong>Phone:</strong> ${record.phone || 'N/A'}</p>
             <p><strong>Message:</strong> ${record.message || 'N/A'}</p>`,
    }),
  })
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
})
```

---

### Step 6: Updating Footer Social Links & Contact Endpoints

In `src/App.tsx` (~L1544-1557):
Replace the empty `#` placeholders with actual channels:

```tsx
{[
  { label: 'hello@invio.social', href: 'mailto:hello@invio.social' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/invio-social' },
  { label: 'X / Twitter', href: 'https://x.com/inviosocial' },
].map((n) => (
  <a
    key={n.label}
    href={n.href}
    target={n.href.startsWith('http') ? '_blank' : undefined}
    rel={n.href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className="text-sm text-honeydew/60 transition-colors duration-200 hover:text-honeydew"
  >
    {n.label}
  </a>
))}
```

---

### Step 7: Analytics & Conversion Event Tracking (GA4 / Meta Pixel)

If tracking button clicks and form conversions with Google Analytics 4 or Meta Pixel:

In `src/App.tsx` and `src/BookingModal.tsx`:
```typescript
// Helper utility:
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
  }
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params)
  }
}

// In BookingModal.tsx after res.success:
trackEvent('generate_lead', {
  value: 3500,
  currency: 'USD',
  lead_name: form.full_name,
})

// In NewsletterSignup.tsx after subscribe success:
trackEvent('newsletter_signup', { email })
```

---

## 5. Ready-to-Use Agent Prompts

Copy and paste these exact instructions directly to your AI agent for fast execution:

### Prompt 1: Connect Webhook to Booking Form
> *"Agent, open `src/supabase.ts` and update `bookConsultation()` so that after a successful insert into Supabase, it also sends a POST request with the form payload to the webhook URL configured in `import.meta.env.VITE_MAKE_WEBHOOK_URL`. Ensure it has proper try/catch error handling so webhook network failures don't block the user from seeing their success screen."*

### Prompt 2: Connect Service Cards to Pre-populate Booking Modal
> *"Agent, update `src/App.tsx` and `src/BookingModal.tsx` so that when a user clicks 'Explore this system →' on any of the 4 service cards in the Services section, it opens `BookingModal` with the message pre-filled with the name of that specific service."*

### Prompt 3: Update Social Links & Environment Variables
> *"Agent, create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, update `src/supabase.ts` to read from them, and update the LinkedIn and X / Twitter URLs in the footer of `src/App.tsx` with our live profile links."*

### Prompt 4: Integrate Calendly Widget
> *"Agent, integrate Calendly popup scheduling into `src/App.tsx`. When any 'Book a call' or 'Start a project' button is clicked, trigger the Calendly popup widget using the URL from `VITE_CALENDLY_URL`, keeping `BookingModal` as a fallback."*

---

## 6. Verification & Testing Checklist

- [ ] **Modal Triggering:** Clicking "Start a project", "Book a call", "Ready to automate?", and the floating mobile button opens the `BookingModal`.
- [ ] **Validation:** Submitting empty fields displays inline error text; invalid emails are rejected.
- [ ] **Supabase Insert:** Submissions create a new row in `consultations` with `status: 'pending'`.
- [ ] **Newsletter Insert:** Valid email creates a row in `newsletter_subscribers`; duplicate emails display "You're already subscribed!" without crashing.
- [ ] **Scroll Navigation:** Clicking any navbar or footer link smoothly scrolls to the target section offset via Lenis.
- [ ] **Mobile Experience:** Mobile drawer opens smoothly, closes on item selection, and locks scroll when open.
- [ ] **Build Check:** Running `npm run build` succeeds with zero TypeScript or Tailwind errors.
