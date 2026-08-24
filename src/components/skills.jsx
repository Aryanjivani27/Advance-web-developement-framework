import { useState } from 'react';

export default function Skills({ skills }) {
  const [activeCategory, setActiveCategory] = useState('All');

  if (!skills) return null;

  // Extract unique categories, adding 'All' at the beginning
  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))];

  // Filter skills based on chosen category
  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="skills-section">
      <div className="section-header">
        <span className="section-subtitle">What I Do</span>
        <h2 className="section-title">My Expertise</h2>
        <div className="section-divider"></div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="skills-filters">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {filteredSkills.map((skill, index) => (
          <div key={index} className="skill-card">
            <div className="skill-info">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-percent">{skill.level}%</span>
            </div>
            <div className="skill-progress-bar">
              <div 
                className="skill-progress-fill" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <span className="skill-category-badge">{skill.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
