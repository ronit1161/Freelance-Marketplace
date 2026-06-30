import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import ProjectCard from '../../components/client/ProjectCard';
import CreateProjectModal from '../../components/client/CreateProjectModal';
import SubNavbar from '../../components/client/SubNavBar';
import { api } from '../../services/api';

export default function ClientProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(api.getProjects());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (projectFormData) => {
    const createdProject = api.addProject(projectFormData);
    setProjects([createdProject, ...projects]);
  };

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
          
          <button 
            onClick={() => navigate('/gigs')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center transition"
          >
            <Search size={16} className="mr-2 text-blue-600" /> Search
          </button>
        </div>
      </div>

      {/* Navigation tab bar */}
      <SubNavbar projectCount={projects.length} />

      {/* Project Catalog List View */}
      <div className="space-y-6 animate-in fade-in duration-200">
        <h2 className="text-xl font-bold text-slate-900 border-b border-gray-50 pb-2">Project Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={handleCreateProject} 
      />
    </div>
  );
}
