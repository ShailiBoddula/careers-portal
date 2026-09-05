import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner, ErrorState, Button } from '../components/common/UI';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Share2,
  Check,
} from 'lucide-react';

export default function JobDetail() {
  const { companySlug, jobId } = useParams();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJobAndCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch public careers for company branding & the specific job details
        const [careersData, jobData] = await Promise.all([
          api.getPublicCareers(companySlug),
          api.getPublicJobDetail(companySlug, jobId),
        ]);
        setCompany(careersData.company);
        setJob(jobData);
      } catch (err) {
        setError(err.message || 'Unable to retrieve job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndCompany();
  }, [companySlug, jobId]);

  // Set Google JobPosting Schema JSON-LD for SEO
  useEffect(() => {
    if (!job || !company) return;

    document.title = `${job.title} | Careers at ${company.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        job.description || `${job.title} job opening at ${company.name} in ${job.location || 'various locations'}.`
      );
    }

    const jsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title: job.title,
      description: job.description || job.responsibilities || job.requirements || job.title,
      datePosted: job.posted_at,
      employmentType: job.job_type === 'Full-time' ? 'FULL_TIME' : 'OTHER',
      hiringOrganization: {
        '@type': 'Organization',
        name: company.name,
        sameAs: window.location.origin,
        logo: company.logo_url || undefined,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.location || 'Remote',
        },
      },
    };

    let scriptTag = document.getElementById('job-schema-jsonld');
    if (scriptTag) {
      scriptTag.text = JSON.stringify(jsonLd);
    }

    return () => {
      if (scriptTag) scriptTag.text = '';
    };
  }, [job, company]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <LoadingSpinner message="Loading job opening..." />;

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <ErrorState
          title="Job Listing Unavailable"
          message={error || 'This job is no longer active.'}
        />
      </div>
    );
  }

  const primaryColor = company?.primary_color || '#2563eb';
  const formattedDate = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to={`/${companySlug}/careers`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {company?.name || 'Careers'}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              title="Copy job link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>

            {job.application_url ? (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-4 py-2 rounded-lg text-white transition focus-ring shadow-sm inline-flex items-center gap-1.5"
                style={{ backgroundColor: primaryColor }}
              >
                Apply Now <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                disabled
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed"
              >
                Applications Closed
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Job Detail Container */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          {/* Header metadata */}
          <div className="border-b border-slate-100 pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {job.job_type && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                  {job.job_type}
                </span>
              )}
              {job.department && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {job.department}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-snug">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500">
              {job.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.department && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{job.department}</span>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Posted {formattedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job description */}
          {job.description && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Overview</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h2>
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Qualifications & Requirements</h2>
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Compensation & Perks</h2>
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.benefits}
              </div>
            </div>
          )}

          {/* Apply CTA Card */}
          <div className="bg-slate-50 rounded-xl p-6 sm:p-8 border border-slate-200 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">Interested in this role?</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 max-w-md mx-auto">
              Click below to proceed to our official application form. We review all applications within 3 business days.
            </p>
            {job.application_url ? (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white transition shadow-sm hover:opacity-95 focus-ring"
                style={{ backgroundColor: primaryColor }}
              >
                Apply for this Position <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-xs font-medium text-slate-400">Applications currently closed</p>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {company?.name}. Equal Opportunity Employer.</p>
      </footer>
    </div>
  );
}
