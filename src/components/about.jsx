import React from 'react';

export default function About({ profile }) {
  if (!profile) return null;

  const { name, tagline, bio, avatarUrl, stats } = profile;

  return (
    <section id="about" className="about-section">
      <div className="section-header">
        <span className="section-subtitle">Meet the Developer</span>
        <h2 className="section-title">About Me</h2>
      </div>

      <div className="about-grid">
        <div className="about-image-container">
          <div className="avatar-glow"></div>
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name || 'Profile Avatar'} 
              className="about-avatar"
            />
          ) : (
            <div className="about-avatar-fallback"></div>
          )}
        </div>

        <div className="about-content">
          <h3 className="about-name">{name}</h3>
          <p className="about-tagline">{tagline}</p>
          <p className="about-bio">{bio}</p>

          <div className="stats-container">
            {stats && stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
