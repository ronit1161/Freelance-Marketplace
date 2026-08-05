// In-memory application tracking state store
let walletState = {
  currentBalance: 5420.50,
  history: [
    { id: 'TXN-9021', type: 'Deposit', amount: 1500.00, date: 'Jun 04, 2026', status: 'Success', statusColor: 'text-emerald-600 bg-emerald-50' },
    { id: 'TXN-8841', type: 'Withdrawal', amount: -450.00, date: 'May 28, 2026', status: 'Success', statusColor: 'text-slate-600 bg-slate-100' },
    { id: 'TXN-8712', type: 'Project Milestone Pay', amount: -1200.00, date: 'May 15, 2026', status: 'Success', statusColor: 'text-slate-600 bg-slate-100' },
    { id: 'TXN-8201', type: 'Deposit', amount: 3000.00, date: 'Apr 10, 2026', status: 'Success', statusColor: 'text-emerald-600 bg-emerald-50' }
  ]
};
const mockGigs = [
  {
    id: 'GIG-702',
    title: 'Senior 3D Abstract Data Visualizer',
    freelancer: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rate: '$85/hr',
    rating: '4.9 (124 reviews)',
    tags: ['Cinema4D', 'Data Art', 'Abstract'],
    description: 'Specializing in converting complex corporate reports and metric arrays into breathtaking 3D graphical art packages for digital distributions.'
  },
  {
    id: 'GIG-511',
    title: 'Brand Identity & Accessibility Designer',
    freelancer: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rate: '$95/hr',
    rating: '5.0 (82 reviews)',
    tags: ['WCAG Guidelines', 'Typography', 'Figma'],
    description: 'Expert design layouts focused on modern typographic structures, high-contrast access compliance, and comprehensive global design system documentation.'
  },
  {
    id: 'GIG-403',
    title: 'Editorial Illustrator & Storyboard Artist',
    freelancer: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    rate: '$70/hr',
    rating: '4.8 (210 reviews)',
    tags: ['Vector Illustration', 'Q3 Reports', 'Procreate'],
    description: 'Hand-crafted digital vector artwork customized for print, corporate blogs, newsletters, and high-profile annual market forecast summaries.'
  }
];
// Inside export const api = { ... } add:
export const gigsApi = {
  // Keep your existing getProjects, addProject, etc. exactly the same...
  
  getGigs: () => {
    return [...mockGigs];
  }
};
// Keeping original mock trackers intact for the rest of your app dashboard
let mockProjects = [
  {
    id: 'NT-2024-081',
    title: 'Editorial Illustration Series',
    description: 'Creating 12 custom editorial illustrations for the upcoming Q3 Market Report with a focus on abstract data visualization.',
    status: 'ACTIVE',
    statusColor: 'bg-emerald-100 text-emerald-700',
    stage: 'Drafting Stage',
    progress: 65,
    progressBarColor: 'bg-blue-600',
    avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'],
 
   // ADDED DETAILED DUMMY DATA LOOKUP
   detailedBrief: 'This project involves collaborating closely with the marketing and data analytics teams to translate complex financial statistics from the Q3 Forecast into user-friendly visual graphics. Deliverables include 12 high-resolution vector assets optimized for digital dashboards and print reports.',
   startDate: 'May 12, 2026',
   estimatedDelivery: 'July 28, 2026',
   teamLead: 'Sarah Jenkins (Lead Illustrator)',
   priority: 'High',
   milestones: [
     { name: 'Concept & Moodboards', done: true },
     { name: 'Wireframe Layouts', done: true },
     { name: 'Color Abstract Renderings (6/12)', done: false },     { name: 'Final Review & Vector Output', done: false }
   ]
  },
  {
    id: 'NT-2024-079',
    title: 'Brand Guidelines Refresh',
    description: 'Updating typography and color accessibility guidelines for the global brand platform.',
    status: 'REVIEW PENDING',
    statusColor: 'bg-orange-100 text-orange-700',
    stage: 'Final Feedback',
    progress: 90,
    progressBarColor: 'bg-amber-700',
    avatars: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80'],
   
   // ADDED DETAILED DUMMY DATA LOOKUP
   detailedBrief: 'A thorough audit and overhaul of the core brand styling kits to ensure total adherence to WCAG 2.1 AA digital contrast rules. This covers rewriting the brand layout type-scale parameters, picking accessible replacement hex codes for corporate styling systems, and compiling a Figma component UI library.',
   startDate: 'April 02, 2026',
   estimatedDelivery: 'June 15, 2026',
   teamLead: 'Marcus Chen (Systems Architect)',
   priority: 'Critical',
   milestones: [
     { name: 'Global Brand Contrast Audit', done: true },
     { name: 'Typography Scale Reconstruction', done: true },
     { name: 'Component Library Migration', done: true },
     { name: 'Stakeholder Compliance Sign-Off', done: false }
   ]
  }
];

const mockFinancialData = {
  totalManagedBudget: 12840.00,
  servicesUsedCount: 14,
  costSavedPro: -1240.00,
  monthlySpending: [
    { month: 'APR', height: 'h-12' },
    { month: 'MAY', height: 'h-20' },
    { month: 'JUN', height: 'h-16' },
    { month: 'JUL', height: 'h-28', active: true },
    { month: 'AUG', height: 'h-10' },
  ]
};

export const api = {
  getProjects: () => [...mockProjects],
  addProject: (newProjectData) => {
    const randomIdNumber = Math.floor(100 + Math.random() * 900);
    const structuredProject = {
      id: `#NT-2026-${randomIdNumber}`,
      title: newProjectData.title || 'Untitled Request',
      description: newProjectData.description || 'No description provided.',
      status: 'ACTIVE',
      statusColor: 'bg-emerald-100 text-emerald-700',
      stage: 'Drafting Stage',
      progress: 10,
      progressBarColor: 'bg-blue-600',
      actionLabel: 'Open Portal',
      actionStyle: 'border border-gray-200 text-blue-600 hover:bg-gray-50',
      avatars: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80']
    };
    mockProjects = [structuredProject, ...mockProjects];
    return structuredProject;
  },
  createOrder: ({ gigId, gigTitle, freelancerName, amount, brief, deliveryDays }) => {
    const numericAmount = parseFloat(amount) || 150;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `ORD-${randomId}`,
      gigId,
      title: gigTitle,
      description: brief || 'Custom order requirements submitted by client.',
      status: 'ACTIVE',
      statusColor: 'bg-emerald-100 text-emerald-700',
      stage: 'In Development',
      progress: 25,
      progressBarColor: 'bg-blue-600',
      amount: numericAmount,
      freelancerName,
      startDate: 'Today',
      estimatedDelivery: `${deliveryDays || 3} Days`,
      detailedBrief: brief,
      avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'],
      milestones: [
        { name: 'Requirements & Brief Submitted', done: true },
        { name: 'Initial Design Draft', done: false },
        { name: 'Final Review & Deliverables', done: false }
      ]
    };

    mockProjects = [newOrder, ...mockProjects];

    // Deduct escrow amount from client wallet balance & record transaction
    walletState.currentBalance = Math.max(0, walletState.currentBalance - numericAmount);
    walletState.history = [
      {
        id: `TXN-${randomId}`,
        type: 'Escrow Hold',
        amount: -numericAmount,
        date: 'Today',
        status: 'Held in Escrow',
        statusColor: 'text-amber-600 bg-amber-50'
      },
      ...walletState.history
    ];

    return newOrder;
  },

  deliverOrder: (orderId) => {
    const order = mockProjects.find(p => p.id === orderId);
    if (order) {
      order.status = 'REVIEW PENDING';
      order.statusColor = 'bg-orange-100 text-orange-700';
      order.stage = 'Work Delivered - Review Required';
      order.progress = 90;
      order.progressBarColor = 'bg-amber-600';
    }
    return order;
  },

  approveOrder: (orderId) => {
    const order = mockProjects.find(p => p.id === orderId);
    if (order) {
      order.status = 'COMPLETED';
      order.statusColor = 'bg-blue-100 text-blue-700';
      order.stage = 'Order Completed & Escrow Released';
      order.progress = 100;
      order.progressBarColor = 'bg-emerald-600';

      // Record release transaction
      walletState.history = [
        {
          id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'Escrow Release',
          amount: order.amount || 150,
          date: 'Today',
          status: 'Payment Settled',
          statusColor: 'text-emerald-600 bg-emerald-50'
        },
        ...walletState.history
      ];
    }
    return order;
  },

  getFinancialSummary: () => mockFinancialData,

  // --- NEW WALLET API FUNCTIONS (Synchronous) ---
  getWalletBalance: () => {
    return walletState.currentBalance;
  },

  getTransactionHistory: () => {
    return [...walletState.history];
  },

  depositFunds: (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return walletState.currentBalance;
    
    walletState.currentBalance += numericAmount;
    walletState.history = [
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Deposit',
        amount: numericAmount,
        date: 'Today',
        status: 'Success',
        statusColor: 'text-emerald-600 bg-emerald-50'
      },
      ...walletState.history
    ];
    return walletState.currentBalance;
  },

  withdrawFunds: (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > walletState.currentBalance) {
      return walletState.currentBalance; 
    }
    
    walletState.currentBalance -= numericAmount;
    walletState.history = [
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Withdrawal',
        amount: -numericAmount,
        date: 'Today',
        status: 'Success',
        statusColor: 'text-slate-600 bg-slate-100'
      },
      ...walletState.history
    ];
    return walletState.currentBalance;
  }
};

export const mapi = {
  getProjects: () => [...mockProjects],
  getFinancialSummary: () => mockFinancialData,
  
  getProjectById: (id) => {
    return mockProjects.find(project => project.id === id) || null;
  }
};