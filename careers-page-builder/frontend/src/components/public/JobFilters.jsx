import React from 'react';
import { Search, MapPin, Briefcase, RotateCcw } from 'lucide-react';
import { Button } from '../common/UI';

export default function JobFilters({
  search,
  setSearch,
  location,
  setLocation,
  jobType,
  setJobType,
  locations = [],
  jobTypes = [],
  onReset,
  totalResults = 0,
}) {
  const hasActiveFilters = Boolean(search || location || jobType);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, keyword, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus-ring placeholder-slate-400 focus:bg-white transition"
          />
        </div>

        {/* Location select */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Filter by Location"
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus-ring focus:bg-white transition appearance-none"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type select */}
        <div className="md:col-span-3 relative">
          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            aria-label="Filter by Job Type"
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus-ring focus:bg-white transition appearance-none"
          >
            <option value="">All Job Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        <div className="md:col-span-1 flex justify-end">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition text-xs font-medium w-full md:w-auto"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4 mr-1 md:mr-0" />
              <span className="md:hidden">Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{totalResults}</strong> open{' '}
          {totalResults === 1 ? 'position' : 'positions'}
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 font-medium">Filters active</span>
        )}
      </div>
    </div>
  );
}
