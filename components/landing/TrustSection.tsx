import React from 'react';
import { motion } from 'framer-motion';

export const TrustSection = () => {
    return (
        <section className="py-24 bg-white border-y border-slate-200">
            <div className="container-custom">
                {/* Logos */}
                <div className="text-center mb-16">
                    <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-8">Trusted by Engineering Teams at</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                         {/* Placeholder Logos - using text for now as generic SVGs */}
                         {['Acme Corp', 'GlobalBank', 'TechFlow', 'DataSystems', 'CloudScale'].map((logo) => (
                             <span key={logo} className="text-xl font-bold font-mono text-slate-400 hover:text-slate-800 transition-colors">{logo}</span>
                         ))}
                    </div>
                </div>

                {/* Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-12 overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-slate-500">
                            <path d="M14.017 21L14.017 18C14.017 16.054 15.337 14.502 17.584 13.918L18.498 13.682C18.673 13.636 18.784 13.457 18.739 13.284L18.337 11.666C18.293 11.492 18.115 11.383 17.94 11.428L17.025 11.664C15.868 11.966 15.011 12.607 14.595 13.37L14.017 21ZM5.01697 21L5.01697 18C5.01697 16.054 6.33697 14.502 8.58397 13.918L9.49797 13.682C9.67297 13.636 9.78397 13.457 9.73897 13.284L9.33697 11.666C9.29297 11.492 9.11497 11.383 8.93997 11.428L8.02497 11.664C6.86797 11.966 6.01097 12.607 5.59497 13.37L5.01697 21Z" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10 text-center">
                        <blockquote className="text-2xl md:text-3xl font-light text-slate-900 leading-relaxed mb-8">
                            "Before Viktron, we were flying blind. Now we have full visibility into every agent interaction, and our error rate dropped by <span className="text-emerald-600 font-semibold">85%</span> in the first week."
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-right">
                                <div className="text-slate-900 font-bold">Sarah Jenkins</div>
                                <div className="text-blue-600 text-sm">CTO, TechFlow Enterprise</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" alt="Sarah Jenkins" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
