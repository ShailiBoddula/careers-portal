import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner, ErrorState, EmptyState, Button } from '../components/common/UI';
import SectionRenderer from '../components/public/SectionRenderer';
import JobCard from '../components/public/JobCard';
import JobFilters from '../components/public/JobFilters';
import { Play, Globe, ArrowUpRight } from 'lucide-react';

export default function PublicCareers() {
  const { companySlug } = useParams();
  const [data, setData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const fetchCareersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPublicCareers(companySlug);
      setData(res);
      setJobs(res.jobs || []);
    } catch (err) {
      setError(err.message || 'Unable to load careers page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareersData();
  }, [companySlug]);

  // Update SEO metadata & document title
  useEffect(() => {
    if (data?.company) {
      document.title = `Careers at ${data.company.name} | Work With Us`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          data.career_page?.description ||
            `Explore open career opportunities at ${data.company.name}. Build the future with our team.`
        );
      }
    }
  }, [data]);

  // Handle live filtering
  useEffect(() => {
    if (!data) return;
    const fetchFilteredJobs = async () => {
      try {
        const filtered = await api.getPublicJobs(companySlug, { search, location, jobType });
        setJobs(filtered);
      } catch (err) {
        console.error('Failed to filter jobs:', err);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredJobs();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, location, jobType, companySlug, data]);

  if (loading) return <LoadingSpinner message="Loading careers page..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <ErrorState
          title="Page Unavailable"
          message={error}
          onRetry={fetchCareersData}
        />
      </div>
    );
  }

  const { company, career_page, sections } = data;
  const primaryColor = company?.primary_color || '#2563eb';
  const secondaryColor = company?.secondary_color || '#1e40af';

  // Extract unique locations and job types from all company jobs for filter options
  const allLocations = Array.from(new Set(data.jobs.map((j) => j.location).filter(Boolean)));
  const allJobTypes = Array.from(new Set(data.jobs.map((j) => j.job_type).filter(Boolean)));

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Dynamic Brand Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                className="w-8 h-8 rounded-lg object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center text-sm shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {company.name.charAt(0)}
              </div>
            )}
            <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              {company.name}
            </span>
          </div>

          <a
            href="#open-jobs"
            className="text-xs font-semibold px-4 py-2 rounded-lg text-white transition focus-ring shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            View Open Roles
          </a>
        </div>
      </header>

      {/* Hero Banner Image (if available) */}
      {company.banner_url && (
        <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden bg-slate-900">
          <img
            src={company.banner_url}
            alt={`${company.name} office and team banner`}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 sm:px-6 text-white">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {career_page.headline || `Careers at ${company.name}`}
            </h1>
            {career_page.description && (
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-2xl drop-shadow">
                {career_page.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1 pb-16">
        {/* Render sections in display order */}
        {sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            primaryColor={primaryColor}
          />
        ))}

        {/* Culture Video Embed (if provided) */}
        {company.culture_video_url && (
          <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>
                <Play className="w-4 h-4 fill-current" /> Watch Our Story
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Life and Mission in Motion</h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                {company.culture_video_url.includes('youtube.com') || company.culture_video_url.includes('youtu.be') ? (
                  <iframe
                    src={
                      company.culture_video_url.includes('watch?v=')
                        ? company.culture_video_url.replace('watch?v=', 'embed/')
                        : company.culture_video_url
                    }
                    title={`${company.name} Culture Video`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <Play className="w-12 h-12 mb-3 text-slate-500" />
                    <p className="text-sm font-medium">Culture Video Link</p>
                    <a
                      href={company.culture_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      Watch Video in new window <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Jobs Section */}
        <section id="open-jobs" className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Explore Open Positions
            </h2>
            <p className="text-sm text-slate-500">
              Find your next career chapter with us. Filter by title, department, and work model.
            </p>
          </div>

          <JobFilters
            search={search}
            setSearch={setSearch}
            location={location}
            setLocation={setLocation}
            jobType={jobType}
            setJobType={setJobType}
            locations={allLocations}
            jobTypes={allJobTypes}
            onReset={handleResetFilters}
            totalResults={jobs.length}
          />

          {jobs.length === 0 ? (
            <EmptyState
              title="No open positions match your criteria"
              message="Try adjusting your search keywords or clearing location/job type filters."
              action={
                <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  companySlug={companySlug}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Dynamic Brand Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{company.name}</span>
            <span>•</span>
            <span>Powered by Multi-Tenant ATS Page Builder</span>
          </div>
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
