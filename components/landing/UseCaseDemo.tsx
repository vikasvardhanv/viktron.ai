import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, CheckCircle, Clock } from 'lucide-react';

export const UseCaseDemo = () => {
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Enterprise Success Stories</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        See how global companies accelerate operations with Viktron.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Customer Support',
                            desc: 'Automate 80% of Tier-1 queries',
                            metric: '90% faster resolution',
                            img: '/visuals/tech-support.jpg',
                            icon: Bot
                        },
                        {
                            title: 'Sales Pipeline',
                            desc: 'Automated lead scoring and outreach',
                            metric: '3x qualified leads',
                            img: '/visuals/sales-pipeline.jpg',
                            icon: ArrowRight
                        },
                        {
                            title: 'Compliance Audit',
                            desc: 'Real-time policy enforcement',
                            metric: '100% coverage',
                            img: '/visuals/compliance-audit.jpg',                            icon: CheckCircle
                        }
                    ].map((useCase, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            {/* Image Background */}
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10" />
                                <img 
                                    src={useCase.img} 
                                    alt={useCase.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-lg border border-slate-200 shadow-sm">
                                    <useCase.icon className="text-slate-700" size={20} />
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 relative z-20 -mt-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono mb-4 shadow-sm">
                                    <Clock size={12} />
                                    {useCase.metric}
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {useCase.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {useCase.desc}
                                </p>
                                
                                <button className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-all flex items-center justify-center gap-2 group-hover:border-blue-200 shadow-sm">
                                    See Case Study <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
