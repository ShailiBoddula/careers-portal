import React from 'react';
import { Sparkles, Heart, Award, Users, Coffee, Rocket, Globe } from 'lucide-react';

export default function SectionRenderer({ section, primaryColor = '#2563eb' }) {
  const { section_type, title, content } = section;

  switch (section_type) {
    case 'hero':
      return (
        <section className="py-16 md:py-24 text-center px-4 max-w-4xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <Sparkles className="w-3.5 h-3.5" /> We Are Hiring
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            {title || 'Join Our Growing Team'}
          </h1>
          {content && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {content}
            </p>
          )}
        </section>
      );

    case 'about':
      return (
        <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              {title || 'About Us'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>
        </section>
      );

    case 'values': {
      const valueItems = content ? content.split('|').map((v) => v.trim()) : [];
      return (
        <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {title || 'Our Values'}
            </h2>
            <p className="text-sm text-slate-500">The core tenets that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {valueItems.map((val, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">{val}</h3>
                <p className="text-xs text-slate-500 mt-auto pt-2">
                  Demonstrated daily in our product craftsmanship and cross-team collaboration.
                </p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'life':
      return (
        <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 sm:p-12 shadow-lg">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              <Users className="w-4 h-4" /> Day-to-Day Life
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title || 'Life at Company'}</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>
        </section>
      );

    case 'culture':
      return (
        <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{title || 'Our Culture'}</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>
        </section>
      );

    case 'benefits': {
      const perkItems = content ? content.split('|').map((p) => p.trim()) : [];
      return (
        <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {title || 'Benefits & Perks'}
            </h2>
            <p className="text-sm text-slate-500">We invest in our people so they can do their life's best work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {perkItems.map((perk, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{perk}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'open_positions':
      return (
        <div className="pt-8 pb-4 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {title || 'Open Positions'}
          </h2>
          {content && <p className="text-sm text-slate-500">{content}</p>}
        </div>
      );

    default:
      return null;
  }
}
