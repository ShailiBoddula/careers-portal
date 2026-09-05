import React, { useState } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { Button, Input, Textarea } from '../common/UI';

export default function SectionEditor({
  section,
  index,
  totalSections,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title || '');
  const [content, setContent] = useState(section.content || '');

  const handleSave = () => {
    onUpdate(section.id, { title, content });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(section.title || '');
    setContent(section.content || '');
    setIsEditing(false);
  };

  const sectionTypeLabels = {
    hero: 'Hero Section',
    about: 'About Us',
    life: 'Life at Company',
    culture: 'Culture & Engineering',
    benefits: 'Benefits & Perks',
    values: 'Company Values',
    open_positions: 'Open Positions Listing',
  };

  return (
    <div
      className={`bg-white rounded-xl border transition duration-150 ${
        section.is_visible
          ? 'border-slate-200 shadow-sm'
          : 'border-slate-200 bg-slate-50/70 opacity-60'
      }`}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        {/* Left: Reorder controls & Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Accessible Keyboard Reordering Buttons */}
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5" role="group" aria-label="Reorder section">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition focus-ring"
              title="Move Section Up (Accessible Reorder)"
              aria-label={`Move ${section.title || section.section_type} up`}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === totalSections - 1}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition focus-ring"
              title="Move Section Down (Accessible Reorder)"
              aria-label={`Move ${section.title || section.section_type} down`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {sectionTypeLabels[section.section_type] || section.section_type}
              </span>
              {!section.is_visible && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Hidden
                </span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-800 truncate mt-0.5">
              {section.title || 'Untitled Section'}
            </h4>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleVisibility(section.id, !section.is_visible)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition focus-ring"
            title={section.is_visible ? 'Hide Section' : 'Show Section'}
            aria-label={section.is_visible ? 'Hide Section' : 'Show Section'}
          >
            {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition focus-ring"
            title="Edit Section Content"
            aria-label="Edit Section Content"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(section.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition focus-ring"
            title="Delete Section"
            aria-label="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Editing Form */}
      {isEditing && (
        <div className="border-t border-slate-200 p-4 bg-slate-50/50 space-y-3 rounded-b-xl">
          <Input
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Life at Company"
          />

          <Textarea
            label="Section Content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            helperText={
              section.section_type === 'values' || section.section_type === 'benefits'
                ? 'Separate distinct items with a vertical pipe | (e.g. Item 1 | Item 2)'
                : undefined
            }
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Check className="w-3.5 h-3.5 mr-1" /> Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
