import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const AboutSection = () => {
    const { user } = useAuth();
    const bio = user?.bioData || "No biography provided yet. Edit your profile to tell clients about your background and expertise.";

    return (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
                About Me
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {bio}
            </p>
        </section>
    );
};

export default AboutSection;