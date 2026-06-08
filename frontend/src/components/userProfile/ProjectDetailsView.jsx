// import React from 'react';
import { api } from '../../Services/api';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProjectDetailsView({ projectId, onBackClick }) {
  // Query our hard-coded database directly using the passed ID parameter
  const project = api.getProjectById(projectId);

  if (!project) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <p className="text-sm font-semibold text-gray-500">Project data not found.</p>
        <button onClick={onBackClick} className="mt-4 text-xs font-bold text-blue-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <button 
        onClick={onBackClick}
        className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft size={16} /> <span>Back to Workspace</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md ${project.statusColor}`}>
                {project.status}
              </span>
              <span className="text-xs text-gray-400 font-medium">ID: #{project.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project.title}</h1>
          </div>

          <div className="flex items-center -space-x-2">
            {project.avatars.map((avatar, idx) => (
              <img key={idx} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src={avatar} alt="Talent Assigned" />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Brief & Deliverables</h4>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="border border-gray-100 rounded-xl p-4 flex items-center space-x-3">
            <Clock size={20} className="text-blue-500" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Pipeline</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{project.stage}</p>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded-xl p-4 flex items-center space-x-3">
            {project.progress === 100 ? (
              <CheckCircle2 size={20} className="text-emerald-500" />
            ) : (
              <AlertCircle size={20} className="text-blue-500" />
            )}
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Progress</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full">
                  <div className={`h-1.5 rounded-full ${project.progressBarColor}`} style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-xs font-bold text-slate-700">{project.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}