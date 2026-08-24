import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const GITHUB_API_URL = 'https://api.github.com/users/google/repos?sort=stars&per_page=9';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch(GITHUB_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <section className="projects-section">
        <LoadingSpinner />
      </section>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <section className="projects-section">
        <ErrorMessage message={error} onRetry={fetchRepos} />
      </section>
    );
  }

  /* ── Success state ── */
  return (
    <section className="projects-section">
      <div className="section-header">
        <span className="section-subtitle">Live from GitHub</span>
        <h2 className="section-title">Open-Source Repos</h2>
        <div className="section-divider"></div>
      </div>

      <div className="projects-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="project-card repo-card">
            <div className="repo-lang-dot" title={repo.language || 'Unknown'}>
              {repo.language || '—'}
            </div>
            <h3 className="project-title">{repo.name}</h3>
            <p className="project-desc">
              {repo.description || 'No description provided.'}
            </p>

            <div className="repo-meta">
              <span className="repo-stat" title="Stars">⭐ {repo.stargazers_count.toLocaleString()}</span>
              <span className="repo-stat" title="Forks">🍴 {repo.forks_count.toLocaleString()}</span>
            </div>

            <a
              href={repo.html_url}
              className="project-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
