import  { useState } from 'react';
import { api } from '../../Services/api'; // Adding API lookup reference
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react'; // Adding icon assets

export default function ProjectCard({ project }) {
  // ADDING CODE ONLY: Local intercept state flag tracker
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  // ADDING CODE ONLY: If viewing details is toggled, intercept and render this profile view layout
  if (isViewingDetails) {
    // Get full hard-coded metrics parameters directly using the ID
    const liveProject = api.getProjectById(project.id) || project;

    return (
      <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md space-y-6 animate-in fade-in duration-200">
        <button 
          onClick={() => setIsViewingDetails(false)}
          className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={14} /> <span>Back to Workspace List</span>
        </button>

        <div className="pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${liveProject.statusColor}`}>
              {liveProject.status}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">ID: #{liveProject.id}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{liveProject.title}</h3>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detailed Brief</h4>
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
            {liveProject.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="border border-gray-50 bg-gray-50/30 rounded-xl p-3 flex items-center space-x-2.5">
            <Clock size={16} className="text-blue-500" />
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Current Phase</p>
              <p className="text-xs font-bold text-slate-800">{liveProject.stage}</p>
            </div>
          </div>
          
          <div className="border border-gray-50 bg-gray-50/30 rounded-xl p-3 flex items-center space-x-2.5">
            {liveProject.progress === 100 ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : (
              <AlertCircle size={16} className="text-blue-500" />
            )}
            <div className="flex-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Completion</p>
              <span className="text-xs font-extrabold text-slate-700">{liveProject.progress}% Done</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STANDARD CARD VIEW (Kept fully intact) ---
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between relative transition hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md ${project.statusColor}`}>
            {project.status}
          </span>
          <span className="text-xs text-gray-400 font-medium">ID: {project.id}</span>
        </div>
        
        <div className="flex items-center -space-x-2">
          <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src={project.avatars[0]} alt="Talent" />
          {project.status === 'ACTIVE' && (
            <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">
              +2
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">{project.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xl">{project.description}</p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-50">
        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-700">{project.stage}</span>
            <span className="text-gray-500">{project.progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${project.progressBarColor}`} 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* MODIFIED BUTTON PART ONLY: Changes action trigger target state locally */}
        <button 
          onClick={() => setIsViewingDetails(true)}
          className="text-sm px-5 py-2 rounded-full transition whitespace-nowrap border border-gray-200 text-blue-600 hover:bg-gray-50 font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}