// FilterBar - dropdowns for category, location, type plus search
import React from 'react';

const FilterBar = ({ filters, onChange }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="form-input"
        placeholder="Search by title or company..."
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      
      <select
        className="form-select"
        value={filters.category || ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">Category</option>
        <option value="tech">Tech</option>
        <option value="marketing">Marketing</option>
        <option value="design">Design</option>
        <option value="finance">Finance</option>
      </select>
      
      <select
        className="form-select"
        value={filters.location || ''}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
      >
        <option value="">Location</option>
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
      </select>
      
      <select
        className="form-select"
        value={filters.type || ''}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      >
        <option value="">Type</option>
        <option value="internship">Internship</option>
        <option value="part-time">Part-time</option>
        <option value="full-time">Full-time</option>
      </select>
    </div>
  );
};

export default FilterBar;