# Frontend Folder Structure

This document defines how the `src/` folder is organized for the Freelance Marketplace frontend. **Read this before creating any new file.** If you're unsure where something goes, check the "Rule of Thumb" section at the bottom before asking in the group chat.

We use a **feature-based architecture**: code is grouped by what it does (gigs, orders, wallet...), not by what type of file it is (all components in one place, all hooks in another). This keeps each feature self-contained so four people can work in parallel without stepping on each other's files.

---

## Full Structure

```
src/
├── app/
│   ├── App.jsx
│   ├── routes.jsx          # ALL routes defined here. Nowhere else.
│   └── providers.jsx       # Wraps app in Context providers
│
├── assets/
│   ├── images/
│   └── icons/
│
├── components/              # Global, reusable, feature-agnostic ONLY
│   ├── common/               # Button, Input, Card, Modal, Badge, Spinner
│   ├── layout/                # Navbar, Footer, Sidebar, PageLayout
│   └── ui/                     # Low-level primitives: Dropdown, Tabs, Tooltip
│
├── features/
│   ├── auth/
│   │   ├── pages/              # LoginPage.jsx, RegisterPage.jsx
│   │   ├── components/         # LoginForm, RegisterForm
│   │   ├── hooks/              # useAuth.js
│   │   ├── services/           # authApi.js
│   │   └── validation/         # authSchema.js
│   │
│   ├── home/
│   │   ├── pages/               # HomePage.jsx
│   │   └── components/          # Hero, SearchBar, PopularCategories, FeaturedGigs, Testimonials
│   │
│   ├── gigs/
│   │   ├── pages/                # GigListPage, GigDetailsPage, CreateGigPage
│   │   ├── components/           # GigCard, GigFilters, GigGallery
│   │   ├── hooks/                 # useGigs.js
│   │   └── services/              # gigApi.js
│   │
│   ├── orders/
│   │   ├── pages/
│   │   ├── components/            # OrderCard, OrderStatusTracker
│   │   ├── hooks/
│   │   └── services/               # orderApi.js
│   │
│   ├── wallet/
│   │   ├── pages/
│   │   ├── components/             # WalletBalance, TransactionHistory
│   │   └── services/                # walletApi.js
│   │
│   ├── messages/
│   │   ├── pages/
│   │   ├── components/              # ChatWindow, ChatList, MessageBubble
│   │   └── services/                 # messageApi.js
│   │
│   ├── reviews/
│   │   ├── components/                # ReviewCard, ReviewForm, RatingStars
│   │   └── services/                   # reviewApi.js
│   │
│   ├── dashboard/                       # Admin dashboard
│   │   ├── pages/
│   │   └── components/                  # UserTable, GigModerationPanel, StatsCards
│   │
│   └── profile/
│       ├── pages/
│       └── components/                   # ProfileHeader, ProfileEditForm
│
├── hooks/                    # TRULY global hooks only (useDebounce, useLocalStorage)
├── services/                  # Shared axios instance/interceptors ONLY — not feature APIs
├── context/                    # AuthContext.jsx, ThemeContext.jsx
├── utils/                       # formatDate.js, currencyFormatter.js, constants.js
├── data/                         # Mock data: mockGigs.js, mockUsers.js, mockOrders.js
└── styles/                        # index.css, Tailwind config companion styles
```

---

## Core Rules

1. **One feature, one folder.** Everything auth-related — pages, components, hooks, API calls, validation — lives inside `features/auth/`. Same for gigs, orders, wallet, etc.

2. **Global `components/` is for cross-feature reuse only.** A `Button` or `Modal` used by every feature goes in `components/common/` or `components/ui/`. A `GigCard` used only inside the gigs feature stays in `features/gigs/components/`.

3. **No hardcoded data in components.** All mock data lives in `data/`. When the backend is ready, we swap the data source, not the component.

4. **No direct axios calls in components.** Every API call goes through a service file — either the feature's own `services/xApi.js`, or the shared instance in the root `services/`. Components call service functions, never `axios.get(...)` directly.

5. **Routes only live in `app/routes.jsx`.** Never define a `<Route>` inside a random component.

6. **Keep components dumb.** UI components render props and call callbacks — they don't own business logic. Business logic belongs in hooks or services.

---

## Rule of Thumb — "Where does this go?"

Ask: **does more than one feature need this?**

- **No** → it stays inside that feature's own folder.
- **Yes** → promote it to the global `components/`, `hooks/`, or `utils/`.

If you're building something and it doesn't fit cleanly into any feature (e.g. a generic loading spinner) — it belongs in `components/common/`, not inside a feature folder "just for now."

---

## Git Workflow Reminder

Branch from `develop` as `feature/<feature-name>` (e.g. `feature/gig-listing`). Since each feature has its own folder, two people working on different features should rarely touch the same file — if you find yourself editing another feature's folder, that's a signal to check in with whoever owns it first.