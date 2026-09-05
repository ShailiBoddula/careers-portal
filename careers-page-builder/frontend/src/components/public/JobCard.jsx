import React from 'react';
import { MapPin, Briefcase, Building, Calendar, ExternalLink } from 'lucide-react';

export default function JobCard({ job, companySlug, primaryColor = '#2563eb' }) {
  const formattedDate = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
            {job.title}
          </h3>
          {job.job_type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
              {job.job_type}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 mb-3">
          {job.department && (
            <span className="inline-flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {job.department}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
          )}
          {formattedDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
          )}
        </div>

        {job.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <a
          href={`/${companySlug}/careers/jobs/${job.id}`}
          className="text-xs font-bold transition flex items-center gap-1 hover:underline"
          style={{ color: primaryColor }}
        >
          View Job Details
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
