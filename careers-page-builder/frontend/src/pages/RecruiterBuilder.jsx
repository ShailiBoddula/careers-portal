import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Button,
  Input,
  Textarea,
  LoadingSpinner,
  ErrorState,
} from '../components/common/UI';
import SectionEditor from '../components/builder/SectionEditor';
import JobManager from '../components/builder/JobManager';
import BrandingSettings from '../components/builder/BrandingSettings';
import SectionRenderer from '../components/public/SectionRenderer';
import JobCard from '../components/public/JobCard';

import {
  Sparkles,
  Save,
  Send,
  Eye,
  Copy,
  ExternalLink,
  Plus,
  Monitor,
  Smartphone,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function RecruiterBuilder() {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [company, setCompany] = useState(null);
  const [careerPage, setCareerPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  // Active tab in sidebar
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'branding' | 'jobs'

  // Live preview mode
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [compData, pageData, secData, jobData] = await Promise.all([
          api.getMyCompany(),
          api.getCareerPage(),
          api.getSections(),
          api.getJobs(),
        ]);

        setCompany(compData);
        setCareerPage(pageData);
        setSections(secData);
        setJobs(jobData);
      } catch (err) {
        setError(err.message || 'Failed to load builder workspace');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  // Section handlers
  const handleAddSection = async (type) => {
    try {
      const defaultTitles = {
        hero: 'Welcome to Our Careers',
        about: 'About Our Team',
        life: 'Life at the Office',
        culture: 'Our Core Engineering Culture',
        benefits: 'Health, Wealth & Time-off',
        values: 'Our Operating Principles',
        open_positions: 'Current Open Positions',
      };

      const newSection = await api.createSection({
        section_type: type,
        title: defaultTitles[type] || 'New Section',
        content: '',
        display_order: sections.length,
        is_visible: true,
      });

      setSections([...sections, newSection]);
      setHasUnsavedChanges(true);
    } catch (err) {
      alert('Error creating section: ' + err.message);
    }
  };

  const handleUpdateSection = async (id, data) => {
    try {
      const updated = await api.updateSection(id, data);
      setSections(sections.map((s) => (s.id === id ? updated : s)));
      setHasUnsavedChanges(true);
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Are you sure you want to remove this section?')) return;
    try {
      await api.deleteSection(id);
      setSections(sections.filter((s) => s.id !== id));
      setHasUnsavedChanges(true);
    } catch (err) {
      alert('Error deleting section: ' + err.message);
    }
  };

  const handleToggleVisibility = async (id, isVisible) => {
    try {
      const updated = await api.updateSection(id, { is_visible: isVisible });
      setSections(sections.map((s) => (s.id === id ? updated : s)));
      setHasUnsavedChanges(true);
    } catch (err) {
      alert('Error updating visibility: ' + err.message);
    }
  };

  const handleMoveSection = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update display orders
    const reorderPayload = newSections.map((s, idx) => ({
      id: s.id,
      display_order: idx,
    }));

    try {
      const reordered = await api.reorderSections(reorderPayload);
      setSections(reordered);
      setHasUnsavedChanges(true);
    } catch (err) {
      alert('Error reordering sections: ' + err.message);
    }
  };

  // Job handlers
  const handleCreateJob = async (jobData) => {
    const created = await api.createJob(jobData);
    setJobs([created, ...jobs]);
  };

  const handleUpdateJob = async (id, jobData) => {
    const updated = await api.updateJob(id, jobData);
    setJobs(jobs.map((j) => (j.id === id ? updated : j)));
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    await api.deleteJob(id);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  // Branding handler
  const handleUpdateBranding = async (brandData) => {
    setCompany({ ...company, ...brandData });
    setHasUnsavedChanges(true);
  };

  // Save draft
  const handleSaveDraft = async () => {
    try {
      setSaveStatus('saving');
      await Promise.all([
        api.updateMyCompany({
          name: company.name,
          primary_color: company.primary_color,
          secondary_color: company.secondary_color,
          logo_url: company.logo_url,
          banner_url: company.banner_url,
          culture_video_url: company.culture_video_url,
        }),
        api.updateCareerPage({
          headline: careerPage.headline,
          description: careerPage.description,
        }),
      ]);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
      alert('Failed to save draft: ' + err.message);
    }
  };

  // Publish / Unpublish
  const handleTogglePublish = async () => {
    try {
      setPublishLoading(true);
      if (careerPage.published) {
        if (!window.confirm('Unpublishing will hide your careers board from public visitors. Continue?')) {
          setPublishLoading(false);
          return;
        }
        const updated = await api.unpublishCareerPage();
        setCareerPage(updated);
      } else {
        // Save any pending changes before publishing
        await handleSaveDraft();
        const updated = await api.publishCareerPage();
        setCareerPage(updated);
      }
    } catch (err) {
      alert('Error changing publish status: ' + err.message);
    } finally {
      setPublishLoading(false);
    }
  };

  const handleCopyPublicUrl = () => {
    const publicUrl = `${window.location.origin}/${company.slug}/careers`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  if (loading) return <LoadingSpinner message="Initializing Recruiter Studio..." />;
  if (error) return <ErrorState title="Builder Error" message={error} />;

  const primaryColor = company?.primary_color || '#2563eb';
  const publicCareersPath = `/${company.slug}/careers`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {company.logo_url ? (
              <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              company.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-none">{company.name}</h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  careerPage.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {careerPage.published ? 'Published' : 'Draft Only'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Careers Page Studio</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasUnsavedChanges && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> Unsaved changes
            </span>
          )}

          {saveStatus === 'saved' && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Draft Saved
            </span>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={saveStatus === 'saving'}
            title="Save draft without publishing"
          >
            <Save className="w-4 h-4 mr-1" /> Save Draft
          </Button>

          <Button
            variant={careerPage.published ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleTogglePublish}
            isLoading={publishLoading}
            style={!careerPage.published ? { backgroundColor: primaryColor } : undefined}
          >
            <Send className="w-4 h-4 mr-1" />
            {careerPage.published ? 'Unpublish' : 'Publish to Web'}
          </Button>

          <button
            onClick={handleCopyPublicUrl}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition focus-ring"
            title="Copy Public Careers URL"
          >
            <Copy className="w-4 h-4" />
          </button>

          <a
            href={publicCareersPath}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition focus-ring"
            title="Open Live Public Page"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition focus-ring"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace: Split Pane (Editor / Live Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar / Editor */}
        <div className="w-full lg:w-[480px] xl:w-[520px] bg-white border-r border-slate-200 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Navigation tabs */}
          <div className="flex border-b border-slate-200 px-4 pt-3 gap-2 bg-slate-50/50 sticky top-0 z-20">
            <button
              onClick={() => setActiveTab('sections')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                activeTab === 'sections'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Page Sections ({sections.length})
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                activeTab === 'branding'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Branding & Media
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Jobs ({jobs.length})
            </button>
          </div>

          <div className="p-5 space-y-6 flex-1">
            {/* TAB 1: SECTIONS */}
            {activeTab === 'sections' && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Add Pre-Built Section
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'hero', label: '+ Hero Section' },
                      { type: 'about', label: '+ About Us' },
                      { type: 'values', label: '+ Core Values' },
                      { type: 'life', label: '+ Life at Co.' },
                      { type: 'culture', label: '+ Culture' },
                      { type: 'benefits', label: '+ Benefits' },
                      { type: 'open_positions', label: '+ Open Positions' },
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleAddSection(item.type)}
                        className="text-left text-xs font-semibold p-2 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition shadow-2xs"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Arranged Sections</span>
                    <span>Use ↑ / ↓ to reorder</span>
                  </div>

                  {sections.map((section, idx) => (
                    <SectionEditor
                      key={section.id}
                      section={section}
                      index={idx}
                      totalSections={sections.length}
                      onMoveUp={() => handleMoveSection(idx, -1)}
                      onMoveDown={() => handleMoveSection(idx, 1)}
                      onToggleVisibility={handleToggleVisibility}
                      onUpdate={handleUpdateSection}
                      onDelete={handleDeleteSection}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: BRANDING */}
            {activeTab === 'branding' && (
              <BrandingSettings company={company} onUpdate={handleUpdateBranding} />
            )}

            {/* TAB 3: JOBS */}
            {activeTab === 'jobs' && (
              <JobManager
                jobs={jobs}
                onCreateJob={handleCreateJob}
                onUpdateJob={handleUpdateJob}
                onDeleteJob={handleDeleteJob}
              />
            )}
          </div>
        </div>

        {/* Right Pane: Live Interactive Device Preview */}
        <div className="flex-1 bg-slate-200/70 p-4 sm:p-6 flex flex-col items-center overflow-y-auto h-auto lg:h-[calc(100vh-4rem)]">
          {/* Device toggle toolbar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1.5 flex items-center gap-2 mb-4 sticky top-0 z-30">
            <span className="text-xs font-semibold text-slate-500 pl-2">Live Preview:</span>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button
              onClick={handleCopyPublicUrl}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 px-2"
            >
              {copiedUrl ? 'Copied Public URL!' : 'Copy Public URL'}
            </button>
          </div>

          {/* Device Frame */}
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden flex flex-col ${
              previewDevice === 'mobile' ? 'w-full max-w-[390px] min-h-[780px]' : 'w-full max-w-5xl min-h-[850px]'
            }`}
          >
            {/* Mock browser header */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 bg-white rounded border border-slate-200 px-3 py-0.5 text-[11px] font-mono text-slate-600 truncate">
                https://careers.company.com/{company.slug}/careers (Preview Mode)
              </div>
            </div>

            {/* Preview Document Canvas */}
            <div className="flex-1 overflow-y-auto bg-slate-50">
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{company.name}</span>
                </div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Open Roles
                </button>
              </div>

              {/* Banner */}
              {company.banner_url && (
                <div className="w-full h-40 sm:h-52 relative overflow-hidden bg-slate-900">
                  <img src={company.banner_url} alt="Banner" className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <h2 className="text-xl sm:text-2xl font-bold">{company.name} Careers</h2>
                  </div>
                </div>
              )}

              {/* Render Visible Sections */}
              <div className="py-4 space-y-4">
                {sections
                  .filter((s) => s.is_visible)
                  .map((sec) => (
                    <SectionRenderer key={sec.id} section={sec} primaryColor={primaryColor} />
                  ))}
              </div>

              {/* Open Jobs Preview */}
              <div className="py-8 px-6 max-w-4xl mx-auto border-t border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 text-center">
                  Open Opportunities
                </h3>
                <p className="text-xs text-slate-500 text-center mb-6">
                  Previewing {jobs.filter((j) => j.is_active).length} active roles
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jobs
                    .filter((j) => j.is_active)
                    .map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        companySlug={company.slug}
                        primaryColor={primaryColor}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
