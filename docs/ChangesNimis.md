# Frontend Architecture & Routing Proposal

We audited the React frontend and identified several opportunities to clean up the folder structure, fix inconsistent naming conventions, improve routing flow, and resolve cross-platform import issues.

---

## 1. Issues Identified in the Current Setup

### 📁 Inconsistent Directory and File Casing
* **Pages**: `Auth` (PascalCase), `User` (PascalCase), `admin` (lowercase), `freelancer` (lowercase), `home` (lowercase).
* **Components**: `General` (PascalCase), `layout` (lowercase), `profile` (lowercase), `ui` (lowercase), `userProfile` (camelCase), `wallet` (lowercase).
* **Cross-Platform Bug**: The API folder is named `frontend/src/Services` (capital `S`), but files import it using lowercase `../../services/api`. This will build fine on Windows (case-insensitive) but will crash during production builds on Linux (Vercel, Netlify, Docker).

### 🔀 Route Design and State Commingling
* **Tab-Based Routing**: In `Orders.jsx` (the client page), the Dashboard, Projects catalog, and Wallet are handled by a single React state (`currentTab`). Clicking on links in the header changes the internal page state but does not update the URL.
* **Inline Marketplace View**: In `Orders.jsx`, the entire freelancer marketplace search is toggled in and out via a state boolean (`showMarketplace`). This should be an independent route (e.g. `/gigs` or `/marketplace`).
* **Hardcoded Links**: `UserNavbar.jsx` contains standard HTML anchor links (`href="#"`) which will reload the page or do nothing, instead of utilizing `<Link to="...">` from `react-router-dom`.
* **Dynamic Route Parameters**: Gig details are hardcoded to `/gig-details` instead of matching a parameter like `/gigs/:id`.

### 🧩 Component & Spelling Conflicts
* `components/profile/GigList.jsx` exports `GigCard` (a single card), while `components/profile/GigCard.jsx` exports another placeholder `GigCard`.
* `components/General/FreelaanceMarketPlace.jsx` has a typo in its name (`Freelaance`).

---

## 2. Proposed Folder Restructure

We suggest moving to lowercase folder names (standard in React applications) and PascalCase for React component files, grouping pages by domain.

```text
src/
├── assets/
├── components/
│   ├── ui/                    # Reusable primitive UI items (Button, Input, etc.)
│   ├── layout/                # RootLayout, Footer, Shared Navbars
│   ├── freelancer/            # Freelancer-specific components (StatCard, OrderRow)
│   ├── client/                # Client-specific components (ProjectCard, SpendingSummary)
│   └── wallet/                # WalletCard, TransactionHistory
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── home/
│   │   └── HomePage.jsx
│   ├── client/
│   │   ├── ClientDashboard.jsx
│   │   ├── ClientProjects.jsx
│   │   ├── ClientWallet.jsx
│   │   └── ClientProfile.jsx
│   ├── freelancer/
│   │   ├── FreelancerDashboard.jsx
│   │   ├── FreelancerProfile.jsx
│   │   ├── CreateGigPage.jsx
│   │   └── EditProfilePage.jsx
│   ├── gigs/
│   │   ├── GigMarketplacePage.jsx
│   │   └── GigDetailsPage.jsx
│   ├── admin/
│   │   └── AdminDashboard.jsx
│   └── NotFoundPage.jsx
├── services/                  # Lowercase to resolve casing-mismatch builds
│   ├── api.js
│   └── authApis.js
├── routes/
│   └── AppRoutes.jsx
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## 3. Proposed React Router Routing Hierarchy

We will map pages to actual routes using nested route layouts in [AppRoutes.jsx](file:///d:/Cdac/Gitclone/Project/Freelance-Marketplace/frontend/src/routes/AppRoutes.jsx):

```jsx
<Routes>
  {/* Public / Auth Routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<RegisterPage />} />

  {/* Main Layout containing Global Header & Footer */}
  <Route path="/" element={<RootLayout />}>
    <Route index element={<HomePage />} />
    
    {/* Gig Discovery */}
    <Route path="gigs" element={<GigMarketplacePage />} />
    <Route path="gigs/:id" element={<GigDetailsPage />} />

    {/* Freelancer Console */}
    <Route path="freelancer">
      <Route index element={<FreelancerDashboard />} />
      <Route path="create-gig" element={<CreateGigPage />} />
      <Route path="edit-profile" element={<EditProfilePage />} />
      <Route path="profile" element={<FreelancerProfile />} />
    </Route>

    {/* Client Console */}
    <Route path="client">
      <Route index element={<ClientDashboard />} />
      <Route path="projects" element={<ClientProjects />} />
      <Route path="wallet" element={<ClientWallet />} />
      <Route path="profile" element={<ClientProfile />} />
    </Route>

    {/* Admin Console */}
    <Route path="admin" element={<AdminDashboard />} />
  </Route>

  {/* Fallback */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

---

## 4. Key Improvements this Restructure Delivers

1. **True SPA Experience**: The client dashboard, orders list, wallet, and marketplace are fully bookmarkable, linkable page routes, not fragile local state switch-cases.
2. **Correct Route Hierarchy**: Routes like `/client/wallet` make logical sense, and dynamic `/gigs/:id` pages allow loading specific gig content based on data arrays.
3. **Build Security**: Lowercasing the API folder to `services` prevents deployment crashes on standard Linux servers.
4. **Code Cleanliness**: Removes unused component duplicates and fixes file typos like `FreelaanceMarketPlace`.
