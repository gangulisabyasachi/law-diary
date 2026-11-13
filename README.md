# CounselBook — Modern Legal Chamber Diary

A modern, responsive legal chamber management web application built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **Framer Motion**, and **MongoDB (Mongoose)**.

Designed for advocates, chamber teams, junior associates, and litigants to manage court matters, cause lists, judicial orders, and approvals with real-time database synchronization.

---

## 🏛️ Key Features

- **Judicial Cause List & Calendar**: Grouped chronological view of upcoming and past hearings with automated day/month badges and bench outcome recording.
- **Digital Case Files**: Case registry featuring court/bench details, next hearing countdowns, judicial seal watermarks, and tabbed file navigation.
- **Court Orders on Record**: Chronological interim and final orders repository with operative text formatting.
- **Two-Tier Approval Engine**: Junior associates submit drafts, hearings, and status updates to the principal advocate's verification queue before they alter official court records.
- **Client Transparency Portal**: Real-time access for clients to view case stages, upcoming dates, and engage in bilateral messaging with their legal counsel.
- **Live MongoDB Integration**: Full Mongoose models for `Users`, `Cases`, `Approvals`, and `Decisions`, complete with auto-seeding and live connection health monitoring.
- **Modern UI & Motion**: Deep court-ink palette (`#070d18`), burnished brass accents (`#cda03c`), glassmorphic panels, and smooth Framer Motion micro-interactions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Frontend**: [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs` password hashing

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/gangulisabyasachi/law-diary.git
cd law-diary
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# MongoDB Atlas Cloud or Local MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/counselbook?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-secret-key-here

PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

The application automatically seeds 6 demo accounts upon first connection:

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Principal Advocate** | `lawyer@chambers.in` | `lawyer123` | Full chamber control, approval desk, hearings & orders |
| **Junior Associate** | `associate@chambers.in` | `assoc123` | Assigned matters, submits edits for review |
| **Corporate Litigant** | `sunrise@chambers.in` | `client123` | View company petitions, hearings, message legal team |
| **Individual Litigant** | `client@chambers.in` | `client123` | View private suits, next court dates |
| **Chamber Administrator** | `admin@chambers.in` | `admin123` | Manage chamber accounts, audit log, reset demo data |

---

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── approvals/       # Associate verification queue endpoints
│   │   │   ├── auth/login/      # Session login & JWT issuance
│   │   │   ├── health/          # Live database health ping
│   │   │   ├── ops/             # Mutation journal applier
│   │   │   ├── reset/           # Admin database re-seeder
│   │   │   ├── state/           # Consolidated chamber state query
│   │   │   └── users/[id]/      # User management endpoints
│   │   ├── globals.css          # Design system & custom scrollbars
│   │   ├── layout.tsx           # Root metadata & fonts
│   │   └── page.tsx             # Main application shell & view switcher
│   ├── components/
│   │   ├── views/               # Dashboard, Cases, Detail, Calendar, etc.
│   │   ├── AuthScreen.tsx       # Sign-in hero with 1-click role switcher
│   │   ├── Modals.tsx           # Animated dialogs for case mutations
│   │   ├── MongoGuideModal.tsx  # In-app MongoDB setup documentation
│   │   ├── Navbar.tsx           # Top navigation with live DB status badge
│   │   ├── Sidebar.tsx          # Role-aware navigation drawer
│   │   └── ToastContainer.tsx   # Slide-in alert system
│   ├── context/
│   │   └── ChamberContext.tsx   # Global React context & actions
│   ├── lib/
│   │   ├── auth.ts              # Password hashing & JWT helpers
│   │   ├── dataService.ts       # Unified data layer with fallback
│   │   ├── mongodb.ts           # Cached Mongoose connection singleton
│   │   └── seedData.ts          # Authentic court case demo records
│   ├── models/                  # Mongoose schemas (User, Case, Approval, Decision)
│   └── types/                   # TypeScript interfaces
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
└── tailwind.config.ts
```

---

## 📄 License
MIT

