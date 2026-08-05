import React from "react";

export default function StepCard({ number, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 h-full flex flex-col justify-between">
      <div>
        <div className="text-4xl font-bold text-blue-600 mb-4">
          {number}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}