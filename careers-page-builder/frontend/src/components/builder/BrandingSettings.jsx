import React, { useState } from 'react';
import { Input } from '../common/UI';
import { Palette, Image, Video } from 'lucide-react';

export default function BrandingSettings({ company, onUpdate }) {
  const [formData, setFormData] = useState({
    name: company.name || '',
    primary_color: company.primary_color || '#2563eb',
    secondary_color: company.secondary_color || '#1e40af',
    logo_url: company.logo_url || '',
    banner_url: company.banner_url || '',
    culture_video_url: company.culture_video_url || '',
  });

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Palette className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900">Brand Identity & Styling</h3>
      </div>

      <Input
        label="Company Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="e.g. Acme Corporation"
      />

      {/* Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Primary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.primary_color}
              onChange={(e) => handleChange('primary_color', e.target.value)}
              className="w-9 h-9 p-0.5 border border-slate-200 rounded-lg cursor-pointer bg-white"
            />
            <input
              type="text"
              value={formData.primary_color}
              onChange={(e) => handleChange('primary_color', e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
              placeholder="#2563eb"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Secondary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.secondary_color}
              onChange={(e) => handleChange('secondary_color', e.target.value)}
              className="w-9 h-9 p-0.5 border border-slate-200 rounded-lg cursor-pointer bg-white"
            />
            <input
              type="text"
              value={formData.secondary_color}
              onChange={(e) => handleChange('secondary_color', e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
              placeholder="#1e40af"
            />
          </div>
        </div>
      </div>

      {/* Media Assets */}
      <Input
        label="Logo Image URL"
        type="url"
        value={formData.logo_url}
        onChange={(e) => handleChange('logo_url', e.target.value)}
        placeholder="https://example.com/logo.png"
        helperText="Recommended size: 256x256 square PNG or SVG"
      />

      <Input
        label="Header Banner Image URL"
        type="url"
        value={formData.banner_url}
        onChange={(e) => handleChange('banner_url', e.target.value)}
        placeholder="https://images.unsplash.com/photo-..."
        helperText="High-resolution landscape image (1600x600 recommended)"
      />

      <Input
        label="Culture Video URL (YouTube embed or video URL)"
        type="url"
        value={formData.culture_video_url}
        onChange={(e) => handleChange('culture_video_url', e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        helperText="Showcase team culture, employee testimonials, or company mission"
      />
    </div>
  );
}
