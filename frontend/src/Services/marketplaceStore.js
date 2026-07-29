// Centralized Mock Data & Application State Store for Freelance Marketplace
// Supports LocalStorage persistence and reactive update listeners

const STORE_KEY = "freelance_marketplace_store_v1";

const INITIAL_CATEGORIES = [
  { id: 1, name: "Web Development", slug: "web-dev", icon: "Code", description: "Full-stack apps, React, Spring Boot, websites" },
  { id: 2, name: "Mobile Apps", slug: "mobile-apps", icon: "Smartphone", description: "iOS, Android, React Native & Flutter solutions" },
  { id: 3, name: "Graphic & Design", slug: "graphic-design", icon: "Palette", description: "Logos, brand identities, vector art & illustrations" },
  { id: 4, name: "Digital Marketing", slug: "digital-marketing", icon: "TrendingUp", description: "SEO optimization, social media strategy & ad campaigns" },
  { id: 5, name: "Writing & Translation", slug: "writing", icon: "FileText", description: "Blog articles, technical docs, copywriting & translation" },
  { id: 6, name: "Video & Animation", slug: "video", icon: "Video", description: "Video editing, motion graphics & 3D rendering" },
  { id: 7, name: "AI Services", slug: "ai-services", icon: "Cpu", description: "Prompt engineering, AI models & automation scripts" },
  { id: 8, name: "UI/UX Design", slug: "ui-ux", icon: "Layout", description: "Figma wireframes, user journeys & app UI design" }
];

const INITIAL_USERS = [
  { id: 1, name: "John Client", email: "client@marketplace.com", role: "client", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", bio: "Tech entrepreneur and startup founder looking for top talent." },
  { id: 2, name: "Elena Rostova", email: "elena@marketplace.com", role: "freelancer", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", bio: "Senior Web & 3D UI Visualizer with 6+ years experience." },
  { id: 3, name: "Marcus Chen", email: "marcus@marketplace.com", role: "freelancer", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", bio: "Accessibility Specialist & Brand Guidelines Designer." },
  { id: 4, name: "Admin Portal", email: "admin@marketplace.com", role: "admin", status: "ACTIVE", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", bio: "System Administrator" }
];

const INITIAL_GIGS = [
  {
    id: 101,
    title: "Full-Stack Web App Development using React & Spring Boot",
    description: "I will build a responsive, production-ready web application tailored to your business needs using React, Tailwind CSS, and Spring Boot backend.",
    category: "Web Development",
    categoryId: 1,
    price: 350,
    deliveryDays: 5,
    freelancerId: 2,
    freelancerName: "Elena Rostova",
    freelancerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 4.9,
    reviewCount: 28,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-07-01T10:00:00Z"
  },
  {
    id: 102,
    title: "Minimalist Brand Identity & WCAG Accessibility Design System",
    description: "Comprehensive logo design, color typography guidelines, Figma design system, and WCAG AA contrast compliance audit for your product.",
    category: "UI/UX Design",
    categoryId: 8,
    price: 220,
    deliveryDays: 3,
    freelancerId: 3,
    freelancerName: "Marcus Chen",
    freelancerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5.0,
    reviewCount: 42,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-07-05T12:30:00Z"
  },
  {
    id: 103,
    title: "Custom iOS & Android Mobile Application Development",
    description: "Native-like cross platform mobile application built with React Native or Flutter, complete with smooth animations and secure API endpoints.",
    category: "Mobile Apps",
    categoryId: 2,
    price: 450,
    deliveryDays: 7,
    freelancerId: 2,
    freelancerName: "Elena Rostova",
    freelancerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 4.8,
    reviewCount: 15,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-07-10T14:15:00Z"
  },
  {
    id: 104,
    title: "High-Converting SEO Content Writing & Tech Blog Series",
    description: "3 search-engine-optimized articles (1,500+ words each) tailored to tech, SaaS, software development, or digital marketing topics.",
    category: "Writing & Translation",
    categoryId: 5,
    price: 120,
    deliveryDays: 2,
    freelancerId: 3,
    freelancerName: "Marcus Chen",
    freelancerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 4.9,
    reviewCount: 31,
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-07-15T09:00:00Z"
  }
];

const INITIAL_WALLETS = {
  1: { availableBalance: 1500, heldBalance: 350 }, // Client
  2: { availableBalance: 1200, heldBalance: 0 },   // Freelancer 1
  3: { availableBalance: 850, heldBalance: 0 }      // Freelancer 2
};

const INITIAL_TRANSACTIONS = [
  { id: "TXN-901", userId: 1, type: "DEPOSIT", amount: 2000, date: "2026-07-01", status: "Completed", note: "Added virtual coin funds to wallet" },
  { id: "TXN-902", userId: 1, type: "ESCROW_HOLD", amount: -350, date: "2026-07-20", status: "Held in Escrow", note: "Hold for Order #ORD-501" }
];

const INITIAL_ORDERS = [
  {
    id: 501,
    gigId: 101,
    gigTitle: "Full-Stack Web App Development using React & Spring Boot",
    gigThumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    clientId: 1,
    clientName: "John Client",
    clientEmail: "client@marketplace.com",
    freelancerId: 2,
    freelancerName: "Elena Rostova",
    price: 350,
    deliveryDays: 5,
    requirements: "Need a full-stack dashboard with dark theme and user authentication features.",
    status: "IN_PROGRESS", // PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, ACCEPTED_DELIVERY, CANCELLED
    createdAt: "2026-07-20T10:00:00Z",
    completedAt: null,
    deliveryAccepted: false,
    reviewSubmitted: false
  },
  {
    id: 502,
    gigId: 102,
    gigTitle: "Minimalist Brand Identity & WCAG Accessibility Design System",
    gigThumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80",
    clientId: 1,
    clientName: "John Client",
    clientEmail: "client@marketplace.com",
    freelancerId: 3,
    freelancerName: "Marcus Chen",
    price: 220,
    deliveryDays: 3,
    requirements: "Clean typographic logo with SVG output and primary brand hex codes.",
    status: "COMPLETED",
    createdAt: "2026-07-15T14:30:00Z",
    completedAt: "2026-07-18T16:20:00Z",
    deliveryAccepted: true,
    reviewSubmitted: true
  }
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    gigId: 102,
    orderId: 502,
    clientId: 1,
    clientName: "John Client",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    freelancerId: 3,
    rating: 5,
    comment: "Outstanding work! The brand guidelines were clean, professional, and delivered well before the estimated deadline.",
    createdAt: "2026-07-18T17:00:00Z"
  }
];

// Load store from LocalStorage or initialize default
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error loading store from localStorage", e);
  }

  const initial = {
    categories: INITIAL_CATEGORIES,
    users: INITIAL_USERS,
    gigs: INITIAL_GIGS,
    wallets: INITIAL_WALLETS,
    transactions: INITIAL_TRANSACTIONS,
    orders: INITIAL_ORDERS,
    reviews: INITIAL_REVIEWS
  };
  saveStore(initial);
  return initial;
}

function saveStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    notifyListeners();
  } catch (e) {
    console.error("Error saving store to localStorage", e);
  }
}

// Subscribers for reactive UI updates
const listeners = new Set();
export function subscribeStore(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach(cb => cb());
}

// Global Store State Holder
let currentStore = loadStore();

// --- PUBLIC STORE API ---

export const marketplaceStore = {
  // Categories
  getCategories: () => [...currentStore.categories],
  addCategory: (categoryData) => {
    const newCat = {
      id: Date.now(),
      name: categoryData.name,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      icon: categoryData.icon || "Folder",
      description: categoryData.description || ""
    };
    currentStore.categories.push(newCat);
    saveStore(currentStore);
    return newCat;
  },
  deleteCategory: (id) => {
    currentStore.categories = currentStore.categories.filter(c => c.id !== id);
    saveStore(currentStore);
  },

  // Users
  getUsers: () => [...currentStore.users],
  getUserById: (id) => currentStore.users.find(u => u.id === id || u.email === id),
  addUser: (userData) => {
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || "client",
      status: "ACTIVE",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      bio: userData.bio || "Platform member"
    };
    currentStore.users.push(newUser);
    saveStore(currentStore);
    return newUser;
  },
  toggleUserBlock: (userId) => {
    const user = currentStore.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
      saveStore(currentStore);
    }
    return user;
  },
  deleteUser: (userId) => {
    currentStore.users = currentStore.users.filter(u => u.id !== userId);
    saveStore(currentStore);
  },

  // Gigs
  getGigs: () => [...currentStore.gigs],
  getGigById: (id) => currentStore.gigs.find(g => Number(g.id) === Number(id)),
  createGig: (gigData, freelancer) => {
    const newGig = {
      id: Date.now(),
      title: gigData.title,
      description: gigData.description,
      category: gigData.category || "Web Development",
      categoryId: Number(gigData.categoryId) || 1,
      price: Number(gigData.price) || 50,
      deliveryDays: Number(gigData.deliveryDays) || 3,
      freelancerId: freelancer?.id || 2,
      freelancerName: freelancer?.name || "Elena Rostova",
      freelancerAvatar: freelancer?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      rating: 5.0,
      reviewCount: 0,
      thumbnail: gigData.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString()
    };
    currentStore.gigs.unshift(newGig);
    saveStore(currentStore);
    return newGig;
  },
  updateGig: (gigId, updatedFields) => {
    const gigIndex = currentStore.gigs.findIndex(g => Number(g.id) === Number(gigId));
    if (gigIndex !== -1) {
      currentStore.gigs[gigIndex] = { ...currentStore.gigs[gigIndex], ...updatedFields };
      saveStore(currentStore);
      return currentStore.gigs[gigIndex];
    }
    return null;
  },
  deleteGig: (gigId) => {
    currentStore.gigs = currentStore.gigs.filter(g => Number(g.id) !== Number(gigId));
    saveStore(currentStore);
  },

  // Wallets & Transactions
  getWallet: (userId = 1) => {
    if (!currentStore.wallets[userId]) {
      currentStore.wallets[userId] = { availableBalance: 1000, heldBalance: 0 };
    }
    return { ...currentStore.wallets[userId] };
  },
  depositCoins: (userId, amount) => {
    const numericAmount = Number(amount);
    if (!currentStore.wallets[userId]) {
      currentStore.wallets[userId] = { availableBalance: 0, heldBalance: 0 };
    }
    currentStore.wallets[userId].availableBalance += numericAmount;
    
    currentStore.transactions.unshift({
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      type: "DEPOSIT",
      amount: numericAmount,
      date: new Date().toISOString().split('T')[0],
      status: "Completed",
      note: "Added virtual coins to wallet"
    });
    saveStore(currentStore);
    return currentStore.wallets[userId];
  },
  getTransactions: (userId) => {
    if (userId) {
      return currentStore.transactions.filter(t => Number(t.userId) === Number(userId));
    }
    return [...currentStore.transactions];
  },

  // Orders & Escrow Workflow
  getOrders: () => [...currentStore.orders],
  getOrderById: (orderId) => currentStore.orders.find(o => Number(o.id) === Number(orderId)),
  
  createOrder: ({ gig, client, requirements }) => {
    const clientUserId = client?.id || 1;
    const wallet = currentStore.wallets[clientUserId] || { availableBalance: 1000, heldBalance: 0 };

    if (wallet.availableBalance < gig.price) {
      throw new Error(`Insufficient virtual coin balance! You need ${gig.price} coins, but only have ${wallet.availableBalance} coins available.`);
    }

    // Hold in Escrow
    wallet.availableBalance -= gig.price;
    wallet.heldBalance += gig.price;
    currentStore.wallets[clientUserId] = wallet;

    const orderId = Date.now();
    const newOrder = {
      id: orderId,
      gigId: gig.id,
      gigTitle: gig.title,
      gigThumbnail: gig.thumbnail,
      clientId: clientUserId,
      clientName: client?.name || "John Client",
      clientEmail: client?.email || "client@marketplace.com",
      freelancerId: gig.freelancerId,
      freelancerName: gig.freelancerName,
      price: gig.price,
      deliveryDays: gig.deliveryDays,
      requirements: requirements || "Standard project requirements.",
      status: "PENDING", // Initial state
      createdAt: new Date().toISOString(),
      completedAt: null,
      deliveryAccepted: false,
      reviewSubmitted: false
    };

    currentStore.orders.unshift(newOrder);

    // Record Escrow Hold Transaction
    currentStore.transactions.unshift({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: clientUserId,
      type: "ESCROW_HOLD",
      amount: -gig.price,
      date: new Date().toISOString().split('T')[0],
      status: "Held in Escrow",
      note: `Escrow hold for order #${orderId}`
    });

    saveStore(currentStore);
    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus) => {
    const order = currentStore.orders.find(o => Number(o.id) === Number(orderId));
    if (order) {
      order.status = newStatus;
      if (newStatus === "COMPLETED") {
        order.completedAt = new Date().toISOString();
      }
      saveStore(currentStore);
    }
    return order;
  },

  acceptDeliveryAndReleaseEscrow: (orderId) => {
    const order = currentStore.orders.find(o => Number(o.id) === Number(orderId));
    if (!order) throw new Error("Order not found");
    
    order.deliveryAccepted = true;
    order.status = "COMPLETED";

    const clientUserId = order.clientId;
    const freelancerUserId = order.freelancerId;

    // Deduct held balance from Client
    if (currentStore.wallets[clientUserId]) {
      currentStore.wallets[clientUserId].heldBalance = Math.max(0, currentStore.wallets[clientUserId].heldBalance - order.price);
    }

    // Release coins to Freelancer
    if (!currentStore.wallets[freelancerUserId]) {
      currentStore.wallets[freelancerUserId] = { availableBalance: 0, heldBalance: 0 };
    }
    currentStore.wallets[freelancerUserId].availableBalance += order.price;

    // Record Escrow Release Transaction
    currentStore.transactions.unshift({
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: freelancerUserId,
      type: "ESCROW_RELEASE",
      amount: order.price,
      date: new Date().toISOString().split('T')[0],
      status: "Payment Settled",
      note: `Escrow earnings released from order #${orderId}`
    });

    saveStore(currentStore);
    return order;
  },

  deleteOrder: (orderId) => {
    currentStore.orders = currentStore.orders.filter(o => Number(o.id) !== Number(orderId));
    saveStore(currentStore);
  },

  // Reviews
  getReviews: (gigId) => {
    if (gigId) {
      return currentStore.reviews.filter(r => Number(r.gigId) === Number(gigId));
    }
    return [...currentStore.reviews];
  },

  addReview: ({ gigId, orderId, client, rating, comment }) => {
    const newReview = {
      id: Date.now(),
      gigId: Number(gigId),
      orderId: Number(orderId),
      clientId: client?.id || 1,
      clientName: client?.name || "John Client",
      clientAvatar: client?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    currentStore.reviews.unshift(newReview);

    // Update order reviewSubmitted flag
    const order = currentStore.orders.find(o => Number(o.id) === Number(orderId));
    if (order) {
      order.reviewSubmitted = true;
    }

    // Update Gig average rating
    const gig = currentStore.gigs.find(g => Number(g.id) === Number(gigId));
    if (gig) {
      const gigReviews = currentStore.reviews.filter(r => Number(r.gigId) === Number(gigId));
      const avg = gigReviews.reduce((sum, r) => sum + r.rating, 0) / gigReviews.length;
      gig.rating = Number(avg.toFixed(1));
      gig.reviewCount = gigReviews.length;
    }

    saveStore(currentStore);
    return newReview;
  },

  deleteReview: (reviewId) => {
    currentStore.reviews = currentStore.reviews.filter(r => Number(r.id) !== Number(reviewId));
    saveStore(currentStore);
  }
};
