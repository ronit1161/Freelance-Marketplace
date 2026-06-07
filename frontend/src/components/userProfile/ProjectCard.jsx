// import React from 'react';

export default function ProjectCard({ project }) {
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
        <button className={`text-sm px-5 py-2 rounded-full transition whitespace-nowrap ${project.actionStyle}`}>
          {project.actionLabel}
        </button>
      </div>
    </div>
  );
}