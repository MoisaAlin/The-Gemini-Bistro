# The Gemini Bistro: Comprehensive Product & Platform Roadmap

## 1. Project Vision

To transform "The Gemini Bistro" from an elegant web MVP into an industry-leading, full-stack restaurant platform. The platform blends high-end culinary presentation, frictionless customer hospitality (reservations, online ordering, loyalty), and modern conversational AI into a unified digital dining experience.

---

## 2. Current State Assessment (MVP Foundation)

The initial MVP milestones established a strong interactive frontend, multilingual design, and server-side AI integration:
- **Frontend Architecture:** React 19 SPA powered by Vite, Tailwind CSS, and Framer Motion.
- **AI Culinary Assistant:** Server-side Google Gemini (`gemini-3.8-flash`) proxy endpoint (`/api/chat`) with menu context injection, bilingual support (EN/RO), and Web Speech API (STT/TTS).
- **Interactive UI:** Dynamic menu filters, photo gallery, testimonials, and structured data (Schema.org JSON-LD).
- **Prototyped Operations:** Client-side in-memory mock API (`services/apiService.ts`) for menu CRUD, reservations, and admin dashboard prototype.

---

## 3. Product Release History & Completed Milestones

| Version | Milestone | Description | Status |
| :--- | :--- | :--- | :--- |
| **v1.0** | **Core MVP Launch** | Responsive responsive layout, homepage hero, static menu presentation, client-side reservation request form, and floating AI chatbot widget. | `Completed` |
| **v1.1** | **Visual & SEO Polish** | Hero video background, dynamic photo gallery, dietary menu filters (vegan, gluten-free, spicy), Schema.org JSON-LD microdata, Framer Motion micro-interactions. | `Completed` |
| **v1.2** | **Full-Stack Architecture & Simulation** | Express full-stack server (`server.ts`), migration of Gemini API calls to secure server-side proxy (`/api/chat`), mock asynchronous data layer (`apiService.ts`), prototype Admin Dashboard, error boundary with Sentry logging. | `Completed` |
| **v1.3** | **The Smart Experience** | Multilingual internationalization framework (`LanguageContext` for English & Romanian), Web Speech API voice interaction (STT & TTS), enriched culinary reasoning and wine pairing prompts in Gemini. | `Completed` |

---

## 4. Platform Evolution Roadmap (Turning MVP into a Full-Scale Platform)

To graduate from an interactive prototype to a production-ready, revenue-generating commercial platform, the roadmap is divided into structured architectural and functional phases:

```
[ v1.x MVP & Simulation ]
          │
          ▼
[ Phase 2.0: Persistent Backend & Enterprise Operations ]
          │
          ▼
[ Phase 2.1: Online Ordering, Cart & Digital Commerce ]
          │
          ▼
[ Phase 2.2: Location, Real-Time Discovery & Social Proof ]
          │
          ▼
[ Phase 2.3: Customer Loyalty, Profiles & Personalization ]
          │
          ▼
[ Phase 2.4: Autonomous AI Concierge & Conversational Commerce ]
          │
          ▼
[ Phase 2.5: PWA, Hardware Integrations & Kitchen Ops ]
```

---

### Phase 2.0: Persistent Backend, Real Database & Enterprise Security
*Objective: Replace all in-memory mock data with a production-grade relational database, true authentication, and reliable transactional messaging.*

1. **Production Database & ORM Integration**
   - Provision a managed PostgreSQL instance (Cloud SQL / Supabase / Neon).
   - Implement **Drizzle ORM** (or Prisma) for schema management, migrations, and type-safe queries.
   - Design normalized database schemas:
     - `users` (credentials, roles, profile, contact info)
     - `menu_categories` & `menu_items` (title, descriptions, pricing, nutritional details, allergen tags, active status)
     - `tables` & `dining_areas` (table capacity, indoor/outdoor/patio zones, combination rules)
     - `reservations` (guest details, timestamp, party size, status, assigned table, notes)
     - `testimonials` / `reviews` (rating, review text, verified dining badge, approval status)

2. **Secure Authentication & Role-Based Access Control (RBAC)**
   - Replace the query-parameter login (`?admin=true` with plaintext password) with enterprise authentication.
   - Implement `argon2` or `bcrypt` password hashing, JWT access tokens in `HttpOnly`, `SameSite=Strict` secure cookies.
   - Establish distinct operational roles:
     - **Super Admin:** System configuration, staff management, financial reports.
     - **Restaurant Manager / Host:** Live reservation book, table allocation, 86'd menu items.
     - **Kitchen Staff:** Order status updates and preparation queues.
     - **Customer / Diner:** Reservation self-service, order history, loyalty rewards.

3. **Intelligent Capacity & Table Management**
   - Real-time availability calculation based on restaurant operating hours, active table configurations, and average turnaround times (e.g., 90 mins for party of 2, 120 mins for party of 4+).
   - Conflict detection preventing double-booking and automated waitlist management for fully booked time slots.

4. **Transactional Communication Services**
   - Integration with email service providers (Resend / SendGrid) to send branded reservation confirmation emails with `.ics` calendar attachments.
   - SMS notifications and booking reminders (Twilio / AWS SNS) 2 hours prior to reservation time with 1-click confirmation or cancellation.
   - Customer self-service portal: Unique booking reference codes enabling diners to view, modify party size/time, or cancel bookings without calling the restaurant.

---

### Phase 2.1: Direct-to-Consumer Online Ordering & Commerce
*Objective: Build a first-party takeout and delivery engine to capture revenue without third-party marketplace commissions (UberEats/DoorDash).*

1. **Digital Menu 2.0 & Item Customization**
   - High-resolution dish photography with cloud asset storage (Cloud Storage / S3 / Cloudinary) and CDN delivery.
   - Item modifier engine:
     - Cooking preferences (e.g., Filet Mignon steak temperature: Rare to Well-Done).
     - Ingredient omissions (e.g., "No garlic", "Gluten-free pasta substitute").
     - Add-ons and premium upgrades (e.g., "Add shaved black truffles", "Add side asparagus").
   - Real-time "86'd" (Out of Stock) toggle in the Admin Dashboard instantly updating the public menu.

2. **Cart & Dynamic Checkout Flow**
   - Client-side persistent cart supporting both guest checkout and logged-in profiles.
   - Fulfillment selector:
     - **Curbside / Takeaway Pickup:** Estimated ready time, vehicle make/model for curbside delivery.
     - **Dine-In Table Ordering:** QR code scan on tables allowing guests to order and pay from their phones.
     - **Local Delivery:** Address validation, delivery radius polygon checking, and custom delivery fee calculation.

3. **Payment Processing & Financial Compliance**
   - Integration with **Stripe Elements**:
     - Seamless credit/debit card checkout.
     - 1-click digital wallets (Apple Pay, Google Pay).
     - Configurable tipping options (15%, 18%, 20%, custom tip).
     - Automated digital receipts and tax calculation (sales tax / VAT compliant).

4. **Live Kitchen Display System (KDS) & Order Tracker**
   - Dedicated `/kitchen` live display for back-of-house staff with audio chimes for incoming orders.
   - Dynamic order status progression: `Received` ➔ `In Preparation` ➔ `Ready for Pickup / Out for Delivery` ➔ `Fulfilled`.
   - Real-time customer order tracking page with live countdown timer and SMS status alerts.

---

### Phase 2.2: Location Discovery, Real-Time Operating Status & Social Proof
*Objective: Maximize local discovery, simplify navigation, and establish undisputed credibility.*

1. **Interactive Location & Google Maps Platform Integration**
   - Custom dark-themed Google Maps Platform component on homepage and contact page.
   - Directions generator linking directly to Google Maps, Apple Maps, and Waze.
   - Parking guide and transit details (valet parking instructions, nearest metro/bus stations).

2. **Dynamic Operating Hours & Real-Time Open/Closed Engine**
   - Automatic "Open Now" / "Kitchen Closes in 45m" / "Closed Today" banner calculated against the restaurant's operational timezone.
   - Holiday schedule overrides and special closure announcements managed directly from the Admin Panel.

3. **Syndicated Social Proof & Live Review Ecosystem**
   - Live synchronization with Google Places API and TripAdvisor to pull authenticated, recent 5-star reviews.
   - Post-dining verified review collection: Automated email sent the morning after dining asking for guest feedback.
   - Curated Instagram / TikTok social wall embedding real diner photos and UGC (User Generated Content).

4. **Event & Private Dining Booking Engine**
   - Dedicated page for private dining rooms, wedding receptions, and corporate catering.
   - Interactive inquiry form capturing budget, guest count, dietary restrictions, and A/V equipment needs.
   - Automated routing of inquiries to the restaurant events coordinator.

---

### Phase 2.3: Customer Loyalty, Dining Profiles & Retention
*Objective: Build lasting customer relationships that maximize repeat visits and customer lifetime value (LTV).*

1. **Customer Accounts & Social Single Sign-On (SSO)**
   - Frictionless sign-in with Google, Apple, and email magic links.
   - Customer profile dashboard displaying upcoming bookings, past order receipts, and saved payment methods.

2. **The Gemini Club (Tiered Loyalty & Rewards)**
   - Points accumulation per dollar spent across both in-house dining and online orders.
   - VIP tiers (Silver, Gold, Chef's Circle) offering perks:
     - Priority reservation booking during peak Friday/Saturday prime slots.
     - Complimentary anniversary / birthday dessert or champagne toast.
     - Exclusive invitations to seasonal wine tastings and secret menu items.

3. **Personalized Dietary & Allergen Profiles**
   - Diners can save dietary preferences (e.g., Celiac, Vegan, Nut Allergy) to their account profile.
   - The online menu automatically flags compatible dishes and hides or warns about potential allergen cross-contamination when the user is logged in.

---

### Phase 2.4: Autonomous AI Concierge & Conversational Commerce
*Objective: Expand the AI assistant from an informational Q&A bot into an active booking agent and personalized culinary sommelier.*

1. **Autonomous Table Booking via Gemini Tool/Function Calling**
   - Equip Gemini with structured tool calls (`checkAvailability`, `createPendingReservation`, `lookupBooking`).
   - Allow natural language bookings:
     > *"Can I book a table for 4 this Saturday at 7:30 PM? We prefer a quiet booth."*
     The AI inspects live database availability, offers matching slots, collects party details, and initiates the reservation directly in the conversation.

2. **AI Sommelier & Multi-Course Menu Planner**
   - Contextual pairing engine recommending exact wine and beverage pairings for selected dishes based on flavor profiles, tannins, and acidity.
   - "Curate My Evening" wizard: Guest specifies party size, budget, and mood (e.g., "Romantic Anniversary dinner under $150 with light seafood"), and the AI crafts a customized 3-course menu with explanation.

3. **Real-Time Multimodal Voice Agent (Gemini Live)**
   - Upgrade the current Web Speech API prototype to full duplex, low-latency streaming voice conversation using the Gemini Live API.
   - Enables ultra-natural voice interactions on mobile with realistic conversational pacing and culinary nuance.

4. **Operational AI for Management**
   - Automated sentiment analysis on guest reviews and reservation notes.
   - AI-generated daily kitchen prep summaries and reservation briefings for the floor staff during daily standups.

---

### Phase 2.5: Progressive Web App (PWA) & Operational Scalability
*Objective: Deliver native-app speed, offline resilience, and enterprise-grade performance.*

1. **Progressive Web App (PWA) Implementation**
   - Web App Manifest (`manifest.json`) and service worker installation prompt for mobile and desktop.
   - Offline menu caching: Allow guests to browse the entire food and beverage menu even in poor cellular reception areas (e.g., restaurant patios, basements).
   - Push notifications for order pickup readiness and reservation reminders.

2. **High-Performance Asset Pipeline**
   - Automatic conversion and serving of images in next-generation WebP/AVIF formats.
   - Dynamic `srcset` responsive image delivery and CDN caching headers.
   - Edge caching of static API responses to keep TTFB (Time to First Byte) under 100ms globally.

3. **Security, Compliance & Observability**
   - Full GDPR & CCPA compliance (cookie consent management, privacy policy, data export/deletion workflows).
   - Upgraded production monitoring:
     - Full Sentry performance tracing and exception alerting.
     - Uptime monitoring and synthetic ping checks.
     - Database audit log recording all reservation alterations and staff menu overrides.

---

## 5. Technology Stack Architecture (Target Production State)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / FRONTEND                             │
│  React 19 SPA + Vite + TypeScript + Tailwind CSS + Framer Motion + PWA  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS / JSON / WebSockets
┌────────────────────────────────────▼────────────────────────────────────┐
│                        EXPRESS APPLICATION SERVER                       │
│                           (Node.js 22 LTS / TS)                         │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│    REST Routes    │  Auth Middleware  │        Gemini AI Service        │
│  /api/reservations│     JWT/Cookies   │      (@google/genai SDK)        │
│  /api/menu        │     Role Guards   │     gemini-3.8-flash model      │
│  /api/orders      │     Rate Limiting │     Function / Tool Calling     │
└─────────┬─────────┴─────────┬─────────┴────────────────┬────────────────┘
          │                   │                          │
┌─────────▼─────────┐ ┌───────▼─────────┐      ┌─────────▼────────────────┐
│   POSTGRESQL DB   │ │ EXTERNAL APIS   │      │   GOOGLE CLOUD PLATFORM  │
│ (Cloud SQL/Drizzle│ │ - Stripe (Pay)  │      │ - Google Maps API        │
│ - Users & Roles   │ │ - Resend (Email)│      │ - Google Places Reviews  │
│ - Menu & Inventory│ │ - Twilio (SMS)  │      │ - Cloud Storage (Images) │
│ - Bookings/Orders │ │                 │      │                          │
└───────────────────┘ └─────────────────┘      └──────────────────────────┘
```

---

## 6. Implementation Prioritization Matrix

| Phase | Milestone Name | Impact | Complexity | Target Timeline |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 2.0** | Persistent PostgreSQL DB & Real Auth | **Critical** | Medium | Months 1–2 |
| **Phase 2.0** | Real Capacity Management & Transactional Email/SMS | **High** | Medium | Month 2 |
| **Phase 2.1** | Online Takeout & Curbside Ordering (Stripe Checkout) | **Critical** | High | Month 3 |
| **Phase 2.1** | Live Kitchen Display System (KDS) | **High** | Medium | Month 4 |
| **Phase 2.2** | Google Maps Platform & Real-Time Open Status | **Medium** | Low | Month 4 |
| **Phase 2.2** | Verified Review Syndication & Event Inquiry Engine | **Medium** | Low | Month 5 |
| **Phase 2.3** | Customer Accounts & Loyalty Rewards Program | **High** | High | Months 5–6 |
| **Phase 2.4** | Autonomous AI Table Booking via Function Calling | **High** | Medium | Month 6 |
| **Phase 2.4** | AI Sommelier & Daily Chef Prep Briefings | **Medium** | Medium | Month 7 |
| **Phase 2.5** | PWA Offline Support & Asset Optimization | **Medium** | Low | Month 7 |

---

## 7. Key Strategic Risks & Mitigation Plans

1. **Overbooking & Reservation Synchronization Conflicts**
   - *Risk:* Concurrent booking requests for the same high-demand slot (e.g., Valentine's Day 8:00 PM) causing double bookings.
   - *Mitigation:* Implement database-level row locking and atomic reservation allocation with 10-minute cart holds while guests complete details.

2. **Payment Compliance & Chargeback Exposure**
   - *Risk:* Fraudulent online delivery/takeaway orders resulting in payment disputes and chargebacks.
   - *Mitigation:* Enforce Stripe 3D Secure (3DS) authentication, CVV verification, and SMS verification for first-time order collections exceeding $100.

3. **Data Privacy & Regulatory Adherence (GDPR / CCPA)**
   - *Risk:* Collecting customer telephone numbers, physical addresses, and dining history without adequate consent mechanisms.
   - *Mitigation:* Implement granular opt-in checkboxes for marketing SMS/email, maintain encrypted personal data stores, and provide automated "Download My Data" and "Forget Me" account actions.

4. **Third-Party API Downtime & Fallback Grace**
   - *Risk:* External service outages (Stripe, Twilio, Gemini, Google Maps) degrading the core website experience.
   - *Mitigation:* Implement circuit breakers and graceful UI degradation (e.g., if Twilio is temporarily unavailable, queue SMS delivery via background workers and rely on immediate email confirmations; if Gemini experiences high demand, display standard curated FAQ menus with direct phone contact).
