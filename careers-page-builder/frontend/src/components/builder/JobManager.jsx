import React, { useState } from 'react';
import { Button, Input, Textarea, Select } from '../common/UI';
import { Plus, X, Briefcase, MapPin, Building, ToggleLeft, ToggleRight, Trash2, Edit2 } from 'lucide-react';

export default function JobManager({
  jobs = [],
  onCreateJob,
  onUpdateJob,
  onDeleteJob,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    job_type: 'Full-time',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    application_url: '',
    is_active: true,
  });

  const [formError, setFormError] = useState(null);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Engineering',
      location: '',
      job_type: 'Full-time',
      description: '',
      responsibilities: '',
      requirements: '',
      benefits: '',
      application_url: '',
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      department: job.department || 'Engineering',
      location: job.location || '',
      job_type: job.job_type || 'Full-time',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      application_url: job.application_url || '',
      is_active: job.is_active ?? true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Job title is required');
      return;
    }

    try {
      if (editingJob) {
        await onUpdateJob(editingJob.id, formData);
      } else {
        await onCreateJob(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save job');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Job Postings</h3>
          <p className="text-xs text-slate-500">
            Active jobs are displayed on your public Careers page
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1" /> Post New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No jobs posted yet</p>
          <p className="text-xs text-slate-500 mb-4">
            Create your first open role to attract top candidates.
          </p>
          <Button variant="outline" size="sm" onClick={openCreateModal}>
            Create Job
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`p-4 bg-white rounded-xl border transition flex items-center justify-between gap-4 ${
                job.is_active ? 'border-slate-200 shadow-sm' : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{job.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      job.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {job.department && <span>{job.department}</span>}
                  {job.location && <span>• {job.location}</span>}
                  {job.job_type && <span>• {job.job_type}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Toggle Active status */}
                <button
                  type="button"
                  onClick={() => onUpdateJob(job.id, { is_active: !job.is_active })}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus-ring"
                  title={job.is_active ? 'Deactivate Job' : 'Activate Job'}
                >
                  {job.is_active ? (
                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(job)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition focus-ring"
                  title="Edit Job"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteJob(job.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition focus-ring"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingJob ? 'Edit Job Posting' : 'Create Job Posting'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Job Title *"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Engineering"
                />

                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote (US)"
                />

                <Select
                  label="Employment Type"
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  options={[
                    { value: 'Full-time', label: 'Full-time' },
                    { value: 'Part-time', label: 'Part-time' },
                    { value: 'Contract', label: 'Contract' },
                    { value: 'Internship', label: 'Internship' },
                  ]}
                />
              </div>

              <Textarea
                label="Overview / Description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the role and team..."
              />

              <Textarea
                label="Key Responsibilities"
                rows={3}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Responsibilities and day-to-day deliverables..."
              />

              <Textarea
                label="Requirements & Qualifications"
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Required technical experience, years of experience..."
              />

              <Textarea
                label="Compensation & Benefits"
                rows={2}
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Salary range, equity, health benefits..."
              />

              <Input
                label="Application URL (External link)"
                type="url"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                placeholder="https://company.workable.com/apply/..."
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="job-active-checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus-ring"
                />
                <label htmlFor="job-active-checkbox" className="text-xs font-semibold text-slate-700">
                  Publish this job immediately to the public board
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
