import { useState } from 'react';
import { Search, Plus} from 'lucide-react';
import ProjectCard from '../../components/userProfile/ProjectCard';
import SpendingSummary from '../../components/userProfile/SpendingSummary';
import CreateProjectModal from '../../components/userProfile/CreateProjectModal';
import SubNavbar from '../../components/userProfile/SubNavBar';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import WalletCard from '../../components/wallet/WalletCard';
import FreelancerMarketplace from '../../components/General/FreelaanceMarketPlace';
import { api } from '../../Services/api';

export default function Orders() {
 const [projects, setProjects] = useState(api.getProjects());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Dashboard internal navigation state sub-tabs
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [walletViewMode, setWalletViewMode] = useState('default');
  
  // Manage whether this page should conditionally overlay the Marketplace view
  const [showMarketplace, setShowMarketplace] = useState(false);

  const handleCreateProject = (projectFormData) => {
    const createdProject = api.addProject(projectFormData);
    setProjects([createdProject, ...projects]);
    setCurrentTab('dashboard');
  };

  /* --- ROOT INTERCEPTOR FOR MARKETPLACE --- */
  if (showMarketplace) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <FreelancerMarketplace onBackClick={() => setShowMarketplace(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      
      {/* Top Welcome Title Banner Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Adrian</h1>
          <p className="text-gray-500 mt-1">Manage your ongoing creative partnerships and find your next talent.</p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center shadow-sm transition"
          >
            <Plus size={16} className="mr-2" /> Post a New Request
          </button>
          
          {/* Triggers internal frame transformation to full marketplace view */}
          <button 
            onClick={() => setShowMarketplace(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center transition"
          >
            <Search size={16} className="mr-2 text-blue-600" /> Search
          </button>
        </div>
      </div>

      {/* Internal Sub Navigation Component Tab Bar */}
      <SubNavbar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => { setCurrentTab(tab); setWalletViewMode('default'); }} 
        projectCount={projects.length} 
      />

      {/* --- DASHBOARD ROUTED SWITCH VIEWS --- */}
      {currentTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
              <button onClick={() => setCurrentTab('orders')} className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="space-y-6">
            <SpendingSummary />
          </div>
        </div>
      )}

      {currentTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="text-xl font-bold text-slate-900 border-b border-gray-50 pb-2">Project Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {currentTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
          <div className="lg:col-span-1">
            <WalletCard balance={api.getWalletBalance()} onUpdateBalance={() => setProjects(api.getProjects())} />
          </div>
          <div className="lg:col-span-2">
            <TransactionHistory 
              transactions={api.getTransactionHistory()} 
              showSeeAll={false}
            />
          </div>
        </div>
      )}

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProjectCreated={handleCreateProject} />
    </div>
  );
}